# FV_DynamicReports - Complete Technical Documentation
## Phase 1: Prequalification Questions

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Data Flow](#data-flow)
6. [Caching Strategy](#caching-strategy)
7. [File Reference Guide](#file-reference-guide)
8. [Key Functions & Classes](#key-functions--classes)

---

## Architecture Overview

### Technology Stack

**Backend**
- Framework: .NET 9.0
- ORM: Entity Framework Core
- Database: SQL Server
- Architecture: Clean Architecture (Core → Infrastructure → API)

**Frontend**
- Framework: React 18 + TypeScript
- Build Tool: Vite
- UI Library: shadcn/ui (Radix UI + Tailwind CSS)
- State Management: Zustand (selection state) + React Query (server state)
- Routing: React Router v6

### Project Structure

```
FV_DynamicReports/
├── backend/
│   ├── ReportingEngine.Core/          # Domain entities, interfaces, DTOs
│   ├── ReportingEngine.Infrastructure/ # Data access, services
│   └── ReportingEngine.API/           # Controllers, startup
└── client/
    └── src/
        ├── components/                # React components
        ├── services/                  # API client
        ├── store/                     # Zustand stores
        └── types/                     # TypeScript types
```

---

## Database Schema

### Tables Used

#### 1. Organizations
**Purpose**: Stores client/organization information

**Key Columns**:
```sql
OrganizationId (PK, bigint)
Name (nvarchar)
OrganizationType (nvarchar)  -- 'Super Client', 'Admin', 'Client', etc.
Code (nvarchar)
IsActive (bit)
```

**Filtering Logic**:
```csharp
// Only show these organization types
var validTypes = new[] { "Super Client", "Admin", "Client" };
```

**File**: [Organization.cs](file:///d:/AhaApps/FV_DynamicReports/backend/ReportingEngine.Core/Entities/Organization.cs)

#### 2. Questions
**Purpose**: Stores all questions in the system

**Key Columns**:
```sql
QuestionID (PK, bigint)
QuestionText (nvarchar)
QuestionBankId (bigint, nullable) -- Used for deduplication
SubSectionId (bigint, FK)
DisplayOrder (int)
Visible (bit)
IsMandatory (bit, nullable)
```

**File**: [Question.cs](file:///d:/AhaApps/FV_DynamicReports/backend/ReportingEngine.Core/Entities/Question.cs)

#### 3. ClientTemplates
**Purpose**: Links organizations to templates

**Key Columns**:
```sql
ClientTemplateID (PK, bigint)
ClientID (bigint, FK → Organizations)
TemplateId (bigint, FK → Templates)
DisplayOrder (int)  -- 1 = Prequalification, 2+ = Other
Visible (bit)
```

**Critical Filter**:
```csharp
DisplayOrder == 1  // ONLY Prequalification templates
Visible == true
```

---

## Backend Implementation

### TemplateService - Core Logic

**File**: [TemplateService.cs](file:///d:/AhaApps/FV_DynamicReports/backend/ReportingEngine.Infrastructure/Services/TemplateService.cs)

**Method**: [GetQuestionsForClientAsync(long clientId)](file:///d:/AhaApps/FV_DynamicReports/backend/ReportingEngine.Infrastructure/Services/TemplateService.cs#17-65)

**Step-by-Step Logic**:

```csharp
// STEP 1: Fetch all questions for client's Prequalification templates
var questions = await _context.Questions
    .Where(q => 
        q.TemplateSubSection.TemplateSection.Template.ClientTemplates
            .Any(ct => 
                ct.OrganizationId == clientId &&
                ct.DisplayOrder == 1 &&  // ONLY Prequalification
                ct.Visible
            )
    )
    .Select(q => new {
        q.QuestionId,
        Text = q.Text ?? string.Empty,
        q.QuestionBankId,
        RiskLevel = q.TemplateSubSection.TemplateSection.Template.RiskLevel,
        q.OrderNumber,
        q.IsMandatory
    })
    .ToListAsync();

// STEP 2: Group by QuestionBankId to identify duplicates
var deduplicated = questions
    .GroupBy(q => q.QuestionBankId)
    .Select(g => new QuestionDto {
        Id = (int)g.First().QuestionId,
        Text = g.First().Text,
        QuestionBankId = g.Key,
        IsDuplicate = g.Count() > 1,
        
        // CRITICAL: Only show RiskLevel if question is unique
        RiskLevel = g.Count() == 1 ? g.First().RiskLevel : null,
        
        Order = g.First().OrderNumber,
    })
    .OrderBy(q => q.QuestionBankId)  // Sort by QuestionBankId ascending
    .ToList();
```

**Why This Logic?**

1. **DisplayOrder == 1**: Filters to ONLY Prequalification templates
2. **Visible == true**: Only active templates
3. **GroupBy QuestionBankId**: Merges duplicate questions
4. **IsDuplicate flag**: Tracks if question appears multiple times
5. **RiskLevel conditional**: Only shows for unique questions

### API Endpoints

**File**: [ReportsController.cs](file:///d:/AhaApps/FV_DynamicReports/backend/ReportingEngine.API/Controllers/ReportsController.cs)

#### GET /api/reports/clients

```csharp
[HttpGet("clients")]
public async Task<IActionResult> GetClients()
{
    var validTypes = new[] { "Super Client", "Admin", "Client" };
    
    var clients = await _context.Organizations
        .Where(o => validTypes.Contains(o.OrganizationType))
        .Select(o => new { o.OrganizationId, o.Name })
        .OrderBy(o => o.Name)
        .ToListAsync();

    return Ok(clients);
}
```

#### GET /api/reports/schema/{clientId}

```csharp
[HttpGet("schema/{clientId}")]
public async Task<IActionResult> GetSchema(long clientId)
{
    var data = await _templateService.GetQuestionsForClientAsync(clientId);
    return Ok(data);
}
```

---

## Frontend Implementation

### Caching with React Query

**File**: [App.tsx](file:///d:/AhaApps/FV_DynamicReports/client/src/App.tsx)

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60,    // 1 hour - keep data in cache
      staleTime: 1000 * 60 * 5,  // 5 minutes - data fresh for 5 min
      retry: 2,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});
```

**Cache Keys**:
- `['clients']` - All clients list
- `['questions', clientId]` - Questions for specific client

### Main Page

**File**: [Index.tsx](file:///d:/AhaApps/FV_DynamicReports/client/src/pages/Index.tsx)

```typescript
const Index = () => {
  const [selectedClient, setSelectedClient] = useState<number | null>(null);

  // Fetch clients with caching
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  // Fetch questions when client is selected
  const { data: questions = [], isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['questions', selectedClient],
    queryFn: () => fetchQuestions(selectedClient!),
    enabled: !!selectedClient,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-3"><VendorStatsBlock /></div>
      <div className="lg:col-span-6">
        <QuestionsBlock questions={questions} isLoading={isLoadingQuestions} />
      </div>
      <div className="lg:col-span-3"><EMRStatsBlock /></div>
    </div>
  );
};
```

### Questions Block

**File**: [QuestionsBlock.tsx](file:///d:/AhaApps/FV_DynamicReports/client/src/components/blocks/QuestionsBlock.tsx)

**Key Features**:
- Risk Level filtering
- Text/ID search
- Checkbox selection
- Export to JSON
- Color-coded risk badges

```typescript
const filteredQuestions = useMemo(() => {
  let filtered = questions;

  // Filter by Search
  if (searchTerm) {
    filtered = filtered.filter(q =>
      q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.id.toString().includes(searchTerm)
    );
  }

  // Filter by Risk Level
  if (riskFilter !== 'all') {
    filtered = filtered.filter(q => q.riskLevel === riskFilter);
  }

  // Sort by QuestionBankId (ascending)
  return filtered.sort((a, b) => 
    (a.questionBankId || a.id) - (b.questionBankId || b.id)
  );
}, [questions, searchTerm, riskFilter]);
```

**Risk Color Function**:
```typescript
const getRiskColor = (level?: string) => {
  if (!level) return 'bg-gray-100 text-gray-800';
  
  const lower = level.toLowerCase();
  if (lower.includes('high') || lower.includes('safety') || lower.includes('critical')) {
    return 'bg-red-100 text-red-800';  // Red for critical
  }
  if (lower.includes('medium') || lower.includes('moderate')) {
    return 'bg-yellow-100 text-yellow-800';  // Yellow for medium
  }
  if (lower.includes('low')) {
    return 'bg-green-100 text-green-800';  // Green for low
  }
  return 'bg-blue-100 text-blue-800';
};
```

---

## Data Flow

### Complete Request Flow

1. **User selects client** (e.g., "Green Plains Inc." ID: 2)
2. **React Query checks cache** for `['questions', 2]`
3. **If cache miss**: `GET http://localhost:5008/api/reports/schema/2`
4. **Backend controller** calls `_templateService.GetQuestionsForClientAsync(2)`
5. **Service executes** complex JOIN query with filters
6. **Database returns** raw questions with duplicates
7. **Service groups** by QuestionBankId
8. **Service filters** RiskLevel (null for duplicates)
9. **Service sorts** by QuestionBankId ascending
10. **API returns** deduplicated JSON
11. **React Query caches** response in localStorage
12. **Component renders** questions with badges

---

## Caching Strategy

### React Query Configuration

```typescript
gcTime: 1000 * 60 * 60     // 1 hour - keep in memory
staleTime: 1000 * 60 * 5   // 5 minutes - considered fresh
retry: 2                    // Retry failed requests twice
```

**What This Means**:
- Within 5 minutes: Returns cached data instantly
- After 5 minutes: Shows cached data + refetches in background
- After 1 hour: Cache cleared if unused

### LocalStorage Persistence

**Key**: `REACT_QUERY_OFFLINE_CACHE`

**Benefits**:
- Survives page refresh
- Offline capability
- Reduces server load

### Zustand Persistence

**Key**: `selection-storage`

**Stores**:
- Selected questions
- Selection mode (checkbox/drag)

---

## File Reference Guide

### Backend Files

| File | Purpose |
|------|---------|
| [Organization.cs](file:///d:/AhaApps/FV_DynamicReports/backend/ReportingEngine.Core/Entities/Organization.cs) | Organization entity with OrganizationType |
| [Question.cs](file:///d:/AhaApps/FV_DynamicReports/backend/ReportingEngine.Core/Entities/Question.cs) | Question entity with QuestionBankId |
| [QuestionDto.cs](file:///d:/AhaApps/FV_DynamicReports/backend/ReportingEngine.Core/DTOs/QuestionDto.cs) | Data transfer object with IsDuplicate, RiskLevel |
| [TemplateService.cs](file:///d:/AhaApps/FV_DynamicReports/backend/ReportingEngine.Infrastructure/Services/TemplateService.cs) | Main business logic for fetching/processing questions |
| [ReportsController.cs](file:///d:/AhaApps/FV_DynamicReports/backend/ReportingEngine.API/Controllers/ReportsController.cs) | API endpoints for clients and questions |

### Frontend Files

| File | Purpose |
|------|---------|
| [App.tsx](file:///d:/AhaApps/FV_DynamicReports/client/src/App.tsx) | Root component with React Query setup |
| [Index.tsx](file:///d:/AhaApps/FV_DynamicReports/client/src/pages/Index.tsx) | Main page with 3-block layout |
| [QuestionsBlock.tsx](file:///d:/AhaApps/FV_DynamicReports/client/src/components/blocks/QuestionsBlock.tsx) | Questions display with filtering and export |
| [Header.tsx](file:///d:/AhaApps/FV_DynamicReports/client/src/components/report/Header.tsx) | Client search and selection |
| [api.ts](file:///d:/AhaApps/FV_DynamicReports/client/src/services/api.ts) | Axios API client |
| [selectionStore.ts](file:///d:/AhaApps/FV_DynamicReports/client/src/store/selectionStore.ts) | Zustand store for selections |

---

## Critical Business Rules

### 1. Organization Type Filtering
**Rule**: Only show 'Super Client', 'Admin', 'Client' types

### 2. Prequalification Template Only
**Rule**: Only fetch questions where `DisplayOrder == 1`

### 3. Question Deduplication
**Rule**: Merge questions with same QuestionBankId

### 4. Risk Level Visibility
**Rule**: Only show RiskLevel for unique questions (Count == 1)

### 5. Sorting Order
**Rule**: Sort by QuestionBankId ascending

### 6. Caching Duration
**Rule**: Clients cached 1 hour, questions 5 minutes

---

## Running the Application

### Backend
```powershell
cd d:\AhaApps\FV_DynamicReports\backend\ReportingEngine.API
dotnet run
```
**URL**: http://localhost:5008

### Frontend
```powershell
cd d:\AhaApps\FV_DynamicReports\client
npm run dev
```
**URL**: http://localhost:8080

---

**End of Documentation**