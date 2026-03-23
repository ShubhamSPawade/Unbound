# Service Charter Document  
# Fest Management Platform  

## Purpose  
To automate and centralize the lifecycle of college hackathons and technical fests, replacing fragmented manual tools with a single, high-performance platform for MITAOE.

---

## Objective  
To make the process of organizing, registering for, and managing hackathons:

- **Time Saving:** Reducing the administrative workload for club coordinators by automating team formation and registration tracking.  
- **Precise and Accurate Result:** Ensuring zero data duplication and accurate payment verification for paid events.  
- **Well Structured and Managed:** Providing a clear hierarchy for college admins to oversee multiple clubs and fests from one dashboard.

---

## Demand / Opportunity  
There is a significant opportunity as currently no dedicated, all-in-one hackathon platform is tailored for the MITAOE ecosystem. Most developers and club leads are forced to use a mix of :contentReference[oaicite:0]{index=0}, :contentReference[oaicite:1]{index=1}, and :contentReference[oaicite:2]{index=2}, which fails when handling long and complex participant models and team-based relationships.

---

# Business Requirements  

## BR1: User Authentication  

### Description  
A secure authentication mechanism must be implemented to control access to the platform.

### Requirement  
Users including Admins, Coordinators, and Students must log in using a valid username/email and password to access the platform. The system must verify credentials before granting access.

### Justification  
This ensures secure access control, protects sensitive student data, and prevents unauthorized users from modifying event or platform settings.

---

## BR2: Event / Hackathon Creation  

### Description  
The system must allow organizers to create and configure events or hackathons easily.

### Requirement  
Authorized users should be able to create an event by defining key attributes such as:

- Event Name  
- Date and Time  
- Venue  
- Team Size  
- Eligibility Criteria  
- Event Category  

### Justification  
This functionality enables organizers to quickly deploy different types of events such as technical fests, cultural programs, workshops, or hackathons.

---

## BR3: Relationship Mapping (Team Management)  

### Description  
The system must support structured relationships between participants and teams.

### Requirement  
The platform must allow mapping relationships between Students, Teams, Mentors, and Projects. Multiple students should be able to join a team.

### Justification  
This automates complex team formation and project allocation, which is one of the most challenging aspects of managing hackathons and collaborative competitions.

---

## BR4: Event Reusability  

### Description  
The platform must allow organizers to reuse previous event configurations.

### Requirement  
Existing event templates, registration structures, and configurations should be reusable for future events with necessary modifications.

### Justification  
This reduces repetitive setup work and allows clubs to replicate successful event structures efficiently for future semesters.

---

# Technical Requirements  

To manage high-traffic college fests and complex nested hierarchies, the following technical standards are established:

- **System Scalability:**  
  Architecture must support horizontal scaling to handle up to **500 concurrent users** during peak registration windows.

- **Multi-Tier Nested Hierarchy:**  
  Core logic must support:

  - College → Fest → Club → Event  
  - College → Club → Standalone Event  

- **Access Control (RBAC):**  
  Role-Based Access Control for:

  - Super Admin (University)  
  - Admin (College)  
  - Club Admin (Club Leads)  
  - User (Students)  

- **Transaction Integrity:**  
  Atomic transaction handling must prevent over-booking of limited-capacity workshops or competitions.

- **Notification Engine:**  
  Real-time schedule changes and registration confirmations via asynchronous messaging and SMTP triggers.

---

# Technological Requirements  

## Technology Stack  

| Component | Selected Technology | Primary Reason |
|----------|----------------------|----------------|
| Frontend | :contentReference[oaicite:3]{index=3} | Component-based architecture for reusable UI |
| Backend | :contentReference[oaicite:4]{index=4} | Enterprise-grade security and multithreading |
| Database | :contentReference[oaicite:5]{index=5} | Strong relational integrity and JSONB support |

---

## Frontend Framework Comparison  

| Feature | React (Chosen) | Angular | Vue.js |
|--------|----------------|---------|--------|
| Learning Curve | Moderate | High | Low |
| Performance | High (Virtual DOM) | High (Real DOM) | High (Virtual DOM) |
| Ecosystem | Massive (Tailwind CSS, shadcn/ui) | Full-featured but rigid | Smaller than React |
| Decision | Chosen | Not Selected | Not Selected |

---

## Database Comparison  

| Feature | PostgreSQL (Selected) | MySQL | MongoDB |
|--------|------------------------|-------|---------|
| Data Model | Relational (Strict) | Relational (Strict) | Document (Flexible) |
| Joins | Excellent | Good | Poor |
| ACID Compliance | Full | Full | Document-level only |
| Scalability | Vertical + Horizontal | Mostly Vertical | Excellent Horizontal |
| Nested Logic | JSONB Support | Limited JSON | Native JSON |

### Why PostgreSQL?  
:contentReference[oaicite:6]{index=6} is selected because the **Fest → Club → Event** structure is inherently relational while still requiring JSON flexibility.

---

# Human Resources  

1. **1 Project Lead (Scrum Master)** — Sprint planning and stakeholder alignment  
2. **2 Frontend Developers** — Student portal and club dashboard  
3. **2 Backend Developers** — API architecture, schema, security  
4. **1 UI/UX Designer** — Accessibility and design  
5. **1 QA Engineer** — Unit testing and E2E testing  

---

# PESTEL Analysis  

| Factor | Impact on Project | Example |
|--------|-------------------|---------|
| Political | No direct restrictions | MITAOE internal platform |
| Economic | Reduces manual cost | Less dependency on paid tools |
| Social | Improves participation | Easier event discovery |
| Technological | Enables central automation | Integrated platform |
| Environmental | Reduces paperwork | Digital registration |
| Legal | Data and payment compliance | Secure student data |

---

# Risk Analysis  

## Model Used  
**FMEA-based model + ISO 31000**

## Formula  
**RPN = Likelihood × Impact × Detectability**

Where:

- **Likelihood (1–5)** = chance risk occurs  
- **Impact (1–5)** = severity  
- **Detectability (1–5)** = difficulty of early detection  

## Risk Analysis Link  
https://docs.google.com/spreadsheets/d/1PWZpNunfXjQh3dDIHBo_Y4v_pOvMltn0CBHHJmthoI/edit?usp=sharing

---

# Timeline / Milestones  

| Phase | Milestone | Tasks | Timeline |
|------|-----------|-------|----------|
| 1 | Requirement Analysis & Planning | Requirements, flow, dependencies, wireframes | Week 1 |
| 2 | Database Design and API Development | Schema, APIs, auth, postman testing | Week 2 |
| 3 | UI Development and API Integration | UI, state management, validation | Week 3 |
| 4 | Testing & Debugging | UI/UX testing, bug fixing | Week 4 |
| 5 | Deployment & Final Review | AWS, CI/CD, monitoring | Week 4 |

---

# Stakeholder Table  

| Stakeholder | Role |
|------------|------|
| MITAOE Admin | Oversees events and clubs |
| Club Coordinators | Create and manage events |
| Students | Register and participate |
| Development Team | Build and maintain platform |
| QA Team | Ensure system quality |

---
