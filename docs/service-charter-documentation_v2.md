# Service Charter Document  
# Fest Management Platform

---

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
There is a significant opportunity as currently no dedicated all-in-one hackathon platform is tailored for the MITAOE ecosystem. Most developers and club leads are forced to use a mix of Google Forms, WhatsApp, and Excel, which fails when handling long and complex participant models and team-based relationships.

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
Authorized users should be able to create an event by defining:

- Event Name  
- Date and Time  
- Venue  
- Team Size  
- Eligibility Criteria  
- Event Category  

### Justification
This enables organizers to deploy technical fests, cultural programs, workshops, and hackathons quickly.

---

## BR3: Relationship Mapping (Team Management)
### Description
The system must support structured relationships between participants and teams.

### Requirement
The platform must allow mapping relationships between Students, Teams, Mentors, and Projects. Multiple students should be able to join a team.

### Justification
This automates complex team formation and project allocation.

---

## BR4: Event Reusability
### Description
The platform must allow organizers to reuse previous event configurations.

### Requirement
Existing event templates, registration structures, and configurations should be reusable for future events with necessary modifications.

### Justification
This reduces repetitive setup work.

---

# Technical Requirements

- **System Scalability:** Support up to 500 concurrent users during peak registrations.  
- **Multi-Tier Nested Hierarchy:**  
  - College → Fest → Club → Event  
  - College → Club → Standalone Event  

- **Access Control (RBAC):**
  - Super Admin  
  - Admin  
  - Club Admin  
  - User  

- **Transaction Integrity:** Prevent over-booking using atomic transactions.  

- **Notification Engine:** Real-time delivery through asynchronous messaging and SMTP triggers.

---

# Technological Requirements

| Component | Selected Technology | Primary Reason |
|----------|----------------------|----------------|
| Frontend | React | Component-based reusable UI |
| Backend | Java with Spring Boot | Enterprise-grade security and concurrency |
| Database | PostgreSQL | Strict relational integrity |

---

# Frontend Framework Comparison

| Feature | React (Chosen) | Angular | Vue.js |
|--------|----------------|---------|--------|
| Learning Curve | Moderate | High | Low |
| Performance | High (Virtual DOM) | High | High |
| Ecosystem | Massive | Rigid | Smaller |

---

# Database Comparison

| Feature | PostgreSQL | MySQL | MongoDB |
|--------|------------|-------|---------|
| Data Model | Relational | Relational | Document |
| Joins | Excellent | Good | Poor |
| ACID | Full | Full | Partial |
| Scalability | Vertical + Horizontal | Vertical | Horizontal |

PostgreSQL is selected because the Fest → Club → Event model is inherently relational.

---

# Human Resources

1. Project Lead (Scrum Master)  
2. Frontend Developers  
3. Backend Developers  
4. UI/UX Designer  
5. QA Engineer  

---

# PESTEL Analysis

| Factor | Impact | Example |
|--------|--------|---------|
| Political | No restriction | Internal platform |
| Economic | Reduces cost | Less paid tools |
| Social | Improves engagement | Event discovery |
| Technological | - | - |
| Environmental | Less paperwork | Eco-friendly |
| Legal | Data compliance | Secure payments |

---

# Risk Analysis

## Methodology
FMEA-based model aligned with ISO 31000

## Formula
RPN = Likelihood × Impact × Detectability

Where:

- Likelihood (1–5)  
- Impact (1–5)  
- Detectability (1–5)

## Risk Register Link
https://docs.google.com/spreadsheets/d/1PWZpNunfXjQh3dDIHBo_Y4v-_pOvMltn0CBHHJmthoI/edit?usp=sharing

---

# Timeline / Milestone

| Phase | Milestone | Tasks | Timeline |
|------|-----------|-------|----------|
| 1 | Requirement Analysis & Planning | Requirements, flow, dependencies, UI | Week 1 |
| 2 | Database Design and API Development | Schema, APIs, auth, testing | Week 2 |
| 3 | UI Development and API Integration | UI, state, integration | Week 3 |
| 4 | Testing & Debugging | UI/API testing, fixes | Week 4 |
| 5 | Deployment & Final Review | AWS, CI/CD, documentation | Week 4 |

---

# Stakeholder Table

| Stakeholder | Role |
|------------|------|
| MITAOE Admin | Oversees events and clubs |
| Club Coordinators | Manage events |
| Students | Register and participate |
| Development Team | Build platform |
| QA Team | Ensure quality |

---

# Work Breakdown Structure (WBS)

## 1.0 Requirement Analysis & System Design

### 1.1 Requirement Documentation
- 1.1.1 Create Project Charter Document  
- 1.1.2 Create BRD  
- 1.1.3 Create SRS  
- 1.1.4 Prepare project documentation  

### 1.2 System Design
- 1.2.1 Define system architecture  
- 1.2.2 Create API design  
- 1.2.3 Define RBAC  
- 1.2.4 Identify integrations  

### 1.3 Database Design
- 1.3.1 Create ER diagram  

### 1.4 UI Planning
- 1.4.1 Create wireframes  

### 1.5 Project Setup
- 1.5.1 Setup GitHub  
- 1.5.2 Branching strategy  
- 1.5.3 Project board  

---

## 2.0 Backend Core Development

### 2.1 Backend Initialization
- 2.1.1 Initialize Spring Boot  

### 2.2 Database Setup
- 2.2.1 Configure PostgreSQL  
- 2.2.2 Implement schema  

### 2.3 Authentication & Authorization
- 2.3.1 JWT API  
- 2.3.2 BCrypt  
- 2.3.3 RBAC  

### 2.4 Core API Development
- Club APIs  
- Fest APIs  
- Event CRUD  
- Registration APIs  

---

## 3.0 Frontend Development

### 3.1 Frontend Setup
- React setup  
- React Router  

### 3.2 Student Module
- Dashboard  
- Event Listing  
- Event Details  
- My Events  

---

## 4.0 Feature Completion & Payment Integration

### 4.1 Payment Integration
- Razorpay integration  
- Callback handling  
- Payment history  

---

## 5.0 Testing Optimization & Deployment

### 5.1 Testing
- JUnit  
- API testing  
- Registration testing  
- Payment testing  

### 5.4 Deployment
- AWS EC2  
- PostgreSQL RDS  
- Backend deploy  
- Frontend deploy  
- SSL  

---
