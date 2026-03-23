# ⚡ FitnessFreak3x — MERN Stack

A full-stack fitness tracking application built with **MongoDB, Express, React, and Node.js**.

---

## 📁 Project Structure

```
fitnessFreak3x/
├── backend/          ← Express + MongoDB API
├── frontend/         ← React user app (port 3000)
└── admin/            ← React admin panel (port 3001)
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, **or** a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

---

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

Configure your `.env` file (already created):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/fitnessfreak3x
JWT_SECRET=fitnessfreak3x_secret_key_2024
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@fitnessfreak.com
ADMIN_PASSWORD=admin123
```

Seed the admin user (run once):
```bash
node seed.js
```

Start the backend:
```bash
npm run dev      # development with nodemon
# or
npm start        # production
```
Backend runs at: **http://localhost:5000**

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```
User app runs at: **http://localhost:3000**

---

### 3️⃣ Admin Panel Setup

```bash
cd admin
npm install
npm start
```
Admin panel runs at: **http://localhost:3001**

Login with:
- Email: `admin@fitnessfreak.com`
- Password: `admin123`

---

## ✨ Features

### User App
| Feature | Description |
|---------|-------------|
| 🔐 Auth | Register / Login with JWT |
| 📊 Dashboard | Stats: calories burned, workouts, active minutes, BMI |
| 🏋️ Workouts | Log workouts with exercises, sets, reps, weight |
| 🥗 Calories | Track meals with macros (protein, carbs, fat) |
| 👤 Profile | Update personal info, view BMI score |

### Admin Panel
| Feature | Description |
|---------|-------------|
| 📈 Dashboard | Platform stats + user goal distribution chart |
| 👥 User Management | View, activate/deactivate, delete users |
| 🔒 Admin Auth | JWT-protected, admin-only access |

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6, Recharts, React Icons |
| Backend | Node.js, Express 4, Mongoose |
| Database | MongoDB |
| Auth | JWT + bcryptjs |
| Styling | Custom CSS with CSS variables |

---

## 📡 API Endpoints

### Auth
```
POST /api/auth/register   — Register user
POST /api/auth/login      — Login
GET  /api/auth/me         — Get current user
```

### Users
```
GET  /api/users/profile   — Get profile
PUT  /api/users/profile   — Update profile
GET  /api/users/bmi       — Calculate BMI
```

### Workouts
```
GET    /api/workouts              — Get all workouts
POST   /api/workouts              — Create workout
GET    /api/workouts/:id          — Get single workout
PUT    /api/workouts/:id          — Update workout
DELETE /api/workouts/:id          — Delete workout
GET    /api/workouts/stats/summary — 30-day stats
```

### Calories
```
GET    /api/calories              — Get logs
POST   /api/calories              — Add meal log
PUT    /api/calories/:id          — Update log
DELETE /api/calories/:id          — Delete log
GET    /api/calories/daily-summary — Today's totals
```

### Admin (requires admin token)
```
GET    /api/admin/stats             — Platform stats
GET    /api/admin/users             — All users
PUT    /api/admin/users/:id/toggle  — Toggle active status
DELETE /api/admin/users/:id         — Delete user
```

---

## 🔧 VS Code Tips

Open the project with 3 terminals side-by-side:
1. `cd backend && npm run dev`
2. `cd frontend && npm start`
3. `cd admin && npm start`

Recommended VS Code extensions:
- **ES7+ React/Redux/React-Native snippets**
- **MongoDB for VS Code**
- **Thunder Client** (API testing)
- **Prettier**
