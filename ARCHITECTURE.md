# CKA Admin Dashboard - Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              React Application (Port 5173)             │   │
│  │                                                        │   │
│  │  ├── Pages (Login, Dashboard, Search, etc.)          │   │
│  │  ├── Components (Layout, UI Components)              │   │
│  │  ├── Services (API Layer)                            │   │
│  │  └── Router (React Router)                           │   │
│  │                                                        │   │
│  │  Built with: React + Vite + Tailwind + shadcn       │   │
│  └────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              │ HTTP Requests                    │
│                              ▼                                  │
└─────────────────────────────────────────────────────────────────┘

                              │
                              │
                              ▼

┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER (Port 3000)                   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                   Middleware Stack                      │  │
│  │  ├── CORS                                              │  │
│  │  ├── Body Parser                                       │  │
│  │  ├── Express Session                                   │  │
│  │  └── Auth Check                                        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                   API Routes                            │  │
│  │                                                         │  │
│  │  Auth Routes:                                          │  │
│  │  ├── POST /login                                       │  │
│  │  └── POST /logout                                      │  │
│  │                                                         │  │
│  │  Student Routes:                                       │  │
│  │  ├── GET    /students                                  │  │
│  │  ├── GET    /students/search/:id                       │  │
│  │  ├── POST   /students/add                              │  │
│  │  ├── PATCH  /students/update/:id                       │  │
│  │  └── DELETE /students/delete/:id                       │  │
│  │                                                         │  │
│  │  Other Routes:                                         │  │
│  │  ├── GET    /settings                                  │  │
│  │  ├── PATCH  /debit                                     │  │
│  │  ├── GET    /bs-date                                   │  │
│  │  └── GET    /backup                                    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
└─────────────────────────────────────────────────────────────────┘

                              │
                              │
                              ▼

┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                             │
│                                                                 │
│  Collections:                                                   │
│  ├── students (Student records)                                │
│  ├── settings (App configuration)                              │
│  ├── backup (Backup data)                                      │
│  └── debit-log (Fee transaction logs)                          │
│                                                                 │
│  Connection: MongoDB Driver 6.4.0                              │
│  Type: MongoDB Atlas or Local                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow

### 1. User Login Flow

```
User Input (Login Form)
    ↓
React Component (Login.jsx)
    ↓
API Service (api.js → login())
    ↓
Axios POST Request
    ↓
Express Server (/login route)
    ↓
Session Creation
    ↓
Response (200 OK / 401 Unauthorized)
    ↓
React Router (Navigate to Dashboard)
```

### 2. Student Search Flow

```
User Input (Student ID)
    ↓
Search Component (Search.jsx)
    ↓
API Service (searchStudent())
    ↓
GET /students/search/:id
    ↓
MongoDB Query (findOne)
    ↓
Student Data Response
    ↓
React State Update
    ↓
UI Render (Display Student Info)
```

### 3. Add Student Flow

```
User Fills Form (Add.jsx)
    ↓
Form Validation
    ↓
API Service (addStudent())
    ↓
POST /students/add
    ↓
MongoDB Insert (insertOne)
    ↓
Success Response
    ↓
Form Reset + Success Notification
    ↓
Refresh Student ID
```

## 🔄 Component Hierarchy

```
App.jsx (Root)
├── Router
│   ├── /login
│   │   └── Login.jsx
│   │
│   └── /* (Protected Routes)
│       └── Layout.jsx
│           ├── Sidebar
│           ├── Navbar
│           └── Main Content
│               ├── Dashboard.jsx
│               ├── Search.jsx
│               ├── Add.jsx
│               ├── Update.jsx
│               ├── Fees.jsx
│               ├── Delete.jsx
│               ├── Print.jsx
│               └── Settings.jsx
```

## 🎨 Frontend Architecture

```
src/
├── main.jsx                    # Entry point
├── App.jsx                     # Router configuration
├── index.css                   # Global styles
│
├── components/
│   ├── Layout.jsx             # Main layout wrapper
│   └── ui/                    # shadcn components
│       ├── button.jsx
│       ├── input.jsx
│       └── card.jsx
│
├── pages/                     # Page components
│   ├── Login.jsx             # Authentication
│   ├── Dashboard.jsx         # Home page
│   ├── Search.jsx            # Search feature
│   ├── Add.jsx               # Add student
│   ├── Update.jsx            # Update student
│   ├── Delete.jsx            # Delete student
│   ├── Fees.jsx              # Fees management
│   ├── Print.jsx             # Print reports
│   └── Settings.jsx          # Settings page
│
├── services/
│   └── api.js                # API client (Axios)
│
└── lib/
    └── utils.js              # Utility functions
```

