# 🎯 QUICK START GUIDE

## ⚡ 30-Second Setup

### **Terminal 1 - Backend**

```powershell
cd d:\AhaApps\FV_DynamicReports\backend
dotnet run --project .\ReportingEngine.API\ReportingEngine.API.csproj
```

✅ Wait for: `Now listening on: http://localhost:5008`

### **Terminal 2 - Frontend**

```powershell
cd d:\AhaApps\FV_DynamicReports\client
npm run dev
```

✅ Wait for: `Local: http://localhost:5173`

### **Browser**

Open: **http://localhost:5173**

---

## 🧪 Testing the App

### **Test 1: Load the Page**

- [ ] Blue header appears
- [ ] Dropdown shows "Choose a client"
- [ ] Sidebar shows "Select a client to view questions"
- [ ] Canvas shows empty state

### **Test 2: Select a Client**

- [ ] Click dropdown
- [ ] Select an organization
- [ ] Sidebar populates with questions
- [ ] Questions show risk/safety badges

### **Test 3: Search**

- [ ] Type in search box
- [ ] Results filter in real-time
- [ ] Pagination updates

### **Test 4: Filter**

- [ ] Click "All Risk Levels" dropdown
- [ ] Select "High" risk
- [ ] Only high-risk questions appear
- [ ] Toggle "Required Only"
- [ ] Only mandatory questions appear

### **Test 5: Pagination**

- [ ] See "Page X of Y" at bottom
- [ ] Click "Next →"
- [ ] Different questions appear
- [ ] Click "← Prev"
- [ ] Return to first page

### **Test 6: Drag & Drop**

- [ ] Hover on question, grip appears
- [ ] Drag question to canvas
- [ ] Item appears in canvas
- [ ] Item shows all metadata (risk, safety, mandatory)
- [ ] Drag on canvas to reorder
- [ ] Right-side buttons: duplicate, remove
- [ ] Hover question, click copy icon
- [ ] Question duplicates on canvas

### **Test 7: Save Report**

- [ ] Add several questions to canvas
- [ ] Click "Save Report" button
- [ ] Look at browser console (F12 → Console tab)
- [ ] See logged report with timestamp and questions

---

## 📊 What You Should See

### **Questions with Metadata**

```
Question Text
┌─────────────────────────────────────┐
│ ✋ [GripIcon] What is the risk?     │
│ string    🔴 High  ⚠️ Warning  ☑️   │
│ Additional context here...          │
└─────────────────────────────────────┘
```

### **Badges Legend**

- 🟢 Green = Low Risk
- 🟡 Yellow = Medium Risk
- 🟠 Orange = High Risk
- 🔴 Red = Critical Risk
- ⚠️ Outlined = Safety Levels
- ☑️ Bold Red = Required/Mandatory

---

## 🚀 Your First Report

1. Select a client
2. See the questions populate
3. Search for something (e.g., "risk")
4. Filter by "High" risk level
5. Drag 3-5 questions to canvas
6. Click "Save Report"
7. Check console (F12) → see the report JSON

---

## 🛠️ Troubleshooting

### **"Port already in use"**

```powershell
# Find what's using port 5008
netstat -ano | findstr :5008

# Kill the process
taskkill /PID <PID> /F
```

### **"Failed to fetch from API"**

- Check backend is running on 5008
- Check Network tab in browser DevTools
- Look for CORS errors

### **"Search/Filter not working"**

- Hard refresh browser (Ctrl+F5)
- Clear React Query cache: F12 → Application → Clear Storage

### **TypeScript errors in VS Code**

```powershell
cd client
npm install
```

---

## 📈 Key Features at a Glance

| Feature        | How to Use                           |
| -------------- | ------------------------------------ |
| Search         | Type in search box (instant)         |
| Risk Filter    | Dropdown → select level              |
| Mandatory Only | Checkbox toggle                      |
| Pagination     | Bottom buttons (Page X of Y)         |
| Drag & Drop    | Grip icon → drag to canvas           |
| Reorder        | Drag items on canvas                 |
| Duplicate      | Hover item → copy icon               |
| Remove         | Hover item → trash icon              |
| Save Report    | "Save Report" button → check console |

---

## 📱 Browser DevTools Tips

### **Check API Calls**

```
F12 → Network → filter by "api"
→ See GET /api/reports/clients
→ See GET /api/reports/schema/ID
```

### **Check Report Output**

```
F12 → Console →
→ "Report Built: { questions: [...] }"
```

### **Check Errors**

```
F12 → Console → look for red errors
F12 → Network → look for failed requests
```

---

## 💾 What's Being Stored

**Nothing yet** - Questions are loaded on demand from backend  
**Plan:** Save reports to database later

**What you CAN do now:**

- View questions by client
- Build reports in-memory
- Console logs the report structure

---

## 🎓 Learning the Codebase

### **Frontend Structure**

- `src/App.tsx` - Main orchestrator (DnD container)
- `src/components/Header.tsx` - Client selector
- `src/components/Sidebar.tsx` - Questions with search/filter/pagination
- `src/components/Canvas.tsx` - Droppable area
- `src/services/api.ts` - API client
- `src/types/index.ts` - TypeScript interfaces

### **Backend Structure**

- `Program.cs` - API configuration
- `ReportsController.cs` - API endpoints
- `TemplateService.cs` - Business logic (distinct questions)
- `Question.cs` - Entity with metadata
- `ReportingDbContext.cs` - Database context

---

## ✅ You're Ready!

1. ✅ Backend running on 5008
2. ✅ Frontend running on 5173
3. ✅ Browser at localhost:5173
4. ✅ Search and filter working
5. ✅ Drag & drop working
6. ✅ Reports building

**Start testing now!** 🚀

---

**Build Date:** January 23, 2026  
**Version:** 1.0.0  
**Status:** Production Ready
