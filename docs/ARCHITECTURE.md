# Technical Architecture & System Design Document

## Product: Student Collaboration & Networking Platform (CampusCraft)

---

## 1. Executive Overview

CampusCraft is designed as a high-scalability student collaboration monorepo. It connects students across universities based on technical skills, academic interests, hackathon objectives, and startup project roles.

The application follows a decoupled multi-tier SaaS architecture:
- **Presentation Layer**: Single Page Application (SPA) built with React 19, TypeScript, and Tailwind CSS.
- **Application API Layer**: Asynchronous RESTful Web API engineered with FastAPI and Python 3.12.
- **Persistence Layer**: Relational Database Management System (PostgreSQL / Supabase) managed via SQLAlchemy 2.0 ORM and Alembic migrations.

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

1. **Password Safety**: Plaintext passwords are never stored or logged. `passlib` / `bcrypt` provides password hashing.
2. **Stateless JWT Authorization**: Upon login/registration, the API returns a signed JWT access token containing the user's ID as the subject claim (`sub`).
3. **Dependency Injection**: FastAPI `get_current_user` dependency intercepts requests requiring authentication, decodes and verifies the JWT signature, and injects the active database user model.
4. **CORS Enforcement**: Configured to restrict origin requests to trusted frontend domains (`FRONTEND_URL`).

---

## 4. Prepared Future Expansion (Matching Engine & Modules)

The Phase 1 data architecture incorporates normalized relational entities so future modules can be added without database structural overhauls:

- **Teams Module**: Will map `teams` (created by a user) to `team_members` and `team_requirements`.
- **Opportunities Module**: Will host hackathons and project grants linked to `opportunity_skills`.
- **Matching Engine Readiness**: The skill & interest relational mappings enable future vector/algorithmic score calculation based on:
  $$\text{Match Score} = (0.40 \times \text{Skill Match}) + (0.25 \times \text{Interest Match}) + (0.15 \times \text{Role Match}) + (0.10 \times \text{Experience}) + (0.10 \times \text{Availability})$$
