# Document Approval

| Approver | Title | Business Area | Approval Date |
|----------|-------|---------------|---------------|
| Shubham Pawade | Product Owner | Owner | 03/03/2026 |
| Pratik Bhosale | Project Manager | Manager | 03/03/2026 |
| Jayesh Raut | Project Head | Faculty |  |

# Document Distribution

| Name | Title | Business Area |
|------|-------|---------------|
| Pratik Bhosale | Project Manager | Manager |
| Shubham Pawade | Product Owner | Owner |
| Jayesh Raut | Project Head | Faculty |

# Revision History

| Date | Author | Version | Summary Of Changes | Status |
|------|--------|---------|--------------------|--------|
| 01/03/2026 | Prasad Ingole | 0.1 | Made the Initial Document | Reviewed |
| 03/03/2026 | Pratik Bhosale | 0.2 | Refined the Scope and Constraints of the Project | Under Scrutiny |

# Table of Contents

1. Executive Summary  
2. Project Objectives  
3. Project Scope  
   - 3.1 In Scope  
   - 3.2 Out of Scope  
4. Business Requirement  
5. Current Process  
   - 5.1 Current Process Description  
   - 5.2 Problem Statement  
6. Proposed Process  
   - 6.1 Proposed Process Description  
   - 6.2 Key Improvements  
   - 6.3 Process Impact Analysis  
   - 6.4 Key Stakeholders  
7. Constraints & Assumptions  
8. Success Criteria & KPIs (Key Performance Indicators)  
9. Risks & Mitigation Strategies  
10. Glossary  
11. References  
12. Appendix  

# 1 Executive Summary

Unbound is a centralized event management platform developed specifically for MITAOE (MIT Academy of Engineering) that simplifies event organization, registration, and student participation. It addresses fragmentation caused by disparate tools like WhatsApp, spreadsheets, and email, providing one unified system for the college.  

The platform aims to reduce manual coordination effort, increase student engagement, and improve visibility into event performance within MITAOE.

## Key Benefits

- Centralized event management for MITAOE and its clubs  
- Streamlined student registration experience  
- Real-time analytics and performance tracking  
- Reduced administrative overhead for club coordinators  

# 2 Project Objectives

| Objective ID | Business Objective | Specific | Measurable | Achievable | Relevant |
|--------------|-------------------|----------|------------|------------|----------|
| OBJ-01 | MVP Deployment | Launch core modules: Admin, Club, Student, and Payments. | 100% of "In-Scope" features live and functional. | 5-member team focusing on core MVP functionality. | Solves the fragmentation of tools at MITAOE. |
| OBJ-02 | Club Onboarding | Transition campus clubs from WhatsApp to Unbound. | 15–20 clubs actively managing event profiles. | Direct engagement with current club coordinators. | Centralization requires high club participation. |
| OBJ-03 | Student Engagement | Drive event discovery and registration through the platform. | Reach a minimum of 2,000 unique registrations. | Targeted at the existing MITAOE student body. | Primary measure of platform value and success. |
| OBJ-04 | Payment Automation | Securely process fees for paid workshops and fests. | 95% successful payment completion rate. | Integration via Razorpay API and sandbox testing. | Eliminates manual tracking and cash handling. |
| OBJ-05 | Admin Efficiency | Reduce time spent on manual event coordination. | 50% reduction in manual data entry time. | Through automated dashboards and data exports. | Frees up coordinator time for better event quality. |

# 3 Project Scope

## 3.1 In Scope

The following areas are in scope for this project:

### 1) MITAOE Admin Features

- Admin login (single college - MITAOE)  
- Fest creation and management  
- View all club events  
- Event performance dashboard  
- Club management (approve/manage clubs)  

### 2) Club Management

- Club profile setup  
- Club admin login  
- Event creation (standalone or under fest)  
- Event editing and management  
- View club-specific registrations  

### 3) Event Management

- Event creation and editing by clubs  
- Event categories (technical, cultural, sports, workshops, etc.)  
- Event details (date, venue, eligibility, description)  
- Event status management (draft, published, cancelled)  
- Registration capacity management  

### 4) Student Features (MITAOE Students)

- Student account creation and login  
- Browse all MITAOE events  
- Filter events by category, date, club  
- Search functionality  
- One-click event registration  
- My Events dashboard  

### 5) Payment Integration

- Payment for paid events  
- Payment gateway integration (Razorpay)  
- Support for free and paid events  
- Payment confirmation and receipt  
- Transaction history for students  

## 3.2 Out of Scope

The following areas are out of scope for this project:

- Multi-college support (only MITAOE)  
- Mobile applications (iOS/Android)  
- Certificate generation  
- Advanced reporting dashboards  
- Third-party integrations (calendar sync, social media)  
- SMS notifications  
- QR code check-in system  
- Marketing features  
- College onboarding workflows  

# 4 Business Requirement

| BR ID | Requirement Title | Business Requirement | Key Subpoints (Important Only) | Business Justification |
|------|-------------------|----------------------|-------------------------------|------------------------|
| BR1 | MITAOE Admin System | Admin must manage the platform and oversee all club activities. | Create & manage fests, View all club events, Manage club profiles, View college-wide dashboard | Ensures centralized governance and institutional control. |
| BR2 | Club Management | Clubs must independently manage their events. | Create & manage events, Manage registrations, View club-level analytics | Empowers clubs while maintaining oversight. |
| BR3 | Event System | Events must be structured and informative. | Categorized events, Complete event details, Event status tracking | Provides clarity and transparency for students. |
| BR4 | Student Experience | Students must easily discover and register for events. | Browse & filter events, Search functionality, One-click registration, My Events dashboard | Improves student participation and satisfaction. |
| BR5 | Authentication & Authorization | System must support secure role-based access. | Role-based access, Secure login & password recovery | Protects data and ensures proper access control. |
| BR6 | Data & Reporting | Platform must provide essential event metrics. | Registration tracking, Capacity monitoring, Basic report export | Enables data-driven decision making. |
| BR7 | Payment Processing | Platform must support online payments for paid events. | Free/Paid event option, Secure payment gateway integration, Transaction tracking | Eliminates manual payment handling and enables monetization. |

