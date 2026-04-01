# Unbound Fest Management Platform SRS

## Introduction
The Unbound project addresses fragmented administrative processes for technical and cultural fests at MIT Academy of Engineering (MITAOE) by providing a unified digital platform. It replaces manual workflows with a relational database system ensuring data integrity across colleges, clubs, fests, and student participation. Current systems create data silos and errors, which Unbound resolves through interconnected entities via primary and foreign keys.

## Engineering Vision
Unbound aims for relational consistency, preventing data duplication and enabling verified certificate issuance. The platform uses a multi-tenant user model in the `users` entity, linking users to colleges via `collegeid` for scoped administrative actions.

## User Hierarchy
The system employs Role-Based Access Control (RBAC) with defined roles:

| User Role     | Primary Access Rights     | Core Responsibility                          |
|---------------|---------------------------|----------------------------------------------|
| Super Admin  | Global System Privileges | Global oversight and audits across colleges |
| College Admin| College-Level Privileges | Manage clubs, fests, announcements per college |
| Club Admin   | Moderator Privileges     | Organize events within specific clubs |
| Student      | Standard User Privileges | Event discovery, registrations, team participation |

## System Architecture
Unbound features a three-tier decoupled architecture: Presentation, Application, and Data layers for fault isolation and high throughput. Key pillars include Next.js 16 for SSR in the presentation layer, Spring Boot 3.5.11 for business logic, PostgreSQL 15 for 12 entities with constraints, and AWS Fargate for scaling.

Backend validation ensures `user.collegeid` matches `fest.collegeid` before registrations.

## Technical Stack
| Component            | Technology          | Version     | Justification                                      |
|----------------------|---------------------|-------------|----------------------------------------------------|
| Language            | Java               | 17         | Type-safety between schema and API                |
| Backend Framework   | Spring Boot        | 3.5.11     | JPA/Hibernate for entities                        |
| Frontend Framework  | Next.js            | 16.x       | Server Components for data fetching               |
| Database            | PostgreSQL         | 15.17      | Relational constraints and joins                   |
| Cloud Orchestration | AWS Fargate        | Latest     | Serverless containers                             |
| Payment Gateway     | Razorpay SDK       | 1.4.3      | Registration status updates                       |

## Functional Requirements
### Security and RBAC
Sessions validate roles (Student, Club Admin, etc.) to restrict access to modules like announcements and certificates.

### Registration Logic
`registrations` entity bridges users and events with pessimistic locking for capacity checks and collegeid validation. Team events use `teams` and `team_members` tables.

### Attendance and Certification
Certificates issued only for `present` attendance and `completed` registrations, storing `certificateurl`.

## Use Cases: User Interaction
- **Solo Registration**: Authenticated student browses, registers (pending to confirmed post-payment), exceptions for mismatch or capacity.
- **Team Formation**: Leader creates team, members join with college validation.

## Use Cases: Administration
- **College Management**: Publish announcements/fests scoped to `collegeid`.
- **Event Orchestration**: Club admins create events with relational keys.

## External Integrations
- **AWS RDS**: Hosts entities with foreign keys, read-replicas for scalability.
- **Razorpay**: Webhooks update `registrations` status post-HMAC verification.

## Non-Functional Requirements
### Performance
Handles 500-600 concurrent inserts, sub-300ms JOIN queries.

### Security and Reliability
BCrypt passwords, TLS 1.3, Multi-AZ, daily backups.

## Conclusion
Unbound transforms fest management with 12 entities, RBAC, and ACID compliance for thousands of users. Future expansions include AI recommendations without schema changes.
