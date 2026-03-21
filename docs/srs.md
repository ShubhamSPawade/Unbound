Software Requirements Specification (SRS)
Version: v2.0
Project: Unbound Fest Management Platform
Institution: MIT Academy of Engineering (MITAOE)

Goal: Architect a centralized, high-concurrency digital ecosystem for managing college hackathons and technical fests, replacing manual tools.

Introduction
The SRS defines the technical framework for Unbound, revolutionizing event organization at MITAOE with a high-performance ecosystem. It acts as the agreement between the Scrum team and stakeholders for alignment. Current tools like Google Forms and Excel fail under load; Unbound handles 5,000–7,500 concurrent users with relational mapping and transaction integrity.

Project Scope
Unbound manages the full lifecycle, from student discovery to mentor-team mapping, providing admins a centralized dashboard. It targets MITAOE's hierarchical structure for events like hackathons.

System Architecture
Three-Tier Design
Uses decoupled presentation, business logic, and data layers for independent scaling, preventing bottlenecks during registrations.

Tech Stack
| Component      | Technology         | Version | Justification                           |
| -------------- | ------------------ | ------- | --------------------------------------- |
| Frontend       | React (Dockerized) | 18.x    | Modular UI with Virtual DOM 
| Backend        | Java Spring Boot   | 17/3.x  | High-throughput multi-threading 
| Database       | PostgreSQL         | 15+     | ACID compliance for relations 
| Infrastructure | AWS Cloud          | Latest  | EC2, RDS, API Gateway scaling 
| Security       | JWT/BCrypt         | -       | Stateless sessions, hashing 

Containerization
Docker ensures environment parity; multi-stage builds, Nginx runtime, AWS ECS/Fargate deployment.

Functional Requirements
BR1: Authentication – Role-based login (Admins, Students) with JWT tokens; protects records.

BR2: Event Creation – Define details, clone templates for reusability across fests.

BR3: Team Mapping – Automate student-team-project-mentor links with unique codes.

Use Cases
Student Registration
Select event, create/join team.

Validate size/eligibility.

Persist mapping, send SMTP confirmation.
Exception: Conflict on duplicate registration.

Multi-Club Orchestration
Admin creates parent fest, assigns clubs, gets dashboard.

Event Cloning
Coordinator clones template, updates details, publishes.

Non-Functional Requirements
Performance
Supports 5,000–7,500 users; <300ms P95 latency; atomic PostgreSQL updates.

Security
BCrypt passwords, JWT auth, RBAC via Spring Security.

Reliability
99.9% uptime; async notifications.

Risks and Mitigation
Risk	             Probability	Impact	  Mitigation
Write Contention	  Medium	     High	Pessimistic locking 
Cloud Failover	        Low	    Critical	AWS RDS Multi-AZ 
Privilege Escalation	Low	     High	Spring Security RBAC 
Scalability Bottleneck	Medium	 High	AWS Auto-Scaling 

Resources
Team: 1 Scrum Master, 2 Frontend, 2 Backend, 1 UI/UX, 1 QA.

Infra: Docker, AWS RDS PostgreSQL.

Schedule
Week 1: Analysis, wireframes.

Week 2: DB/API dev.

Week 3: UI/testing.

Week 4: Deploy/review.

