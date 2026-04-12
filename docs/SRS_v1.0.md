# Software Requirements Specification (SRS)
# Unbound — Event Management Platform

| Field | Details |
|-------|---------|
| Document Version | 1.0 |
| Date | April 2026 |
| Prepared By | Prasad Ingole |
| Institution | MIT Academy of Engineering (MITAOE) |
| Status | Active |

---

## Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 0.1 | 10/03/2026 | Pratik Bhosale | Initial Draft |
| 0.2 | 15/03/2026 | Samiksha Mulik | Refined Scope and Constraints |
| 0.3 | 01/04/2026 | Samiksha Mulik | Changed Frontend Tech from React to Next.js |
| 1.0 | 10/04/2026 | Prasad Ingole | Major update: added Payment module FRs (FR-PAY-01 to FR-PAY-10), Team/Solo event participation FRs, SUPER_ADMIN creation specification, Razorpay integration details, Core user flows section, EventType and FeeType enums, NFR reliability specification, Result announcement and prize distribution added to out-of-scope, RBAC matrix updated with Payment row, Glossary expanded |

---

## Table of Contents

1. Introduction
2. Overall Description
3. System Architecture
4. Functional Requirements
5. Non-Functional Requirements
6. Database Design
7. API Specification
8. Security Requirements
9. Constraints and Assumptions
10. Out of Scope
11. Glossary

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the complete functional and non-functional requirements for **Unbound**, a centralized event management platform built exclusively for MIT Academy of Engineering (MITAOE). It serves as the authoritative reference for the development team, project stakeholders, and reviewers.

### 1.2 Project Overview

Unbound replaces the fragmented, manual event management process at MITAOE — which relied on WhatsApp groups, Google Forms, Excel spreadsheets, and manual UPI payment verification — with a single, unified digital platform.

The platform enables:
- College administrators to create and manage fests and oversee all club activity
- Club coordinators to create, publish, and manage events
- Students to discover, filter, and register for events with one click
- Secure online payment processing for paid events via Razorpay

### 1.3 Scope

Unbound is a **web-only, single-college platform** targeting MITAOE. It is not designed for multi-college deployment in this version.

### 1.4 Intended Audience

| Audience | Purpose |
|----------|---------|
| Development Team | Implementation reference |
| Project Manager | Scope and milestone tracking |
| QA Team | Test case derivation |
| Faculty / Reviewers | Project evaluation |
| Stakeholders | Requirement validation |

### 1.5 References

| Document | Description |
|----------|-------------|
| BRD v0.2 | Business Requirements Document |
| ER Diagram & Schema | Database design specification |
| Service Charter v2 | Technical and service requirements |
| Workflow.md | Team development process |
| Architecture Diagram | System architecture (draw.io) |

---

## 2. Overall Description

### 2.1 Problem Statement

Event management at MITAOE is currently decentralized and inefficient:

- Students miss events due to no central discovery platform
- Registrations via Google Forms lead to duplicate entries and data loss
- Payment verification is manual (UPI screenshots, cash collection)
- Club coordinators spend more time on administration than event quality
- MITAOE administration has no visibility into event performance

### 2.2 Proposed Solution

Unbound provides a centralized platform with:

- Role-based access for four user types
- Structured event hierarchy: College → Fest → Club → Event
- Support for standalone events (Club → Event without a fest)
- One-click student registration with capacity enforcement
- Razorpay payment gateway integration for paid events
- Real-time registration tracking and capacity monitoring

### 2.3 User Roles

| Role | Description | Key Capabilities |
|------|-------------|-----------------|
| SUPER_ADMIN | University-level administrator | Full platform access, cannot be registered via API |
| COLLEGE_ADMIN | MITAOE administrator | Manage fests, approve/reject clubs, view all events |
| CLUB_ADMIN | Club coordinator | Create and manage own club and events |
| STUDENT | MITAOE student | Browse events, register, view own registrations |

### 2.4 Key Stakeholders

| Stakeholder | Role |
|-------------|------|
| MITAOE Admin | Platform governance and oversight |
| Club Coordinators | Event operations and execution |
| MITAOE Students | End users — registration and participation |
| Development Team | System architecture and implementation |
| QA Team | Testing and quality assurance |

---

## 3. System Architecture

