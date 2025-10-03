# CKA Admin Dashboard - React Frontend

A modern, responsive admin dashboard built with React, Vite, Tailwind CSS, and shadcn/ui.

## Features

- 🎨 Modern UI with Tailwind CSS
- 🌙 Dark mode support
- 📱 Fully responsive design
- 🔐 Session-based authentication
- 📊 Student management (Add, Update, Delete, Search)
- 💰 Fees management
- 📄 Print reports
- ⚙️ Settings and backup

## Tech Stack

- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Routing
- **Axios** - API calls
- **Lucide React** - Icons

## Getting Started

### Development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The app will run on `http://localhost:5173` and proxy API calls to `http://localhost:3000`.

### Production Build

1. Build the app:

```bash
npm run build
```

2. The build files will be in the `dist` folder, which will be served by the backend in production mode.

## Default Credentials

- Username: `admin123`
- Password: `password123`

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx           # Main layout with sidebar
│   └── ui/                  # shadcn UI components
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Dashboard.jsx       # Dashboard with stats
│   ├── Search.jsx          # Search students
│   ├── Add.jsx             # Add new student
│   ├── Update.jsx          # Update student info
│   ├── Delete.jsx          # Delete student
│   ├── Fees.jsx            # Manage fees
│   ├── Print.jsx           # Print reports
│   └── Settings.jsx        # App settings
├── services/
│   └── api.js              # API service layer
└── lib/
    └── utils.js            # Utility functions
```

## API Integration

The frontend communicates with the backend through RESTful APIs. All API calls are centralized in `src/services/api.js`.

## Environment Variables

The app automatically detects production/development mode:

- **Development**: API calls go to `http://localhost:3000`
- **Production**: API calls are relative to the backend server
