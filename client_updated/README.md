# Dynamic Reports - Client Updated

A modern, responsive, and professional frontend application for dynamic reports with dual interaction modes, caching, and beautiful UI/UX.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Development URL**: http://localhost:5174/  
**Backend API**: http://localhost:5008/api

## ✨ Features

### Core Functionality
- **3-Block Responsive Layout**: Vendor Stats, Questions, EMR Stats
- **Dual Interaction Modes**: 
  - Drag & Drop for intuitive selection
  - Checkbox mode with confirmation modal
- **Smart Search**: Filter clients and questions in real-time
- **Data Caching**: React Query with localStorage persistence
- **Professional UI**: TailwindCSS with custom design system

### Questions Block
- Questions sorted by questionBankID (ascending)
- Color-coded risk level badges
- Duplicate indicators
- Stats display (Total, Critical, Duplicates)
- Search by text or ID
- Mode toggle between drag and checkbox

### Client Selection
- Searchable dropdown with autocomplete
- Loading states
- Long name wrapping
- Smooth animations

## 🛠️ Tech Stack

- **React 18** + TypeScript
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **TanStack Query** - Data fetching & caching
- **Zustand** - State management
- **@dnd-kit** - Drag and drop
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Axios** - HTTP client

## 📁 Project Structure

```
src/
├── components/
│   ├── blocks/          # Main content blocks
│   ├── layout/          # Layout components
│   ├── questions/       # Question-related components
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── services/            # API services
├── store/               # Zustand stores
├── types/               # TypeScript types
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## 🎨 Design System

### Colors
- Primary: Blue (#2563eb)
- Secondary: Slate (#64748b)
- Success: Emerald (#10b981)
- Danger: Red (#ef4444)

### Components
- Cards with hover effects
- Buttons (primary, secondary)
- Input fields with focus rings
- Color-coded badges
- Modals with backdrop blur

## 🧪 Testing

1. **Client Selection**: Choose a client from dropdown
2. **Drag Mode**: Drag questions to select
3. **Checkbox Mode**: Toggle mode and use checkboxes
4. **Search**: Filter questions by text or ID
5. **Responsive**: Resize browser to test layouts

## 📝 API Endpoints

- `GET /reports/clients` - Fetch all clients
- `GET /reports/schema/{clientId}` - Fetch questions for client

## 🔧 Configuration

### Caching
- **Stale Time**: 5 minutes
- **GC Time**: 1 hour
- **Storage**: localStorage

### Responsive Breakpoints
- Desktop: lg (1024px+)
- Tablet: md (768px+)
- Mobile: < 768px

## 🚀 Future Enhancements

- [ ] Vendor Stats implementation
- [ ] EMR Stats implementation
- [ ] PDF/Excel export
- [ ] Advanced filtering
- [ ] Bulk actions
- [ ] User preferences
- [ ] Dark mode

## 📄 License

Private - Internal Use Only

---

Built with ❤️ using React + TypeScript + TailwindCSS
