# Technical Architecture & System Design Document

## Product: StudentPulse — Student Collaboration Platform

> **Where students meet, collaborate, and build.**

---

## 1. Executive Overview

StudentPulse is designed as a high-scalability student collaboration monorepo. It connects students across universities based on technical skills, academic interests, hackathon objectives, and startup project roles.

The application follows a decoupled multi-tier SaaS architecture:
- **Presentation Layer**: Single Page Application (SPA) built with React 19, TypeScript, and Tailwind CSS v4.
- **Application API Layer**: Asynchronous RESTful Web API engineered with FastAPI and Python 3.12.
- **Persistence Layer**: Relational Database Management System (PostgreSQL / Supabase target, SQLite dev) managed via SQLAlchemy 2.0 ORM and Alembic migrations.

---

## 2. Database Foundations & Schemas

### 2.1 Core Relational Model (Phase 1)

```
[ users ] 1 --- 1 [ profiles ] N --- 0..1 [ colleges ]
   |                  |
   | 1                | 1
   |                  |
   N                  N
[ user_skills ]    [ user_interests ]
   N                  N
   | 1                | 1
[ skills ]         [ interests ]
```

#### Entity Details

1. **`users`**
   - Stores core login credentials and authorization roles.
   - Roles supported: `student`, `club`, `organizer`, `admin`.
   - Passwords hashed using standard `bcrypt` with salt generation.

2. **`profiles`**
   - Holds academic identity (degree, branch, graduation year), city, bio, and portfolio links (GitHub, LinkedIn, Portfolio).
   - Foreign keys to `users.id` (ON DELETE CASCADE) and `colleges.id` (ON DELETE SET NULL).

3. **`skills` & `user_skills`**
   - Standardized technical skills dictionary with categories (Frontend, Backend, AI/ML, Design, etc.).
   - Junction table `user_skills` records skill proficiency (`beginner`, `intermediate`, `advanced`, `expert`) with a unique constraint on `(user_id, skill_id)`.

4. **`interests` & `user_interests`**
   - Tracks project & hackathon collaboration goals (Hackathons, Open Source, Web3, Mobile Apps, Startup Incubators).
   - Junction table `user_interests` with unique constraint on `(user_id, interest_id)`.

5. **`colleges`**
   - University dictionary with name, city, state, and official website.

---

## 3. Security & Authentication Architecture

1. **Password Safety**: Plaintext passwords are never stored or logged. `bcrypt` via `passlib` provides salted password hashing.
2. **Stateless JWT Authorization**: Upon login/registration, the API returns a signed JWT access token containing the user's ID as the subject claim (`sub`).
3. **Dependency Injection**: FastAPI `get_current_user` dependency intercepts requests requiring authentication, decodes and verifies the JWT signature, and injects the active database user model.
4. **Client Token Storage & Security Tradeoffs**: JWT access tokens are stored in `localStorage` for SPA state persistence across browser refreshes.  
   *Security Note*: `localStorage` does not protect against XSS if malicious scripts execute. For production deployment, XSS prevention via Content Security Policy (CSP) or migration to `HttpOnly` cookies should be considered.
5. **Logout Mechanism**: Client clears `token` from `localStorage`. JWT token invalidation is client-side in Phase 1.
6. **Ownership Protection**: `PUT /api/profiles/me` binds updates strictly to the authenticated `current_user` injected via JWT token context. User IDs in request bodies are ignored for profile modification.

---

## 4. Migration Architecture

- **Alembic** is the sole source of truth for database schema migrations.
- Automatic runtime table generation (`Base.metadata.create_all()`) is omitted from FastAPI startup to ensure strict migration control across environments.
- Migration history is versioned under `backend/alembic/versions/`.

---

## 5. Prepared Future Expansion (Matching Engine & Modules)

The Phase 1 data architecture incorporates normalized relational entities so future modules can be added without database structural overhauls:

- **Teams Module**: Will map `teams` (created by a user) to `team_members` and `team_requirements`.
- **Opportunities Module**: Will host hackathons and project grants linked to `opportunity_skills`.
- **Matching Engine Readiness**: The skill & interest relational mappings enable future vector/algorithmic score calculation based on:
  $$\text{Match Score} = (0.40 \times \text{Skill Match}) + (0.25 \times \text{Interest Match}) + (0.15 \times \text{Role Match}) + (0.10 \times \text{Experience}) + (0.10 \times \text{Availability})$$
