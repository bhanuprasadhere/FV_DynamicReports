# 📊 Dynamic Reports - Complete Documentation

## 🎯 Project Overview

**Dynamic Reports** is a drag-and-drop report builder that allows organizations to:

- Select from available question templates
- Build custom reports by dragging questions
- Filter and search questions by risk level, safety level, and more
- Paginate through large question sets
- Group questions by sections

---

## 🏗️ Architecture

### **Frontend Stack**

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool (ultra-fast)
- **Tailwind CSS** - Styling
- **dnd-kit** - Drag & Drop (modern, performant)
- **React Query** - Server state management
- **Axios** - HTTP client

### **Backend Stack**

- **.NET 9** - Runtime
- **Entity Framework Core** - ORM
- **SQL Server** - Database
- **RESTful API** - Communication protocol

---

## 📁 Project Structure

```
d:\AhaApps\FV_DynamicReports/
│
├── backend/                              # 🔵 .NET Backend
│   ├── ReportingEngine.API/              # REST API
│   │   ├── Controllers/
│   │   │   └── ReportsController.cs     # API endpoints
│   │   ├── Program.cs                    # Configuration
│   │   └── Properties/launchSettings.json
│   │
│   ├── ReportingEngine.Core/             # Business Logic & Domain
│   │   ├── Entities/
│   │   │   ├── Organization.cs
│   │   │   ├── Question.cs ✨ NEW: RiskLevel, SafetyLevel, IsMandatory
│   │   │   └── Template.cs
│   │   ├── DTOs/
│   │   │   └── QuestionDto.cs ✨ Enhanced with metadata
│   │   └── Interfaces/
│   │       └── ITemplateService.cs
│   │
│   └── ReportingEngine.Infrastructure/   # Data Access
│       ├── Data/
│       │   └── ReportingDbContext.cs
│       └── Services/
│           └── TemplateService.cs ✨ Enhanced distinct logic
│
├── client/                               # 🔴 React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx                # Client selector
│   │   │   ├── Sidebar.tsx ✨ Search, Filter, Pagination
│   │   │   └── Canvas.tsx                # Droppable area
│   │   ├── services/
│   │   │   └── api.ts                    # API client
│   │   ├── types/
│   │   │   └── index.ts ✨ New QuestionFilters interface
│   │   ├── App.tsx                       # Main orchestrator
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
└── README.md
```

---

## 🔑 Key Features

### **1. Question Management**

✅ **Distinct Questions** - Same question (same QuestionBankId) shown only once  
✅ **Risk Levels** - Low, Medium, High, Critical  
✅ **Safety Levels** - Safe, Warning, Dangerous  
✅ **Mandatory Indicators** - Mark required questions  
✅ **Descriptions** - Additional context for each question

### **2. Search & Filter**

✅ **Full-text Search** - Search across question text and category  
✅ **Risk Level Filter** - Filter by risk classification  
✅ **Safety Level Filter** - Filter by safety status  
✅ **Section Filter** - View questions from specific sections  
✅ **Mandatory Only** - Show only required questions

### **3. Pagination**

✅ **5 Questions Per Page** - Configurable  
✅ **Previous/Next Navigation** - Easy page browsing  
✅ **Result Counter** - Shows "5 of 20 questions" etc.

### **4. Drag & Drop**

✅ **Smooth Dragging** - Visual feedback during drag  
✅ **Reordering** - Change question order on canvas  
✅ **Duplicate** - Copy questions to canvas  
✅ **Remove** - Delete items from canvas

---

## 📊 Database Schema

### **Question Entity (Enhanced)**

```csharp
public class Question
{
    public int QuestionId { get; set; }
    public int TemplateSubSectionId { get; set; }
    public string Text { get; set; }
    public string DataType { get; set; }
    public int? QuestionBankId { get; set; }  // For grouping identical questions

    // ✨ NEW FIELDS
    public string? RiskLevel { get; set; }    // Low|Medium|High|Critical
    public string? SafetyLevel { get; set; }  // Safe|Warning|Dangerous
    public string? Category { get; set; }     // Classification
    public bool IsMandatory { get; set; }     // Required flag
    public string? Description { get; set; }  // Additional context

    public bool IsActive { get; set; }
    public int OrderNumber { get; set; }
    public TemplateSubSection SubSection { get; set; }
}
```

---

## 🔌 API Endpoints

| Method | Endpoint                         | Response                   | Purpose                           |
| ------ | -------------------------------- | -------------------------- | --------------------------------- |
| `GET`  | `/api/reports/clients`           | `[{organizationId, name}]` | List all organizations            |
| `GET`  | `/api/reports/schema/{clientId}` | `QuestionDto[]`            | Get distinct questions for client |

### **QuestionDto Structure**

```json
{
  "id": 1,
  "text": "What is the risk level?",
  "dataType": "string",
  "sectionName": "Risk Assessment",
  "category": "Safety",
  "riskLevel": "High",
  "safetyLevel": "Warning",
  "isMandatory": true,
  "description": "Assess the current risk level",
  "questionBankId": 42
}
```