## 🗄️ Backend Architecture

```
CKA-backend API/
├── server.js                  # Express server + Routes
├── db.js                      # MongoDB connection
├── package.json               # Backend dependencies
│
└── CKA React App/            # Frontend (served in production)
    └── dist/                 # Built React app
```

## 🔐 Security Layers

```
1. Session Layer
   └── express-session
       ├── Cookie-based sessions
       ├── 1-hour expiration
       └── Rolling sessions

2. Route Protection
   └── checkLogin Middleware
       ├── Checks session validity
       ├── Returns 401 for API calls
       └── Redirects for page requests

3. CORS Configuration
   └── cors Middleware
       ├── Origin validation
       └── Credentials support

4. Input Validation
   └── Client-side & Server-side
       ├── Required fields
       ├── Type checking
       └── Format validation
```

## 📡 API Communication

```
Frontend (React)
    ↓
services/api.js (Axios Instance)
    ↓
HTTP Request (with credentials)
    ↓
Express Middleware Stack
    ├── CORS
    ├── Body Parser
    ├── Session Handler
    └── Auth Check
    ↓
Route Handler
    ↓
MongoDB Operation
    ↓
JSON Response
    ↓
React State Update
    ↓
UI Re-render
```

## 🎯 State Management

```
Component Level State
├── useState() for form inputs
├── useEffect() for data fetching
└── Local Storage for theme & reminders

Server State (Sessions)
├── req.session.loggedIn
└── Express-session middleware

Database State
├── MongoDB Collections
└── Real-time queries
```

## 🛣️ Routing Strategy

### Development

```
Frontend (Vite Dev Server):
├── Port: 5173
├── Proxy: /api → localhost:3000
└── Hot Module Replacement

Backend (Express):
├── Port: 3000
└── API Routes only
```

### Production

```
Express Server (Single Port):
├── Port: 3000
├── Serves: React build (dist/)
└── API Routes: Same origin
```

## 💾 Database Schema

### students Collection

```javascript
{
  _id: ObjectId,
  studentId: Number,        // Auto-increment
  name: String,
  fatherName: String,
  motherName: String,
  contact: String,
  address: String,
  DOB: String,
  class: String,
  gender: String,
  transport: Boolean,
  diet: Boolean,
  admitDate: String,
  fees: {
    credit: Number,
    debit: Number
  }
}
```

### settings Collection

```javascript
{
  _id: ObjectId,
  schoolName: String,
  adminEmail: String,
  contactNumber: String,
  totalStudents: Number
}
```

## 🔧 Build Process

```
Development:
npm run dev    → Start Express (Port 3000)
npm run client → Start Vite (Port 5173)

Production:
npm run build  →
    ├── cd "CKA React App"
    ├── npm install
    ├── vite build
    │   ├── Transform JSX → JS
    │   ├── Process Tailwind
    │   ├── Bundle modules
    │   ├── Minify code
    │   └── Output to dist/
    └── Ready for deployment

npm start →
    ├── NODE_ENV=production
    ├── Start Express (Port 3000)
    └── Serve dist/ files
```

## 🌐 Deployment Architecture

```
Production Server
├── Express Server (Port 3000)
│   ├── Serves React build (/)
│   ├── Handles API requests
│   └── Manages sessions
│
├── MongoDB
│   ├── MongoDB Atlas (Cloud)
│   └── Or Local MongoDB
│
└── Static Assets
    └── Served by Express
        └── images, CSS, JS from dist/
```

## 📊 Performance Optimizations

1. **Frontend**

   - Vite for fast builds
   - Code splitting (React Router)
   - Lazy loading components
   - Minified production build
   - Gzipped assets

2. **Backend**

   - MongoDB indexing on studentId
   - Session reuse
   - Efficient queries
   - Static file caching

3. **Network**
   - Axios instance reuse
   - Request deduplication
   - Optimistic UI updates

## 🎨 Styling Architecture

```
Tailwind CSS 4
├── Utility-first approach
├── JIT compilation
├── Custom CSS variables
├── Dark mode support
└── Responsive design

shadcn/ui Components
├── Pre-built components
├── Accessible
├── Customizable
└── Consistent design
```

---

**Architecture Designed**: October 2, 2025  
**Status**: ✅ Production Ready
