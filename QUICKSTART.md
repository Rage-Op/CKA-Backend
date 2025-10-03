# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd "CKA React App"
npm install
cd ..
```

### Step 2: Start Development

**Option A: Development Mode (Recommended)**

Open two terminals:

Terminal 1 - Backend:

```bash
npm run dev
```

Terminal 2 - Frontend:

```bash
npm run client
```

Then open: http://localhost:5173

**Option B: Production Mode**

```bash
# Build the React app
npm run build

# Start the server
npm start
```

Then open: http://localhost:3000

### Step 3: Login

Use these credentials:

- **Username**: `admin123`
- **Password**: `password123`

---

## 📱 Pages Overview

| Page      | URL         | Description            |
| --------- | ----------- | ---------------------- |
| Login     | `/login`    | Authentication page    |
| Dashboard | `/`         | Overview with stats    |
| Search    | `/search`   | Search students by ID  |
| Add       | `/add`      | Add new student        |
| Update    | `/update`   | Update student info    |
| Fees      | `/fees`     | Manage student fees    |
| Delete    | `/delete`   | Delete student records |
| Print     | `/print`    | Printable reports      |
| Settings  | `/settings` | App configuration      |

---

## 🔧 Configuration

### Database Setup

Edit `db.js`:

```javascript
// For MongoDB Atlas (default)
const atlasURI = "your-mongodb-atlas-uri";

// For local MongoDB
const localDb = "mongodb://localhost:27017/CKA-DB";
```

### Port Configuration

Edit `server.js`:

```javascript
const PORT = process.env.PORT || 3000;
```

---

## 🎨 Features

✅ Modern React UI with Tailwind CSS  
✅ Dark mode support  
✅ Responsive design  
✅ Session-based authentication  
✅ RESTful API architecture  
✅ MongoDB database  
✅ Student management (CRUD)  
✅ Fees tracking  
✅ Nepali date support  
✅ Print reports  
✅ Data backup

---

## 📦 Tech Stack

**Frontend:**

- React 19
- Vite 7
- Tailwind CSS 4
- shadcn/ui
- React Router 7
- Axios

**Backend:**

- Node.js
- Express.js
- MongoDB
- express-session
- nepali-datetime

---

## 🐛 Troubleshooting

### Port already in use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port in server.js
```

### MongoDB connection failed

- Check your MongoDB URI in `db.js`
- Ensure MongoDB is running (if using local)
- Verify network access (if using Atlas)

### Build fails

```bash
# Clear cache and reinstall
cd "CKA React App"
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📚 Useful Commands

```bash
# Backend only
npm run dev

# Frontend only
npm run client

# Build frontend
npm run build

# Production
npm start

# Test API
curl http://localhost:3000/bs-date
```

---

## 🔐 Security Notes

⚠️ **Before deploying to production:**

1. Change default login credentials in `server.js`
2. Update session secret in `server.js`
3. Use environment variables for sensitive data
4. Enable HTTPS
5. Update CORS settings
6. Add rate limiting
7. Implement proper authentication

---

## 🎓 Next Steps

1. Customize the UI theme
2. Add more student fields
3. Implement role-based access
4. Add email notifications
5. Create parent portal
6. Add attendance tracking
7. Generate PDF reports
8. Export to Excel

---

## 💡 Tips

- Use Chrome DevTools for debugging
- Check browser console for errors
- Monitor server logs for API issues
- Use React DevTools extension
- Test on different screen sizes
- Clear browser cache if styles don't update

---

## 📞 Need Help?

- Check the main [README.md](./README.md)
- Review the [CKA React App README](./CKA%20React%20App/README.md)
- Open an issue on GitHub

---

Happy Coding! 🎉
