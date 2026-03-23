# Service Charter Document  
# Fest Management Platform

## Purpose
To automate and centralize the lifecycle of college hackathons, technical fests, workshops, and student events by replacing fragmented manual tools with a single high-performance digital platform for MITAOE.

## Objective
To improve the process of organizing, registering for, and managing college events through a centralized system:

- **Time Saving:** Reduce administrative workload for club coordinators through automated registration tracking and streamlined event setup.  
- **Precise and Accurate Results:** Ensure zero data duplication and accurate participant/payment records for both free and paid events.  
- **Well Structured and Managed:** Provide a clear hierarchy for college administrators to monitor clubs, fests, and registrations from one dashboard.  

## Demand / Opportunity
Currently, no dedicated all-in-one event platform exists specifically for the MITAOE ecosystem. Clubs rely on a fragmented combination of Google Forms, WhatsApp, spreadsheets, and manual payment verification, which becomes inefficient when handling large registrations, multiple events, and team-based participation models.

A centralized platform creates a strong opportunity to improve visibility, operational efficiency, and student engagement across all college clubs.

## Business Requirements

### BR1: User Authentication
**Description:**  
A secure authentication mechanism must be implemented to control access to the platform.

**Requirement:**  
Users including Admins, Coordinators, and Students must log in using a valid username/email and password. The system must verify credentials before granting access.

**Justification:**  
Ensures secure access control, protects student data, and prevents unauthorized modification of platform settings.

---

### BR2: Event / Hackathon Creation
**Description:**  
The platform must allow organizers to create and configure events efficiently.

**Requirement:**  
Authorized users should define:

- Event Name  
- Date and Time  
- Venue  
- Team Size  
- Eligibility Criteria  
- Event Category  

**Justification:**  
Allows clubs to quickly deploy technical events, workshops, hackathons, and cultural programs.

---

### BR3: Relationship Mapping (Team Management)
**Description:**  
The system must support structured participant relationships.

**Requirement:**  
The platform must support relationships between Students, Teams, Mentors, and Projects. Multiple students should be able to join one team.

**Justification:**  
Automates team formation and project allocation, reducing manual coordination complexity.

---

### BR4: Event Reusability
**Description:**  
Organizers must be able to reuse previous event structures.

**Requirement:**  
Existing event templates, registration formats, and configurations should be reusable with modifications.

**Justification:**  
Reduces repetitive setup effort and improves consistency across semesters.

---

## Technical Requirements

- **System Scalability:**  
  Architecture must support up to 500 concurrent users during peak registrations.

- **Multi-Tier Nested Hierarchy:**  
  Core relationships must support:

  - College → Fest → Club → Event  
  - College → Club → Standalone Event  

- **Access Control (RBAC):**  
  Four role levels:

  - Super Admin (University)  
  - Admin (College)  
  - Moderator (Club Leads)  
  - User (Students)  

- **Transaction Integrity:**  
  Atomic transaction handling must prevent over-booking of limited-capacity events.

- **Notification Engine:**  
  Real-time confirmations and schedule updates via asynchronous email notifications.

---

## Technological Requirements

| Component | Selected Technology | Primary Reason |
|-----------|----------------------|----------------|
| Frontend | React + Tailwind CSS + shadcn/ui | Component-based scalable UI with utility-first styling and reusable accessible components |
| Backend | Java with Spring Boot | Enterprise-grade security, strong multi-threading, and scalable API development |
| Database | PostgreSQL | Strong relational integrity with JSONB support for flexible event metadata |

---

## Frontend Framework Comparison

| Feature | React (Chosen) | Angular | Vue.js |
|---------|----------------|---------|--------|
| Learning Curve | Moderate | High | Low |
| Performance | High (Virtual DOM) | High (Real DOM) | High (Virtual DOM) |
| Ecosystem | Tailwind CSS + shadcn/ui | Full-featured but rigid | Smaller than React |
| Decision | React | Not Selected | Not Selected |

---

## Database: Why PostgreSQL?

| Feature | PostgreSQL (Selected) | MySQL | MongoDB |
|---------|------------------------|-------|---------|
| Data Model | Relational (Strict) | Relational (Strict) | Document (Flexible) |
| Joins | Excellent for nested relationships | Good | Limited relational capability |
| ACID Compliance | Full | Full | Document-level only |
| Scalability | Vertical + Horizontal | Mostly Vertical | Horizontal |
| Nested Logic | JSONB support | Limited JSON support | Native JSON |

PostgreSQL is selected because the **Fest → Club → Event → Registration** relationship is inherently relational and requires strict consistency.

---

## Resources Needed

- **Infrastructure:** Cloud compute (2–4 vCPUs, Linux, 8GB RAM, 20GB disk), managed database, cloud storage, SSL-enabled domain, email service  
- **Development Tools:** GitHub, Maven, Postman  
- **Security Tools:** JWT, Spring Security, BCrypt  

---

## Human Resources

1. **1 Project Lead (Scrum Master):** Sprint planning and stakeholder coordination  
2. **2 Frontend Developers:** Student and organizer dashboard implementation  
3. **2 Backend Developers:** API development, schema design, security  
4. **1 UI/UX Designer:** Responsive interface design  
5. **1 QA Engineer:** Unit and integration testing  

---

## PESTEL Analysis

| Factor | Impact on Project | Example |
|--------|-------------------|---------|
| Political | No direct restrictions | Internal institutional platform |
| Economic | Reduces manual operational cost | Less dependency on paid tools |
| Social | Increases student participation | Easier event discovery |
| Environmental | Reduces paperwork | Digital registrations |
| Legal | Requires secure handling of student/payment data | Data protection compliance |

---

## Risk Analysis

| Risk | Description | Probability | Impact | Mitigation Strategy |
|------|-------------|-------------|--------|---------------------|
| Software Compatibility | Dependency issues | Medium | Medium | Controlled versioning |
| Database Downtime | Registration interruption | Medium | High | Backup replica |
| Cloud Failure | Service outage | Low | High | Redundant deployment |
| Budget Overrun | Increased development cost | Medium | Medium | Scope control |
| Security Breach | Unauthorized access | Low | High | JWT + RBAC + BCrypt |
| Scalability Issues | Traffic spikes | Medium | High | Load-based scaling |

---

## Timeline / Milestone

| Phase | Milestone | Tasks | Timeline |
|------|-----------|-------|----------|
| 1 | Requirement Analysis & Planning | Requirement gathering, flow design, UI planning | Week 1 |
| 2 | Database Design and API Development | Schema design, APIs, authentication | Week 2 |
| 3 | UI Development and API Integration | Frontend implementation, API integration | Week 3 |
| 4 | Testing & Debugging | Functional testing and fixes | Week 4 |
| 5 | Deployment & Final Review | Hosting, monitoring, documentation | Week 4 |

---

## Stakeholder Table

| Role | Stakeholder Responsibility |
|------|-----------------------------|
| MITAOE Admin | Oversees platform governance |
| Club Coordinators | Manage club events |
| Students | Register and participate |
| Development Team | Build and maintain system |
| QA Team | Validate quality |
