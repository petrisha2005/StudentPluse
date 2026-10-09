# StudentPulse — Student Collaboration & Networking Platform

> **Where students meet, collaborate, and build.**

StudentPulse is a startup-grade web application engineered for university students to create professional profiles, showcase technical skills, discover peers, form hackathon teams, and access student-centric opportunities.

---

## 🌟 Key Features (Phase 1 Foundation)

- **Professional Student Profiles**: Profile management including degree, branch, graduation year, city, bio, GitHub, LinkedIn, portfolio links, proficiency-rated skills, and collaboration interests.
- **Secure JWT Authentication**: Account registration, login authentication, and token-based state persistence with `bcrypt` password hashing and FastAPI auth middleware dependencies.
- **Metadata Catalogs**: Seeded skills taxonomy, interest categories, and university databases.
- **Student Discovery Directory**: Filter and search university peers by skillsets, university, or name.
- **Collaboration Dashboard**: Responsive SaaS dashboard featuring profile completion metrics, quick actions, suggested teammates, and opportunity feeds.
- **Modular Foundations**: Architected for Phase 2 expansion (Teams, Opportunities, Messaging, and Recommendation Engine).

---

## 🏗️ Architecture & Monorepo Structure

```
student-network-platform/
│
├── frontend/                     # React 19 + Vite 6 + TypeScript + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/           # Reusable UI components (Button, Card, Input, Badge, Avatar, Modal, etc.)
│   │   ├── context/              # AuthContext with token handling and state management
│   │   ├── hooks/                # Custom React hooks (useAuth)
│   │   ├── layouts/              # MainLayout wrapper
│   │   ├── pages/                # LandingPage, LoginPage, RegisterPage, DashboardPage, ProfilePage, DiscoverPage, etc.
│   │   ├── routes/               # AppRoutes & ProtectedRoute guards
│   │   ├── services/             # Axios API client, authService, profileService, dataService
│   │   ├── types/                # Shared TypeScript interfaces & types
│   │   ├── index.css             # Tailwind v4 import & design system tokens
│   │   └── App.tsx               # Application root
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      # Python 3.12 + FastAPI + SQLAlchemy + Pydantic Backend
│   ├── app/
│   │   ├── api/                  # Modular routers (auth, users, profiles, skills, interests, colleges)
│   │   ├── core/                 # Config & Security modules (JWT, bcrypt hashing)
│   │   ├── db/                   # Database session & Base metadata
│   │   ├── models/               # SQLAlchemy Models (User, Profile, Skill, UserSkill, Interest, UserInterest, College)
│   │   ├── schemas/              # Pydantic v2 validation schemas
│   │   ├── services/             # Service-layer business logic (auth_service, profile_service, metadata_service)
│   │   └── main.py               # FastAPI application entrypoint & lifespan
│   ├── tests/                    # Pytest backend test suite (16 tests)
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

## 🛠️ Tech Stack & Installed Versions

### Frontend
- **Framework**: React `19.0.0` + Vite `6.2.0` + TypeScript `5.8.2`
- **Styling**: Tailwind CSS `v4.0.0` + `@tailwindcss/vite`
- **Routing**: React Router DOM `7.3.0`
- **HTTP Client**: Axios `1.8.2` with JWT Request/Response Interceptors
- **Icons**: Lucide React `0.479.0`

### Backend
- **Framework**: FastAPI `0.142.4` + Uvicorn `0.54.0`
- **ORM**: SQLAlchemy `2.1.4` (Compatible with PostgreSQL & SQLite)
- **Migrations**: Alembic `1.20.0`
- **Validation**: Pydantic `2.13.5` + email-validator `2.3.0`
- **Security**: PyJWT `2.15.1` + bcrypt `5.0.0` + passlib `1.7.4`
- **Test Suite**: Pytest `9.1.1` + HTTPX `0.28.1`

### Database & Deployment Targets
- **Database Target**: PostgreSQL / Supabase PostgreSQL (Supports SQLite for local zero-setup dev)
- **Deployment Target**: Vercel (Frontend) & Render (Backend)

---

## 🔐 Security & Auth Tradeoffs

- **Password Safety**: Passwords are hashed using `bcrypt` before database storage. Plaintext passwords are never saved or logged.
- **JWT Storage in `localStorage`**: JWT tokens are stored in client-side `localStorage` for SPA state persistence across page reloads.  
  *Security Note*: `localStorage` is accessible to client scripts and therefore susceptible to Cross-Site Scripting (XSS) if untrusted scripts run. Production deployments should mitigate XSS via strict Content Security Policies (CSP) or migrate to `HttpOnly` SameSite cookies for session management.
- **Client-Side Logout**: Logout removes the JWT token from client `localStorage` and returns a success status. Server-side token blacklisting/revocation is not enabled in Phase 1 (tokens naturally expire based on `ACCESS_TOKEN_EXPIRE_MINUTES`).

---

## 🚀 Local Execution & Test Commands

### 1. Backend Setup & Test Commands
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Database Migrations (Alembic is the schema source of truth)
alembic upgrade head

# Run Pytest Backend Test Suite
pytest -v

# Start FastAPI Dev Server
uvicorn app.main:app --reload --port 8000
```
- API Base: `http://localhost:8000`
- Interactive OpenAPI Swagger Docs: `http://localhost:8000/docs`

### 2. Frontend Setup & Build Commands
```bash
cd frontend

# Install Node dependencies
npm install

# Run Production Build Check
npm run build

# Start Vite Development Server
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 📋 Implemented API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new student account |
| `POST` | `/api/auth/login` | Authenticate credentials & return JWT access token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile, skills & interests |
| `POST` | `/api/auth/logout` | Client token removal confirmation endpoint |
| `GET` | `/api/profiles/me` | Get current user's profile |
| `PUT` | `/api/profiles/me` | Update student profile, college, skills & interests |
| `GET` | `/api/profiles/{id}` | Public student profile by user ID |
| `GET` | `/api/users` | List students for discovery directory |
| `GET` | `/api/skills` | List pre-seeded technical skills catalog |
| `GET` | `/api/interests` | List pre-seeded interests & categories catalog |
| `GET` | `/api/colleges` | List pre-seeded university catalog |
