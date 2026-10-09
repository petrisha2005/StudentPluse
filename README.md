# Student Collaboration & Networking Platform (CampusCraft)

> **Where students meet, collaborate, and build.**

CampusCraft is a startup-grade, scalable web application engineered for university students to create professional profiles, showcase technical skills, discover peers, form hackathon teams, and access student-centric opportunities.

---

## 🌟 Key Features (Phase 1 Foundation)

- **Professional Student Profiles**: Comprehensive profile management including degree, branch, graduation year, city, bio, GitHub, LinkedIn, portfolio links, skills, and interests.
- **Secure JWT Authentication**: Full registration, login, and token-based state persistence with bcrypt password hashing and FastAPI auth middleware dependencies.
- **Metadata Management**: Curated skills, interest categories, and university databases.
- **Student Discovery Interface**: Real-time filtering and search for university peers by skillsets, university, or name.
- **Collaboration Dashboard**: Responsive SaaS dashboard featuring profile completion metrics, quick actions, recommended teammates, and live opportunity feeds.
- **Teams & Opportunities Ready**: Modular architecture designed for seamless future expansion into team formation, AI recommendations, and direct messaging.

---

## 🏗️ Architecture & Monorepo Structure

```
student-network-platform/
│
├── frontend/                     # React + Vite + TypeScript + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/           # Reusable UI components (Button, Card, Input, Badge, Avatar, Modal, etc.)
│   │   ├── context/              # AuthContext with token handling and state management
│   │   ├── hooks/                # Custom React hooks (useAuth)
│   │   ├── layouts/              # MainLayout & AuthLayout wrappers
│   │   ├── pages/                # LandingPage, LoginPage, RegisterPage, DashboardPage, ProfilePage, DiscoverPage, etc.
│   │   ├── routes/               # AppRoutes & ProtectedRoute guards
│   │   ├── services/             # Axios API client, authService, profileService, dataService
│   │   ├── types/                # Shared TypeScript interfaces & types
│   │   ├── index.css             # Tailwind v4 import & design system tokens
│   │   └── App.tsx               # Application root
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      # Python FastAPI + SQLAlchemy + Pydantic Backend
│   ├── app/
│   │   ├── api/                  # Modular routers (auth, users, profiles, skills, interests, colleges)
│   │   ├── core/                 # Config & Security modules (JWT, bcrypt hashing)
│   │   ├── db/                   # Database session & Base metadata
│   │   ├── models/               # SQLAlchemy Models (User, Profile, Skill, UserSkill, Interest, UserInterest, College)
│   │   ├── schemas/              # Pydantic validation schemas
│   │   ├── services/             # Service-layer business logic (auth_service, profile_service, metadata_service)
│   │   └── main.py               # FastAPI application entrypoint & lifespan
│   ├── alembic/                  # Alembic database migrations engine
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
│
├── docs/                         # Architecture & schema documentation
│   └── ARCHITECTURE.md
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 6 + TypeScript
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design System
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios with JWT Request/Response Interceptors
- **Icons**: Lucide React Icons

### Backend
- **Framework**: FastAPI + Uvicorn
- **ORM**: SQLAlchemy 2.0 (Compatible with PostgreSQL & SQLite)
- **Migrations**: Alembic
- **Validation**: Pydantic v2 + email-validator
- **Security**: JWT (PyJWT) + bcrypt password hashing

### Database & Deployment Targets
- **Database**: PostgreSQL / Supabase PostgreSQL (Supports SQLite for local zero-setup dev)
- **Deployment**: Vercel (Frontend) & Render (Backend)

---

## 🚀 Quick Setup & Running Locally

### 1. Prerequisites
- **Python**: `3.10+`
- **Node.js**: `v18+` & `npm`

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Database Migrations
alembic upgrade head

# Start FastAPI Backend Server
uvicorn app.main:app --reload --port 8000
```

Backend API will be live at: `http://localhost:8000`  
Interactive Swagger Docs: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite Frontend Development Server
npm run dev
```

Frontend application will be live at: `http://localhost:5173`

---

## 🔐 API Endpoints (Phase 1)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new student account |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile & skills |
| `POST` | `/api/auth/logout` | Logout active user |
| `GET` | `/api/profiles/me` | Get current user's profile |
| `PUT` | `/api/profiles/me` | Update student profile, college, skills & interests |
| `GET` | `/api/users` | List student users for discovery |
| `GET` | `/api/skills` | List pre-seeded technical skills |
| `GET` | `/api/interests` | List pre-seeded interests & categories |
| `GET` | `/api/colleges` | List pre-seeded universities & colleges |

---

## 🛣️ Development Roadmap

- [x] **Phase 1 (Complete)**: Core Monorepo Setup, FastAPI Architecture, PostgreSQL/SQLAlchemy Models, Alembic Migrations, JWT Authentication, Profile Management, Skills & Interests Metadata, SaaS React Frontend Shell.
- [ ] **Phase 2**: Team Formation Module, Required Roles Specification, Join Requests Workflow.
- [ ] **Phase 3**: Student Opportunity Marketplace (Hackathons, Internships, Open Source).
- [ ] **Phase 4**: Real-time Direct Messaging & Connection Requests.
- [ ] **Phase 5**: Intelligent Student & Team Recommendation Matching Engine.
