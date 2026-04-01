# Unbound

> Centralized multi-level college event management platform built for university-scale operations.

![Status](https://img.shields.io/badge/Status-Active%20Development-0ea5e9?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%20v16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)

## Overview

Unbound replaces fragmented college event workflows with one role-driven platform where super admins, college admins, club moderators, and students operate in a shared system.

### What It Solves

- No single discovery layer for events across clubs/colleges
- Manual, inconsistent registrations and approvals
- Weak visibility into participation and operations
- Coordination overhead between university, college, and clubs
- Limited governance and auditability across hierarchy

## Key Features

### Super Admin (University Level)

- Multi-college governance and oversight
- Admin/user lifecycle management controls
- Global view across colleges, clubs, and events

### Admin (College Level)

- Fest creation and lifecycle management
- Club approval, rejection, and operational control
- College-wide event operations and moderation

### Moderator (Club Level / CLUB_ADMIN)

- Create and manage clubs
- Create, update, publish, and cancel events
- Run standalone events or fest-linked events
- Track registrations per event

### User (Student Level)

- Browse published events and fests
- Register/cancel registrations
- Track personal registrations from dashboard views
- Access profile and account management

## System Architecture

```text
Super Admin (University)
        -> Admin (College)
                -> Moderator (Club / CLUB_ADMIN)
                        -> User (Student)
```

### Access Scope

- Super Admin: global university scope
- Admin: college scope
- Moderator: club scope
- User: self scope

## How It Works

1. Super Admin configures governance and account hierarchy
2. College Admin creates fests and moderates clubs
3. Club Moderator publishes standalone/fest-based events
4. Students discover events and register
5. Registration state and capacity update in real time at API level
6. Dashboards surface role-specific operations and activity

## Event System

### Event Structure

- Title, category, description
- Date/time and venue
- Organizer (club), optional fest linkage
- Capacity and registration count
- Status lifecycle: Draft, Published, Cancelled

### Event Types

- Standalone events
- Fest-based events (linked to a parent fest)

### Fest Model

- Parent container for grouped events
- Example: Tech Fest 2026 -> coding contest + robotics + workshops
- Improves discovery and event organization

### Supported Categories

- Technical
- Cultural
- Sports
- Workshops & Seminars
- Gaming
- Quiz & Competitions

## Core Modules (Implemented in Repo)

- Authentication module (JWT login/register)
- User profile and admin user management
- Club module (approval workflow included)
- Fest module
- Event module (create/update/publish/cancel)
- Registration module (register/cancel/my registrations)
- Validation, exception handling, API response wrappers
- Frontend dashboards and role-based pages

## API Overview (Current Backend)

### Auth

```http
POST /api/auth/register
POST /api/auth/login
```

### Users

```http
GET    /api/users/me
PUT    /api/users/me
GET    /api/users
GET    /api/users/{id}
DELETE /api/users/{id}
```

### Clubs

```http
POST   /api/clubs
PUT    /api/clubs/{id}
GET    /api/clubs
GET    /api/clubs/{id}
GET    /api/clubs/admin/all
PATCH  /api/clubs/{id}/approve
PATCH  /api/clubs/{id}/reject
DELETE /api/clubs/{id}
```

### Fests

```http
POST   /api/fests
PUT    /api/fests/{id}
DELETE /api/fests/{id}
GET    /api/fests
GET    /api/fests/{id}
GET    /api/fests/college/{collegeId}
```

### Events

```http
POST   /api/events
PUT    /api/events/{id}
PATCH  /api/events/{id}/publish
PATCH  /api/events/{id}/cancel
DELETE /api/events/{id}
GET    /api/events
GET    /api/events/{id}
GET    /api/events/admin/all
GET    /api/events/fest/{festId}
GET    /api/events/club/{clubId}
```

### Registrations

```http
POST   /api/registrations/{eventId}
DELETE /api/registrations/{eventId}
GET    /api/registrations/my
GET    /api/registrations/event/{eventId}
GET    /api/registrations/event/{eventId}/count
```

## Tech Stack

- Frontend: Next.js 16, Tailwind CSS 4, shadcn/ui, Radix UI
- Backend: Spring Boot 3.5, Spring Security, Spring Data JPA, OpenAPI
- Database: PostgreSQL
- Authentication: JWT (JJWT)
- Docs: Swagger UI + architecture/ER/workflow docs
- Payments: Razorpay flow planned/integration-ready via checkout screens

## Screenshots

> Wireframe artifacts currently available in repo docs.

- ![Landing Wireframe](docs/wireframes/Unbound%20%E2%80%94%20Landing%20-%20Overview.pdf)
- ![College Dashboard Wireframe](docs/wireframes/College%20Dashboard%20-%20Unbound.pdf)
- ![Club Dashboard Wireframe](docs/wireframes/Club%20Dashboard%20-%20Unbound.pdf)
- ![Event Detail & Registration Wireframe](docs/wireframes/Event%20Detail%20%26%20Registration.pdf)
- ![Fest & Event Directory Wireframe](docs/wireframes/Fest%20%26%20Event%20Directory.pdf)

## Project Structure (Actual)

```text
Unbound/
|- README.md
|- docs/
|  |- architecture.drawio
|  |- brd_v0.2.md
|  |- er-diagram-and-schema.md
|  |- workflow.md
|  |- service-charter-documentation_v2.md
|  |- pdf/
|  |- wireframes/
|- backend/
|  |- backend/
|     |- pom.xml
|     |- src/main/java/com/unbound/backend/
|     |  |- config/               # Security + Swagger
|     |  |- controller/           # Auth, User, Club, Fest, Event, Registration
|     |  |- dto/
|     |  |- entity/
|     |  |- enums/
|     |  |- exception/
|     |  |- repository/
|     |  |- security/             # JWT filter + user details service
|     |  |- service/
|     |  |- validation/
|     |- src/main/resources/application.properties
|     |- src/test/
|- frontend/
|  |- app/
|  |  |- (auth)/                 # login/signup/forgot-password
|  |  |- superadmin/             # admins, colleges, analytics, settings
|  |  |- admin/                  # clubs, fests, events, analytics, settings
|  |  |- club/                   # create, events, registrations, settings
|  |  |- student/                # events, my-events, checkout, transactions
|  |  |- page.tsx and static pages (clubs, fests, events, help, terms, privacy)
|  |- components/
|  |  |- ui/                     # shadcn-style reusable primitives
|  |- hooks/
|  |- lib/
|  |- public/
|  |- package.json
```

## Installation & Setup

### 1) Clone Repository

```bash
git clone https://github.com/your-username/unbound.git
cd unbound
```

### 2) Setup Frontend (Terminal 1)

```bash
cd frontend
pnpm install
pnpm dev
```

### 3) Setup Backend (Terminal 2)

```bash
cd backend/backend
./mvnw spring-boot:run
# Windows PowerShell alternative:
# .\mvnw.cmd spring-boot:run
```

## Environment Variables

Create `.env.local` for frontend and configure backend values through environment variables used by Spring.

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx

# Backend (environment variables consumed by application.properties)
DB_URL=jdbc:postgresql://localhost:5432/unbound
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

## Future Enhancements

- Razorpay backend order + verification endpoints
- Notification engine (email/in-app/realtime)
- WebSocket live updates for registrations
- QR-based event check-in and attendance
- AI-based personalized event recommendations
- Mobile apps (Android/iOS)
- Multi-tenant hardening for university-scale deployments

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add: your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Team

<a href="https://github.com/ShubhamSPawade/Unbound/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ShubhamSPawade/Unbound" />
</a>


## Call to Action

If Unbound aligns with your campus-tech vision, star the repository to support the project.