---

## 🚀 How to Run

### **Prerequisites**

- .NET 9 SDK installed
- Node.js 18+ installed
- SQL Server running
- Port 5008 (backend) and 5174 (frontend) available

### **Terminal 1: Backend**

```bash
cd d:\AhaApps\FV_DynamicReports\backend
dotnet run --project ReportingEngine.API

# Expected: Listening on http://localhost:5008
```

### **Terminal 2: Frontend**

```bash
cd d:\AhaApps\FV_DynamicReports\client
npm run dev

# Expected: Local: http://localhost:5174
```

### **Open Browser**

Navigate to: **http://localhost:5174**

---

## 🧪 Testing Workflow

1. **Load Page**
   - Browser shows header with client dropdown
   - Sidebar shows "Select a client to view questions"
   - Canvas shows empty state

2. **Select Client**
   - Dropdown loads organizations from `GET /api/reports/clients`
   - Select one organization
   - Sidebar loads questions from `GET /api/reports/schema/{clientId}`

3. **Search & Filter**
   - Type in search box to filter by text
   - Click "All Risk Levels" to filter by risk
   - Toggle "Required Only" to see mandatory questions
   - Use pagination to browse large question sets

4. **Drag & Drop**
   - Hover over question and grab grip icon
   - Drag to canvas area
   - Item appears with all metadata displayed
   - Drag questions on canvas to reorder

5. **Save Report**
   - Click "Save Report" button
   - Check browser console for logged report structure
   - Console shows: `Report Built: { timestamp, questionCount, questions[] }`

---

## 🛠️ Configuration

### **API Base URL** (Frontend)

Edit in `client/src/services/api.ts`:

```typescript
const API_BASE_URL = "http://localhost:5008/api";
```

### **Database Connection** (Backend)

Edit in `backend/ReportingEngine.API/Program.cs`:

```csharp
var connectionString = "Server=localhost;Database=pqFirstVerifyProduction;Trusted_Connection=True;...";
```

### **Pagination Items Per Page** (Frontend)

Edit in `client/src/components/Sidebar.tsx`:

```typescript
const itemsPerPage = 5; // Change this value
```

---

## 📈 Performance Optimizations

✅ **React Query Caching** - 5-minute stale time  
✅ **Pagination** - Load only 5 items at a time  
✅ **Lazy Loading** - Questions loaded on client selection  
✅ **Memoization** - Filters and grouping computed efficiently  
✅ **EF Core Eager Loading** - No N+1 queries (includes and theninclude)

---

## 🔒 CORS Configuration

Backend has CORS enabled for frontend:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

app.UseCors("AllowReact");
```

---

## 🎨 UI/UX Features

### **Header**

- Blue gradient background
- Client selector dropdown with loading state
- Professional typography

### **Sidebar**

- **Search bar** with icon
- **Filter chips** for quick filtering
- **Badges** for risk/safety/mandatory status
- **Pagination controls** with page info
- **Question counter** showing filtered results
- **Grouped sections** with sticky headers
- **Hover effects** for better UX

### **Canvas**

- Dashed border dropzone
- Empty state with emoji and guidance
- Hover feedback with color change
- Drag overlay showing "Dragging item..."
- Action buttons (duplicate, remove) on hover
- Save Report button with confirmation

### **Cards & Badges**

- Color-coded risk levels (green/yellow/orange/red)
- Outlined safety badges (different from risk)
- Required indicator in red
- Data type labels

---

## 🔄 Distinct Question Logic

**Problem:** Same question can appear in multiple templates/sections

**Solution:** Group by `QuestionBankId`

```csharp
var distinctGroups = allQuestions
    .GroupBy(q => q.QuestionBankId ?? (-q.QuestionId))
    .ToList();
```

**Result:** Each unique question appears only once in the sidebar, regardless of how many times it's referenced in the template hierarchy.

---

## 📝 Future Enhancements

- [ ] Save reports to database
- [ ] Report versioning/history
- [ ] Export as PDF/Excel/JSON
- [ ] Conditional questions (if-then logic)
- [ ] User authentication & roles
- [ ] Report templates/presets
- [ ] Real-time collaboration
- [ ] Comments & approvals
- [ ] Analytics dashboard
- [ ] Dark mode

---

## 🐛 Troubleshooting

### **"Failed to resolve import" errors**

```bash
cd client
npm install
```

### **Backend not responding**

```bash
# Check if port 5008 is in use
netstat -ano | findstr :5008

# Restart backend
cd backend
dotnet run --project ReportingEngine.API
```

### **Questions not loading**

1. Check browser Network tab for `GET /api/reports/schema/{clientId}`
2. Verify client was selected
3. Check backend console for errors
4. Verify database connection string

### **Drag & Drop not working**

- Ensure dnd-kit dependencies are installed: `npm list @dnd-kit/core`
- Check browser console for JavaScript errors

---

## 📞 Support

For issues or questions:

1. Check browser console for errors
2. Check backend console output
3. Verify database connection
4. Ensure ports 5008 and 5174 are available

---

**Last Updated:** January 23, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
