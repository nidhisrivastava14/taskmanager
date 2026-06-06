# Taskly - Production-Grade Task Management Application

Taskly is a full-featured, secure, and production-grade MERN (MongoDB, Express, React, Node.js) task management application. Designed with modern aesthetics, atomic frontend components, and robust schema validations, it showcases strong software engineering principles.

## Tech Stack

- **Frontend**: React 18 (Hooks + Context API), React Router v6, Tailwind CSS, Axios, Lucide Icons
- **Backend**: Node.js, Express.js, JWT, Bcrypt, Zod (Input Validation)
- **Database**: MongoDB (Atlas) + Mongoose
- **Tooling**: Vite (Frontend Bundling), PostCSS, Nodemon (Backend development reload)

---

## Architectural Overview

```
                      +---------------------------------------+
                      |               Vercel                  |
                      |          React 18 Frontend            |
                      +-------------------+-------------------+
                                          |
                        HTTPS (REST API)  | Authorization Header (Bearer JWT)
                                          v
                      +-------------------+-------------------+
                      |               Render                  |
                      |          Express Backend API          |
                      +-------------------+-------------------+
                                          |
                      Authentication &    | Validation (Zod) &
                      Middleware Guards   | Database Operations
                                          v
                      +-------------------+-------------------+
                      |            MongoDB Atlas              |
                      |            Cloud Database             |
                      +---------------------------------------+
```

### Authentication Flow
1. **Registration**: User inputs details -> Password is hashed with `bcryptjs` via a pre-save hook -> Document stored in DB.
2. **Login**: User supplies credentials -> Server validates email and matches hash -> Server responds with signed JWT token.
3. **Session Caching**: JWT token is saved to client `localStorage`.
4. **Authorized Requests**: Axios request interceptor attaches the token to the header (`Authorization: Bearer <token>`).
5. **Route Guarding**: Backend validates token signature using JWT middleware.

---

## Repository Structure

```
task-management-app/
├── backend/            # Express REST API
│   ├── config/         # DB connection setup
│   ├── controllers/    # API Request handlers (Auth & Tasks)
│   ├── middleware/     # JWT Auth & Global Error handlers
│   ├── models/         # Mongoose User & Task Schemas
│   ├── routes/         # Router mounts (/api/auth, /api/tasks)
│   └── server.js       # Express start script
├── frontend/           # React 18 client (Vite)
│   ├── src/
│   │   ├── components/ # Atomic components (atoms/molecules/organisms)
│   │   ├── context/    # Global State (Auth, Theme, Toasts)
│   │   ├── pages/      # Route page views (Login, Register, Dashboard)
│   │   └── services/   # Centralized API requests client
│   └── index.html      # SPA HTML wrapper
├── .gitignore          # VCS excludes
└── README.md           # Root workspace manual (This file)
```

---

## Local Setup & Run Guide

### Prerequisites
- Node.js v18.0.0 or higher
- MongoDB local instance or MongoDB Atlas Cloud Cluster

### 1. Clone & Initialize Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Setup your local environment file:
   ```bash
   cp .env.example .env
   ```
   Modify `.env` to include your MongoDB connection string and a secret key:
   ```env
   PORT=5000
   NODE_ENV=development
   DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskly
   JWT_SECRET=your_long_secure_jwt_secret_key
   ```
3. Install packages and start server:
   ```bash
   npm install
   npm run dev
   ```

### 2. Initialize Frontend Client
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
   Verify that it points to your local backend server:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Install packages and run development server:
   ```bash
   npm install
   npm run dev
   ```
4. Click on the local link (typically `http://localhost:5173`) in your terminal to open the application in your browser.

---

## API Endpoints Documentation

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Body | Description |
|---|---|---|---|---|
| **POST** | `/api/auth/register` | Public | `{ name, email, password, confirmPassword }` | Registers user. Password hashes and returns user details. |
| **POST** | `/api/auth/login` | Public | `{ email, password }` | Authenticates email, evaluates hash, signs JWT token. |

### Task Routes (`/api/tasks`) - All endpoints require `Authorization: Bearer <token>`
| Method | Endpoint | Access | Params / Body | Description |
|---|---|---|---|---|
| **GET** | `/api/tasks` | Private | Query: `?status=pending&priority=high&startDate=...&endDate=...` | Fetches authenticated user's tasks with advanced filtering. |
| **POST** | `/api/tasks` | Private | Body: `{ title, description, priority, dueDate }` | Creates a task assigned to logged-in user. |
| **PUT** | `/api/tasks/:id` | Private | Body: `{ title, description, status, priority, dueDate }` | Updates a task (after verifying current user ownership). |
| **DELETE** | `/api/tasks/:id` | Private | Params: `id` | Permanently deletes a task (verifies ownership first). |

---

## Deployment Instructions

### Backend (Render Deployment)
1. Go to [Render](https://render.com) and sign in.
2. Click **New** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following options:
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
5. In **Environment Variables**, define:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (or leave default)
   - `DB_URI` = `mongodb+srv://...` (your MongoDB Atlas connection string)
   - `JWT_SECRET` = `your_secure_production_secret`
6. Click **Deploy Web Service**.

### Frontend (Vercel Deployment)
1. Create a project in [Vercel](https://vercel.com).
2. Connect your GitHub repository.
3. Configure the following project parameters:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set **Environment Variables**:
   - `VITE_API_URL` = `https://your-backend-render-url.onrender.com/api`
5. Click **Deploy**.