### 3.1 Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Frontend | Next.js 14 + Tailwind CSS + shadcn/ui | SSR support, SEO-friendly, component-based scalable UI with utility-first styling |
| Backend | Java 17 + Spring Boot 3 | Enterprise-grade security, strong multi-threading |
| Database | PostgreSQL 15 | Full ACID compliance, strong relational integrity |
| Authentication | JWT (jjwt 0.11.5) + Spring Security | Stateless, scalable, industry standard |
| Password Hashing | BCrypt | Secure one-way hashing |
| Payment Gateway | Razorpay | Indian payment gateway with webhook support |
| API Documentation | Springdoc OpenAPI (Swagger UI) | Auto-generated, interactive API docs |
| Build Tool | Maven | Dependency management and build lifecycle |
| Version Control | Git + GitHub | Collaborative development with PR workflow |
| Deployment | Render / Railway (Backend), Vercel (Frontend) | Zero-config cloud deployment |

### 3.2 Architecture Pattern

**Modular Monolith (MVP)** — all modules deployed as a single Spring Boot application with clear internal separation.

Request flow:

1. Controller Layer — receives HTTP request, enforces RBAC
2. Service Layer — executes business logic and validation
3. Repository Layer — performs data access via Spring Data JPA
4. Entity Layer — maps to PostgreSQL tables via Hibernate ORM
5. PostgreSQL — persists data

Future scope: Microservices architecture for independent scaling of modules.

### 3.3 Application Layers

| Layer | Responsibility |
|-------|---------------|
| Controller | REST API endpoints, request/response mapping, RBAC enforcement |
| Service | Business logic, validation, orchestration |
| Repository | Data access via Spring Data JPA |
| Entity | JPA-mapped database tables |
| Security | JWT filter, authentication, authorization |
| Exception | Global exception handling with standardized error responses |

### 3.4 Event Hierarchy

**Fest-linked Event:**
College → Fest → Club → Event → Registration

**Standalone Event:**
College → Club → Event → Registration

Both SOLO and TEAM participation types are supported. Events can be FREE or PAID.

### 3.5 Core User Flows

**Student Registration — Solo Free Event:**
1. Student browses published events
2. Selects a solo event
3. Clicks Register
4. Registration confirmed immediately

**Student Registration — Solo Paid Event:**
1. Student browses published events
2. Selects a paid solo event
3. Clicks Register — Razorpay payment initiated
4. On successful payment — Registration confirmed
5. On failed payment — Registration remains PENDING

**Student Registration — Team Event:**
1. Student browses published events
2. Selects a team event
3. Creates a team and adds members (within min/max team size)
4. Submits registration
5. If FREE — confirmed immediately; if PAID — payment flow triggered

**Club Event Creation Flow:**
1. CLUB_ADMIN logs in
2. Creates event with participation type (SOLO/TEAM) and fee type (FREE/PAID)
3. Event created in DRAFT status
4. CLUB_ADMIN publishes event
5. Students can now discover and register

**Club Approval Flow:**
1. CLUB_ADMIN registers club — status: PENDING
2. COLLEGE_ADMIN reviews the club
3. Approves — club becomes visible to students
4. Or Rejects — rejection reason provided to CLUB_ADMIN

---

## 4. Functional Requirements

### 4.1 Authentication Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUTH-01 | Users must register with name, email, password, and role (STUDENT, CLUB_ADMIN, COLLEGE_ADMIN only) | High |
| FR-AUTH-02 | Password must meet complexity requirements (min 8 chars, uppercase, lowercase, number, special char) | High |
| FR-AUTH-03 | SUPER_ADMIN role cannot be assigned via the registration API | High |
| FR-AUTH-04 | Users must login with email and password to receive a JWT token | High |
| FR-AUTH-05 | JWT token must expire after 24 hours | High |
| FR-AUTH-06 | All protected endpoints must require a valid Bearer token | High |
| FR-AUTH-07 | Duplicate email and phone registration must be rejected | High |
| FR-AUTH-08 | Optional collegeId can be provided during registration to link user to a college | Medium |

### 4.2 User Management Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-USER-01 | Any authenticated user can view and update their own profile | High |
| FR-USER-02 | COLLEGE_ADMIN and SUPER_ADMIN can view all users | High |
| FR-USER-03 | COLLEGE_ADMIN and SUPER_ADMIN can view any user by ID | High |
| FR-USER-04 | COLLEGE_ADMIN and SUPER_ADMIN can deactivate (soft delete) a user | High |
| FR-USER-05 | Deactivated users cannot login | High |