# 5 Current Process

## 5.1.1 Current Process Description

Currently, event management at MITAOE is decentralized and relies on manual coordination across fragmented platforms.

1. Planning: Club coordinators plan events offline or via internal WhatsApp groups.  
2. Promotion: Marketing is done via fragmented WhatsApp status updates and unofficial posters.  
3. Registration: Students fill out disparate Google Forms.  
4. Payment: Coordinators manually verify screenshots of UPI transactions or collect cash.  
5. Tracking: Data is manually moved from Google Forms to Excel Spreadsheets.  
6. Reporting: No centralized reporting exists.  

## 5.1.2 Problem Statement

- Discovery Deficit: Students frequently miss events because there is no central source of truth.  
- Data Integrity Risks: Manual tracking leads to duplicate entries and lost records.  
- Operational Overload: Coordinators spend more time on admin than event quality.  
- Lack of Oversight: MITAOE Administration cannot monitor trends effectively.  

# 6 Proposed Process

## 6.1.1 Proposed Process Description

1. Centralized Planning  
2. Unified Discovery  
3. One-Click Registration  
4. Automated Payment  
5. Real-Time Analytics  
6. Institutional Oversight  

## 6.1.2 Key Improvements

| Feature | Current Process (Manual) | Proposed Process (Unbound) |
|---------|---------------------------|-----------------------------|
| Event Visibility | Scattered | Centralized |
| Registration | Google Forms | One-Click |
| Payment | Manual | Razorpay Integration |
| Data Management | Manual Spreadsheets | Live Database |
| Admin Oversight | None | Global Dashboard |

## 6.1.3 Process Impact Analysis

- Reduced Friction  
- Data Integrity  
- Increased Participation  
- Standardization  

## 6.1.4 Key Stakeholders

| Stakeholder | Role / Interest | Key Responsibilities | Involvement Level |
|-------------|----------------|----------------------|------------------|
| MITAOE Admin | Platform Governance & Oversight | Approving club profiles, analytics | High |
| Club Coordinators | Event Operations & Execution | Managing events | High |
| MITAOE Students | End Users | Registering and payments | High |
| Development Team | Technical Delivery | System architecture | High |
| QA / Testing Team | Quality Assurance | Testing and bug tracking | Medium |
| Finance/Accounts Office | Financial Audit | Reconciliation | Low |

# 7 Constraints & Assumptions

## 7.1.1 Project Constraints

| Category | Constraint Details |
|----------|-------------------|
| Scope | Single-college only |
| Technical | Web only, Razorpay only |
| Resource | 5-member team |
| Time | 30-day deadline |
| Regulatory | Data privacy compliance |

## 7.1.2 Project Assumptions

- Internet access available  
- Institutional support exists  
- 15–20 clubs adopt platform  
- Coordinators available for training  

# 8 Success Criteria & KPIs

## 8.1.1 Operational Metrics

- 100% deployment in 1 month  
- 2,000+ registrations  
- 100+ events onboarded  

## 8.1.2 Engagement Metrics

- ≥ 85% satisfaction  
- 30% attendance increase  
- 70% club adoption  

## 8.1.3 System Performance Metrics

- 99% uptime  
- < 3 sec load time  
- > 90% completion rate  

# 9 Risks & Mitigation Strategies

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| Aggressive Timeline | High | High | Agile methodology |
| Payment Gateway Delays | High | Medium | Early integration |
| Low Club Adoption | High | Medium | Training sessions |
| Technical Bottlenecks | High | High | Strict MVP focus |
| Security Breach | High | Low | JWT + SSL |
| Scope Creep | High | High | Change Request process |
| Team Unavailability | Medium | Medium | Cross-training |

# 10 Glossary

| Term | Explanation |
|------|-------------|
| MITAOE | MIT Academy of Engineering |
| MVP | Minimum Viable Product |
| Razorpay | Payment gateway |
| RBAC | Role-Based Access Control |
| UAT | User Acceptance Testing |
| API | Application Programming Interface |

# 11 References

| Name | Link |
|------|------|
| MITAOE Official Website | https://mitaoe.ac.in/ |
| Razorpay Docs | https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/ |
| GitHub Repository | https://github.com/PratikPBhosale/Unbound |
| Hack2Skill | https://hack2skill.com/ |
| Unstop | https://unstop.com/ |

# 12 Appendix

## 12.1.1.1 Appendix A: User Stories

| User Role | Requirement | Goal |
|----------|-------------|------|
| Student | Filter events by category | Quickly find relevant events |
| Student | View registration history | Track events |
| Club Coordinator | Export registration data | Manage attendance |
| Club Coordinator | Set registration capacity | Prevent overbooking |
| MITAOE Admin | Approve club profile request | Ensure authorized hosting |

## 12.1.1.2 Appendix B: Business Driver Analysis

- Automation Driver: Real-time payment reconciliation  
- Centralization Driver: Unified portal instead of fragmented groups  
- Data Accuracy Driver: Reduced duplicate entries  
