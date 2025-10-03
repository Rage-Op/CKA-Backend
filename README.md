# CKA Admin Dashboard - MERN Stack

A full-stack student management system built with MongoDB, Express.js, React, and Node.js.

## 🚀 Features

- **Authentication**: Secure session-based login system
- **Student Management**: Add, update, search, and delete student records
- **Fees Management**: Track student fees, credits, debits, and dues
- **Dashboard**: Overview with statistics and action items
- **Dark Mode**: Built-in dark/light theme support
- **Responsive Design**: Works seamlessly on all devices
- **Print Reports**: Generate printable student reports
- **Data Backup**: Backup functionality for student data
- **Settings**: Configurable application settings

## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **express-session** - Session management
- **nepali-datetime** - Nepali date handling

### Frontend

- **React** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling framework
- **shadcn/ui** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 📁 Project Structure

```
CKA-backend API/
├── server.js                 # Express server & API routes
├── db.js                     # MongoDB connection
├── package.json              # Backend dependencies
├── public/                   # Legacy static files
│   └── content/             # Images and assets
└── CKA React App/           # React frontend
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/          # Page components
    │   ├── services/       # API services
    │   └── lib/            # Utilities
    ├── public/             # Static assets
    └── package.json        # Frontend dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.x or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd "CKA-backend API"
```

2. **Install backend dependencies**

```bash
npm install
```

3. **Install frontend dependencies**

```bash
cd "CKA React App"
npm install
cd ..
```

4. **Configure database**
   - Update the MongoDB connection string in `db.js`
   - Default: MongoDB Atlas (update with your credentials)
   - Local: Use `mongodb://localhost:27017/CKA-DB`

### Running the Application

#### Development Mode

1. **Start the backend server** (Terminal 1):

```bash
npm run dev
```

Backend runs on `http://localhost:3000`

2. **Start the React dev server** (Terminal 2):

```bash
npm run client
```

Frontend runs on `http://localhost:5173`

The Vite dev server proxies API calls to the backend automatically.

#### Production Mode

1. **Build the React app**:

```bash
npm run build
```

2. **Start the production server**:

```bash
npm start
```

The backend serves the built React app on `http://localhost:3000`.

## 🔐 Default Login Credentials

- **Username**: `admin123`
- **Password**: `password123`

⚠️ **Important**: Change these credentials in production!

## 📚 API Endpoints

### Authentication

- `POST /login` - User login
- `POST /logout` - User logout

### Students

- `GET /students` - Get all students (descending order)
- `GET /ascending-students` - Get all students (ascending order)
- `GET /students/search/:studentId` - Search student by ID
- `POST /students/add` - Add new student
- `PATCH /students/update/:studentId` - Update student
- `DELETE /students/delete/:studentId` - Delete student

### Fees

- `PATCH /debit` - Update multiple student fees

### Settings

- `GET /settings` - Get application settings
- `PATCH /settings` - Update settings

### Utilities

- `GET /bs-date` - Get current Nepali date
- `GET /backup` - Create database backup
- `GET /debit-log` - Get debit log

## 🎨 Features Breakdown

### Dashboard

- Student count
- Total due fees
- Current Nepali date
- Top 3 students with highest dues
- Local reminders system

### Search

- Search students by ID
- View complete student information
- Display fee details (credit, debit, due)

### Add Student

- Auto-generated student ID
- Automatic admit date (Nepali calendar)
- Class and gender selection
- Transport and diet options

### Update Student

- Search and update student information
- Real-time form updates

### Delete Student

- Safe deletion with confirmation
- Preview student information before deletion

### Fees Management

- Bulk fee updates
- Select multiple students
- Track credit, debit, and dues

### Print

- Printable student reports
- Complete student list with fee details

### Settings

- Application configuration
- Database backup functionality
- System information display

## 🌙 Dark Mode

The application supports dark mode with automatic persistence using localStorage.

## 📱 Responsive Design

The UI is fully responsive and works seamlessly on:

- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🔧 Configuration

### Backend Configuration

Edit `db.js` to change:

- Database connection string
- Database name

Edit `server.js` to change:

- Port (default: 3000)
- Session secret
- Session duration
- CORS settings

### Frontend Configuration

Edit `src/services/api.js` to change:

- API base URL
- Request timeout
- Headers

## 📦 Deployment

### Backend Deployment

1. Set environment variable `NODE_ENV=production`
2. Update MongoDB connection for production
3. Build the React app: `npm run build`
4. Deploy to your hosting service (Heroku, AWS, DigitalOcean, etc.)

### Frontend Deployment

The frontend is automatically served by the backend in production mode.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

ISC

## 👨‍💻 Developer Notes

### Adding New Features

1. **Backend**: Add routes in `server.js`
2. **Frontend**:
   - Add API call in `src/services/api.js`
   - Create/update page component
   - Add route in `App.jsx`

### Database Schema

**Student Document**:

```javascript
{
  studentId: Number,
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

## 🐛 Known Issues

- Session management needs improvement for production
- File upload for student photos not implemented
- Advanced fee calculation features pending

## 🔮 Future Enhancements

- [ ] Role-based access control
- [ ] Student photo upload
- [ ] Advanced reporting and analytics
- [ ] Email notifications
- [ ] SMS integration
- [ ] Export data to Excel/PDF
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Attendance tracking
- [ ] Parent portal

## 📞 Support

For issues and questions, please open an issue on the repository.

---

Made with ❤️ for CKA