### 4.3 Club Management Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CLUB-01 | CLUB_ADMIN can create a club (one club per admin) | High |
| FR-CLUB-02 | Newly created clubs have PENDING status by default | High |
| FR-CLUB-03 | COLLEGE_ADMIN and SUPER_ADMIN can approve or reject clubs | High |
| FR-CLUB-04 | Rejection must include a reason | High |
| FR-CLUB-05 | Only APPROVED clubs are visible to students | High |
| FR-CLUB-06 | CLUB_ADMIN can update only their own club | High |
| FR-CLUB-07 | COLLEGE_ADMIN and SUPER_ADMIN can view all clubs including PENDING | High |
| FR-CLUB-08 | COLLEGE_ADMIN and SUPER_ADMIN can soft delete a club | Medium |
| FR-CLUB-09 | Club name and contact email must be unique | High |

### 4.4 Fest Management Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-FEST-01 | COLLEGE_ADMIN and SUPER_ADMIN can create fests | High |
| FR-FEST-02 | Fest must have a name, start date, end date, and college ID | High |
| FR-FEST-03 | End date must not be before start date | High |
| FR-FEST-04 | Fest name must be unique per college | High |
| FR-FEST-05 | Any authenticated user can view all fests | High |
| FR-FEST-06 | Fests can be filtered by college | Medium |
| FR-FEST-07 | COLLEGE_ADMIN and SUPER_ADMIN can update and delete fests | High |
| FR-FEST-08 | Fests support an optional banner image URL | Low |

### 4.5 Event Management Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-EVENT-01 | CLUB_ADMIN, COLLEGE_ADMIN, and SUPER_ADMIN can create events | High |
| FR-EVENT-02 | Events must have title, date, max participants, category, club ID, event type (solo/team), and fee type (free/paid) | High |
| FR-EVENT-03 | fest_id is optional — events can be standalone or under a fest | High |
| FR-EVENT-04 | Events are created in DRAFT status by default | High |
| FR-EVENT-05 | Only PUBLISHED events are visible to students | High |
| FR-EVENT-06 | Admins can view all events regardless of status | High |
| FR-EVENT-07 | Events can be published, cancelled, or deleted by authorized roles | High |
| FR-EVENT-08 | Events support filtering by category, club, fest, date range, event type (solo/team), and fee type (free/paid) | High |
| FR-EVENT-09 | Events can be filtered by fest or club | Medium |
| FR-EVENT-10 | Events support an optional banner image URL | Low |
| FR-EVENT-11 | Event categories: TECHNICAL, CULTURAL, SPORTS, WORKSHOP, SEMINAR, HACKATHON, OTHER | High |
| FR-EVENT-12 | Event participation type must be specified: SOLO or TEAM | High |
| FR-EVENT-13 | Event fee type must be specified: FREE or PAID. Paid events require a fee amount | High |
| FR-EVENT-14 | Team events must define minimum and maximum team size | High |

### 4.6 Registration Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-REG-01 | Any authenticated user can register for a PUBLISHED event | High |
| FR-REG-02 | A user cannot register for the same event twice | High |
| FR-REG-03 | Registration must be blocked when event reaches max participants (capacity validation) | High |
| FR-REG-04 | Users can cancel their own registration | High |
| FR-REG-05 | Users can view their own registrations (My Events dashboard) | High |
| FR-REG-06 | CLUB_ADMIN, COLLEGE_ADMIN, SUPER_ADMIN can view all registrations for an event | High |
| FR-REG-07 | Registration count for an event is publicly accessible | Medium |
| FR-REG-08 | Only PUBLISHED events accept registrations | High |
| FR-REG-09 | For SOLO events, a student can register directly with one click | High |
| FR-REG-10 | For TEAM events, the registering student becomes the team leader and must add team members before submitting | High |
| FR-REG-11 | Team size must be within the event's defined min and max team size | High |
| FR-REG-12 | A student cannot be part of more than one team for the same event | High |
| FR-REG-13 | For PAID events, registration must trigger a payment flow before confirmation | High |
| FR-REG-14 | Registration status is PENDING until payment is confirmed for paid events | High |
| FR-REG-15 | Registration status is CONFIRMED immediately for free events | High |

### 4.7 Payment Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PAY-01 | Events must support two fee types: FREE and PAID | High |
| FR-PAY-02 | Paid events must have a fee amount defined at event creation | High |
| FR-PAY-03 | Payment must be processed via Razorpay payment gateway | High |
| FR-PAY-04 | System must create a Razorpay order before redirecting student to payment | High |
| FR-PAY-05 | Razorpay webhook must verify payment signature and update payment status | High |
| FR-PAY-06 | Registration status must change to CONFIRMED only after successful payment | High |
| FR-PAY-07 | Failed payments must keep registration in PENDING status | High |
| FR-PAY-08 | Students must be able to view their transaction history | Medium |
| FR-PAY-09 | Payment receipt must be generated on successful payment | Medium |
| FR-PAY-10 | Refund support must be available for cancelled events | Medium |

### 4.8 Authentication — SUPER_ADMIN Creation

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUTH-09 | SUPER_ADMIN cannot be created via the public registration API | High |
| FR-AUTH-10 | SUPER_ADMIN must be created directly in the database by the system administrator during initial setup | High |
| FR-AUTH-11 | Only one SUPER_ADMIN account should exist per deployment | High |
| FR-AUTH-12 | SUPER_ADMIN has full access to all platform features and cannot be deactivated via the API | High |

### 4.9 Exception Handling

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-EX-01 | All API errors must return a consistent JSON response with success, message, and timestamp | High |
| FR-EX-02 | Validation errors must return field-level error messages | High |
| FR-EX-03 | Unauthorized access must return 401 with a clear message | High |
| FR-EX-04 | Forbidden access must return 403 with a clear message | High |
| FR-EX-05 | Resource not found must return 404 | High |
| FR-EX-06 | Duplicate data must return 409 | High |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement |
|----|-------------|
| NFR-PERF-01 | System must support up to 500 concurrent users during peak registration |
| NFR-PERF-02 | API response time must be under 3 seconds for all endpoints |
| NFR-PERF-03 | Database queries must use indexed columns for performance |

### 5.2 Security

| ID | Requirement |
|----|-------------|
| NFR-SEC-01 | All passwords must be hashed using BCrypt before storage |
| NFR-SEC-02 | JWT tokens must be signed with HS256 and a 256-bit secret key |
| NFR-SEC-03 | All API endpoints except /api/auth/** must require authentication |
| NFR-SEC-04 | Role-based access must be enforced using @PreAuthorize annotations |
| NFR-SEC-05 | CSRF protection is disabled (stateless JWT architecture) |
| NFR-SEC-06 | Sensitive credentials must never be committed to version control |
| NFR-SEC-07 | Database credentials must be stored as environment variables |

### 5.3 Reliability

| ID | Requirement |
|----|-------------|
| NFR-REL-01 | System uptime target: 99% — achieved via cloud hosting (Render/Railway) with auto-restart on failure, database connection pooling via HikariCP, and health monitoring |
| NFR-REL-02 | Registration transactions must be atomic to prevent overbooking |
| NFR-REL-03 | Database must use ACID-compliant transactions |
| NFR-REL-04 | HikariCP connection pool must be configured to handle peak load without connection exhaustion |

### 5.4 Maintainability

| ID | Requirement |
|----|-------------|
| NFR-MAIN-01 | Code must follow layered architecture (Controller → Service → Repository) |
| NFR-MAIN-02 | All API endpoints must be documented via Swagger UI |
| NFR-MAIN-03 | All changes must go through pull request review |
| NFR-MAIN-04 | Commit messages must reference issue numbers |

### 5.5 Scalability

| ID | Requirement |
|----|-------------|
| NFR-SCALE-01 | Architecture must support migration to microservices in future |
| NFR-SCALE-02 | Database schema must support horizontal scaling |

---

## 6. Database Design

### 6.1 Entity Summary

| Entity | Table | Description |
|--------|-------|-------------|
| College | colleges | Stores MITAOE college information |
| User | users | All platform users with roles |
| Club | clubs | Student clubs within the college |
| Fest | fests | College festivals containing events |
| Event | events | Individual events (standalone or under fest) |
| Registration | registrations | Student event registrations |
| Team | teams | Teams for group-based events |
| Attendance | attendance | Event attendance records |
| Certificate | certificates | Issued certificates |
| Announcement | announcements | College-level announcements |

### 6.2 Key Relationships

| Relationship | Type | Description |
|-------------|------|-------------|
| College → Users | 1:N | A college has many users |
| College → Clubs | 1:N | A college has many clubs |
| College → Fests | 1:N | A college organizes many fests |
| Club → Events | 1:N | A club organizes many events |
| Fest → Events | 1:N | A fest contains many events (optional) |
| Users ↔ Events | M:N | Via registrations table |
| Users ↔ Teams | M:N | Via team_members table |
| Event → Teams | 1:N | An event has many teams |

### 6.3 Enumerations

| Enum | Values |
|------|--------|
| Role | SUPER_ADMIN, COLLEGE_ADMIN, CLUB_ADMIN, STUDENT |
| ClubStatus | PENDING, APPROVED, REJECTED |
| EventStatus | DRAFT, PUBLISHED, CANCELLED, COMPLETED |
| EventCategory | TECHNICAL, CULTURAL, SPORTS, WORKSHOP, SEMINAR, HACKATHON, OTHER |
| EventType | SOLO, TEAM |
| FeeType | FREE, PAID |
| RegistrationStatus | PENDING, CONFIRMED, CANCELLED |
| PaymentStatus | PENDING, SUCCESS, FAILED, REFUNDED |

---

## 7. API Specification

### 7.1 Base URL

```
http://localhost:8080
```

### 7.2 Authentication

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

Token is obtained from `POST /api/auth/login`.

### 7.3 Standard Response Format

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-04-01T10:00:00"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2026-04-01T10:00:00"
}
```

### 7.4 API Endpoints Summary

#### Authentication — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login and get JWT token |

#### Users — `/api/users`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/users/me | All roles | Get own profile |
| PUT | /api/users/me | All roles | Update own profile |
| GET | /api/users | COLLEGE_ADMIN, SUPER_ADMIN | Get all users |
| GET | /api/users/{id} | COLLEGE_ADMIN, SUPER_ADMIN | Get user by ID |
| DELETE | /api/users/{id} | COLLEGE_ADMIN, SUPER_ADMIN | Deactivate user |

#### Clubs — `/api/clubs`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/clubs | CLUB_ADMIN | Create club |
| GET | /api/clubs | All roles | Get approved clubs |
| GET | /api/clubs/{id} | All roles | Get club by ID |
| PUT | /api/clubs/{id} | CLUB_ADMIN, COLLEGE_ADMIN, SUPER_ADMIN | Update club |
| GET | /api/clubs/admin/all | COLLEGE_ADMIN, SUPER_ADMIN | Get all clubs |
| PATCH | /api/clubs/{id}/approve | COLLEGE_ADMIN, SUPER_ADMIN | Approve club |
| PATCH | /api/clubs/{id}/reject | COLLEGE_ADMIN, SUPER_ADMIN | Reject club |
| DELETE | /api/clubs/{id} | COLLEGE_ADMIN, SUPER_ADMIN | Soft delete club |

#### Fests — `/api/fests`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/fests | COLLEGE_ADMIN, SUPER_ADMIN | Create fest |
| GET | /api/fests | All roles | Get all fests |
| GET | /api/fests/{id} | All roles | Get fest by ID |
| GET | /api/fests/college/{collegeId} | All roles | Get fests by college |
| PUT | /api/fests/{id} | COLLEGE_ADMIN, SUPER_ADMIN | Update fest |
| DELETE | /api/fests/{id} | COLLEGE_ADMIN, SUPER_ADMIN | Delete fest |

#### Events — `/api/events`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/events | CLUB_ADMIN, COLLEGE_ADMIN, SUPER_ADMIN | Create event |
| GET | /api/events | All roles | Get published events (with filters) |
| GET | /api/events/{id} | All roles | Get event by ID |
| GET | /api/events/admin/all | CLUB_ADMIN, COLLEGE_ADMIN, SUPER_ADMIN | Get all events |
| GET | /api/events/fest/{festId} | All roles | Get events by fest |
| GET | /api/events/club/{clubId} | All roles | Get events by club |
| PUT | /api/events/{id} | CLUB_ADMIN, COLLEGE_ADMIN, SUPER_ADMIN | Update event |
| PATCH | /api/events/{id}/publish | CLUB_ADMIN, COLLEGE_ADMIN, SUPER_ADMIN | Publish event |
| PATCH | /api/events/{id}/cancel | CLUB_ADMIN, COLLEGE_ADMIN, SUPER_ADMIN | Cancel event |
| DELETE | /api/events/{id} | COLLEGE_ADMIN, SUPER_ADMIN | Delete event |

**Query Parameters for GET /api/events:**

| Parameter | Type | Description |
|-----------|------|-------------|
| category | EventCategory | Filter by category |
| clubId | Long | Filter by club |
| festId | Long | Filter by fest |
| from | LocalDateTime | Filter from date |
| to | LocalDateTime | Filter to date |

#### Registrations — `/api/registrations`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/registrations/{eventId} | All roles | Register for event |
| DELETE | /api/registrations/{eventId} | All roles | Cancel registration |
| GET | /api/registrations/my | All roles | Get own registrations |
| GET | /api/registrations/event/{eventId} | CLUB_ADMIN, COLLEGE_ADMIN, SUPER_ADMIN | Get all registrations for event |
| GET | /api/registrations/event/{eventId}/count | All roles | Get registration count |

### 7.5 HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input, business rule violation |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient role permissions |
| 404 | Not Found | Resource does not exist |
| 405 | Method Not Allowed | Wrong HTTP method |
| 409 | Conflict | Duplicate data, DB constraint violation |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Internal Server Error | Unexpected server error |

---

## 8. Security Requirements

### 8.1 Authentication Flow

1. User submits email and password to POST /api/auth/login
2. Spring Security authenticates via DaoAuthenticationProvider
3. BCrypt verifies the hashed password against the stored hash
4. JWT token generated with 24-hour expiry and HS256 signature
5. Token returned to the client
6. Client sends token in the Authorization header as: Bearer token
7. JwtFilter validates the token on every subsequent request
8. SecurityContext is populated with the authenticated user's details

### 8.2 RBAC Matrix

| Endpoint Group | STUDENT | CLUB_ADMIN | COLLEGE_ADMIN | SUPER_ADMIN |
|----------------|---------|------------|---------------|-------------|
| Auth | ✅ | ✅ | ✅ | ✅ |
| Own Profile | ✅ | ✅ | ✅ | ✅ |
| User Management | ❌ | ❌ | ✅ | ✅ |
| Create Club | ❌ | ✅ | ❌ | ❌ |
| Approve/Reject Club | ❌ | ❌ | ✅ | ✅ |
| Create Fest | ❌ | ❌ | ✅ | ✅ |
| Create Event | ❌ | ✅ | ✅ | ✅ |
| Publish/Cancel Event | ❌ | ✅ | ✅ | ✅ |
| Register for Event | ✅ | ✅ | ✅ | ✅ |
| View All Registrations | ❌ | ✅ | ✅ | ✅ |

### 8.3 Public Endpoints (No Authentication Required)

```
POST /api/auth/register
POST /api/auth/login
GET  /swagger-ui/**
GET  /api-docs/**
GET  /v3/api-docs/**
```

---

## 9. Constraints and Assumptions

### 9.1 Constraints

| Category | Constraint |
|----------|-----------|
| Scope | Single college (MITAOE) only |
| Platform | Web application only (no mobile) |
| Payment | Razorpay only |
| Team | 5-member development team |
| Timeline | 30-day delivery deadline |
| Regulatory | Student data privacy compliance required |

### 9.2 Assumptions

- Internet connectivity is available for all users
- MITAOE provides institutional support for platform adoption
- 15–20 clubs will onboard during initial rollout
- Club coordinators are available for onboarding and training
- PostgreSQL is available on the deployment server

---

## 10. Out of Scope

The following features are explicitly excluded from this version:

| Feature | Reason |
|---------|--------|
| Multi-college support | MVP is MITAOE-only |
| Mobile applications (iOS/Android) | Web-only for MVP |
| Certificate generation | Deferred to future milestone |
| Advanced reporting dashboards | Deferred to future milestone |
| Calendar sync / social media integration | Out of scope |
| SMS notifications | Out of scope |
| QR code check-in system | Out of scope |
| Marketing features | Out of scope |
| College onboarding workflows | Out of scope |
| Result announcement system | Out of scope |
| Prize distribution management | Out of scope |

---

## 11. Glossary

| Term | Definition |
|------|-----------|
| MITAOE | MIT Academy of Engineering, Pune |
| MVP | Minimum Viable Product |
| JWT | JSON Web Token — stateless authentication mechanism |
| RBAC | Role-Based Access Control |
| BCrypt | Password hashing algorithm |
| JPA | Java Persistence API |
| ORM | Object-Relational Mapping |
| ACID | Atomicity, Consistency, Isolation, Durability |
| REST | Representational State Transfer |
| API | Application Programming Interface |
| Razorpay | Payment gateway used for processing event fees |
| DRAFT | Event status — not yet visible to students |
| PUBLISHED | Event status — visible and open for registration |
| PENDING | Club status — awaiting admin approval |
| SOLO | Event participation type — individual registration |
| TEAM | Event participation type — group registration with defined team size |
| FREE | Event fee type — no payment required |
| PAID | Event fee type — payment required via Razorpay |
| Swagger UI | Interactive API documentation at /swagger-ui.html |
| DDL | Data Definition Language |
| FK | Foreign Key |
| PK | Primary Key |
