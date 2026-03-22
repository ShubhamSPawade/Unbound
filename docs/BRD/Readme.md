
![](https://web-api.textin.com/ocr_image/external/a06da440eeab7788.jpg)

**DHRUV**

NAVIGATING THE FUTURE

# Dhruv

Navigating The Future

Dhruv

Project ID : D001

Business Requirements Document

Unbound-College Event Management Platform

<!-- [Project Name] -->

**Document Approval**


| Approver | Title | Business Area | Approval Date |
| --- | --- | --- | --- |
| Shubham Pawade | Product Owner | Owner | 03/03/2026 |
| Pratik Bhosale | Project Manager | Manager | 03/03/2026 |
| Jayesh Raut | Project Head | Faculty |  |


**Document Distribution**


| Name | Title | Business Area |
| --- | --- | --- |
| Pratik Bhosale | Project Manager | Manager |
| Shubham Pawade | Product Owner | Owner |
| Jayesh Raut | Project Head | Faculty |


**Revision History**


| Date | Author | Version | Summary Of Changes | Status |
| --- | --- | --- | --- | --- |
| 01/03/2026 | Prasad Ingole | 0.1 | Made the Initial Document | Reviewed |
| 03/03/2026 | Pratik Bhosale | 0.2 | Refined the Scope and Constraints of the Project | Under<br>Scrutiny |


<!-- Business Requirements Document -->

<!-- 2 -->

<!-- v0.2 -->

<!-- [Project Name] -->

# Table of Contents

1Executive Summary.......................................................4

2Project Objectives........................................................4

3Project Scope............................................................5

3.1 In Scope.............................................................5

3.2 Out of Scope.........................................................6

4Business Requirement.....................................................7

5Current Process...........................................................8

5.1 Current Process Description...........................................8

5.2 Problem Statement...................................................8

6 Proposed Process........................................................9

6.1 Proposed Process Description...........................................9

6.2 Key Improvements...................................................10

6.3 Process Impact Analysis.............................................10

6.4 Key Stakeholders....................................................10

7Constraints & Assumptions................................................11

8Success Criteria & KPIs (Key Performance Indicators)..........................12

9Risks & Mitigation Strategies...............................................13

10..Glossary...............................................................14

11..References.............................................................15

12..Appendix...............................................................16

<!-- Business Requirements Document -->

<!-- 3 -->

<!-- v0.2 -->

<!-- [Project Name] -->

# 1 Executive Summary

Unbound is a centralized event management platform developed specifically for MITAOE (MIT Academy of Engineering) that simplifies event organization, registration, and student participation. It addresses fragmentation caused by disparate tools like WhatsApp, spreadsheets, and email, providing one unified system for the college.

The platform aims to reduce manual coordination effort, increase student engagement,and improve visibility intoevent performance within MITAOE.

## Key Benefits

· Centralized event management for MITAOE and its clubs

· Streamlined student registration experience

· Real-time analytics and performance tracking

· Reduced administrative overhead for club coordinators

**2 Project Objectives**


| Objective<br>ID | Business<br>Objective | Specific | Measurable | Achievable | Relevant |
| --- | --- | --- | --- | --- | --- |
| OBJ-01 | MVP<br>Deployment | Launch core<br>modules: Admin,<br>Club, Student,<br>and Payments. | 100% of "In-<br>Scope"<br>features live<br>and functional. | 5-member team<br>focusing on core<br>MVP functionality. | Solves the<br>fragmentation<br>of tooIs at<br>MITAOE. |
| OBJ-02 | Club<br>Onboarding | Transition<br>campus clubs<br>from WhatsApp<br>to Unbound. | 15-20 clubs<br>actively<br>managing<br>event profiles. | Direct<br>engagement with<br>current club<br>coordinators. | Centralization<br>requires high<br>club<br>participation. |
| OBJ-03 | Student<br>Engagement | Drive event<br>discovery and<br>registration<br>through the<br>platform. | Reach a<br>minimum of<br>2,000 unique<br>registrations. | Targeted at the<br>existing MITAOE<br>student body. | Primary<br>measure of<br>platform value<br>and success. |
| OBJ-04 | Payment<br>Automation | Securely process fees for paid<br>workshops and<br>fests. | 95%<br>successful<br>payment<br>completion<br>rate. | Integration via<br>Razorpay API and sandbox testing. | Eliminates<br>manual<br>tracking and<br>cash handling. |
| OBJ-05 | Admin<br>Efficiency | Reduce time<br>spent on manual<br>event<br>coordination. | 50% reduction in manual<br>data entry<br>time. | Through<br>automated<br>dashboards and<br>data exports. | Frees up<br>coordinator<br>time for better<br>event quality. |


<!-- Business Requirements Document -->

<!-- 4 -->

<!-- v0.2 -->

<!-- [Project Name] -->

## 3 Project Scope

### 3.1 In Scope

The following areas are in scope for this project :

#### 1) MITAOE Admin Features

· Admin login (single college - MITAOE)

· Fest creation and management

· View all club events

· Event performance dashboard

· Club management (approve/manage clubs).

#### 2) ClubManagement

· Club profile setup

· Club admin login

Event creation (standalone or under fest)

· Event editing and management

View club-specific registrations

#### 3) Event Management

Event creation and editing by clubs

· Event categories (technical, cultural, sports, workshops, etc.)

· Event details (date, venue, eligibility, description)

<!-- Business Requirements Document -->

<!-- 5 -->

<!-- v0.2 -->

<!-- [Project Name] -->

Event status management (draft, published, cancelled)

· Registration capacity management

#### 4) Student Features (MITAOE Students)

· Student account creation and login

· Browse all MITAOE events

· Filter events by category, date, club

· Searchfunctionality

· One-click event registration

· My Events dashboard

#### 5) Payment Integration

Payment for paid events

· Payment gateway integration (Razorpay)

· Support for free and paid events

·Payment confirmation and receipt

· Transaction history for students

### 3.2 Out of Scope

The following areas are outof scope for this project:

· Multi-college support (only MITAOE)

·Mobile applications (iOS/Android)

· Certificate generation

·Advanced reporting dashboards

· Third-party integrations (calendar sync, social media)

SMS notifications

·QR code check-in system

· Marketing features

· College onboarding workflows

<!-- Business Requirements Document -->

<!-- 6 -->

<!-- v0.2 -->

<!-- [Project Name] -->

**4 Business Requirement**


| BR<br>ID | Requirement<br>Title | Business<br>Requirement | Key Subpoints<br>(Important Only) | Business<br>Justification |
| --- | --- | --- | --- | --- |
| BR1 | MITAOE Admin System | Admin must<br>manage the<br>platform and<br>oversee all club activities. | Create & manage fests-<br>View all club events-<br>Manage club profiles-<br>View college-wide<br>dashboard | Ensures<br>centralized<br>governance and<br>institutional<br>control. |
| BR2 | Club<br>Management | Clubs must<br>independently manage their<br>events. | Create & manage events-Manage registrations-<br>View club-level analytics | Empowers clubs while<br>maintaining<br>oversight. |
| BR3  | Event System | Events must be structured and informative. | Categorized events-<br>Complete event details<br>(date, venue, eligibility,<br>capacity)- Event status<br>tracking | Provides clarity<br>and transparency for students. |
| BR4 |  Student<br>Experience | Students must easily discover and register for events. | Browse & filter events-<br>Search functionality-<br>One-click registration-<br>My Events dashboard | Improves student participation and satisfaction. |
| BR5 | Authentication &<br>Authorization | System must<br>support secure role-based<br>access. | Role-based access<br>(College Admin, Club,<br>Student)- Secure login &password recovery | Protects data and ensures proper<br>access control. |
| BR6 | Data &<br>Reporting | Platform must provide<br>essential event metrics. | Registration tracking-<br>Capacity monitoring-<br>Basic report export | Enables data-<br>driven decision<br>making. |
| BR7 | Payment<br>Processing | Platform must support online payments for<br>paid events. | Free/Paid event option-Secure payment gateway integration-Transaction tracking | Eliminates<br>manual payment handling and<br>enables<br>monetization. |


<!-- Business Requirements Document -->

<!-- 7 -->

<!-- v0.2 -->

<!-- [Project Name] -->

# 5 Current Process

## 5.1.1 Current Process Description

Currently, event management at MITAOE is decentralized and relies on manual coordination across fragmented platforms. The process typically follows these steps:

1. **Planning:** Club coordinators plan events offline or via internal WhatsApp groups.

2. **Promotion:** Marketing is done via fragmented WhatsApp status updates and unofficial posters, leading to poor discoverability.

3. **Registration**: Students fill out disparate Google Forms; there is no single place to see all live events.

4. **Payment**: If an event is paid, coordinators manually verify screenshots of UPI transactions or collect cash.

5. **Tracking:** Data is manually moved from Google Forms to Excel Spreadsheets for attendance and record-keeping.

6. **Reporting**: No centralized reporting exists; college admins have no real-time visibility into club performance or student engagement.

## 5.1.2 Problem Statement

The absence of a unified digital infrastructure for MITAOE's 15-20 clubs has resulted in an inefficient "siloed"' environment. Key issues include:

**·Discovery** **Deficit**: Students frequently miss events because there is no central "source of truth" to browse upcoming activities.

**·Data** **Integrity** **Risks**: Manual tracking in spreadsheets leads to duplicate entries, lost payment records, and inconsistent data.

**·Operational Overload**: Club coordinators spend more time on administrative data entry and payment verification than on event quality.

**·Lack** **of** **Oversight:** MITAOE Administration cannot monitor college-wide event trends, participation rates, or financial transparency.

<!-- Business Requirements Document -->

<!-- 8 -->

<!-- v0.2 -->

<!-- [Project Name] -->

# 6 Proposed Process

The implementation of Unbound transforms the current fragmented workflow into a streamlined, automated, and centralized ecosystem. By integrating registration, payment, and management into a single platform, we eliminate manual data entry and provide a unified experience for all stakeholders.

## 6.1.1 Proposed Process Description

The new process centralizes all activities within the Unbound web platform, following these optimized steps:

1. **Centralized** **Planning**: Club coordinators create events directly on the Unbound portal,selecting categories and setting capacities.

2. **Unified** **Discovery**: Students visit the single "Live Events" dashboard to browse, search, and filter all upcoming activities across all 15-20 clubs.

3. **One-Click** **Registration**: Students register with a single click using their saved profiles, eliminating repetitive data entry.

4. **Automated** **Payment**: For paid events, the integrated Razorpay gateway hhandles transactions securely, instantly updating the registration status.

5. **Real-Time** **Analytics:** Attendance lists and financial reports are generated automatically. Both Club Coordinators and MITAOE Admins can view performance metrics instantly.

**6.Institutional Oversight:** The college administration monitors all club activity from a high-level dashboard to ensure quality and compliance.

**6.1.2 Key Improvements**


| Feature | Current Process (Manual) | Proposed Process (Unbound) |
| --- | --- | --- |
| Event Visibility | Scattered<br>(WhatsApp/Posters) | Centralized (Unified Web Portal) |
| Registration | Google Forms (Manual<br>Entry) | One-Click (Profile-based) |
| Payment | Manual UPI<br>Screenshots/Cash | Automated (Razorpay<br>Integration) |
| Data<br>Management | Manual Spreadsheets | Live Database (Real-time<br>tracking) |
| Admin<br>Oversight | None (Siloed Clubs) | Global Dashboard (Full<br>Visibility) |


<!-- Business Requirements Document -->

<!-- 9 -->

<!-- v0.2 -->

<!-- [Project Name] -->

## 6.1.3 Process Impact Analysis

**·Reduced** **Friction**: By removing the need for manual payment verification and multiple form-fills, the "time-to-register" is reduced by over 80%.

**·Data** **Integrity:** A single database ensures no duplicate entries and accurate financial reconciliation.

**·Increased** **Participation**: Improved discoverability ensures that events reach their target audience effectively, maximizing student engagement.

**·Standardization**: All clubs follow a professional, uniform process, enhancing the institutional brand of MITAOE.

## 6.1.4 Key Stakeholders


| Stakeholder | Role / Interest | Key Responsibilities | Involvemen<br>t Level |
| --- | --- | --- | --- |
| MITAOE<br>Admin | Platform<br>Governance &<br>Oversight | Approving club profiles,<br>monitoring college-wide analytics, and ensuring event quality<br>standards. | High |
| Club<br>Coordinators | Event<br>Operations &<br>Execution | Creating/managing events,<br>tracking registrations, and<br>managing club-specific<br>dashboards. | High |
| MITAOE<br>Students | End Users &<br>Participants | Browsing events, performing one-click registrations, and completing secure payments. | High |
| Development Team | Technical<br>Delivery | System architecture,<br>frontend/backend development,<br>and API integration (Razorpay). | High |
| QA / Testing<br>Team | Quality<br>Assurance | Conducting UAT (User<br>Acceptance Testing),bug<br>tracking, and performance<br>validation. | Medium |
| Financel<br>Accounts<br>Office | Financial Audit | Overseeing automated payout<br>reconciliations from the Razorpay gateway. | Low |


<!-- Business Requirements Document -->

<!-- 10 -->

<!-- v0.2 -->

<!-- [Project Name] -->

# 7Constraints & Assumptions

This section outlines the underlying factors that must remain true for the project to succeed, as well as the boundaries that limit the development of the **Unbound** platform.

## 7.1.1 Project Constraints

The following limitations define the boundaries of the **Unbound MVP**:


| Category | Constraint Details |
| --- | --- |
| Scope | Development is strictly limited to MITAOE (Single-college architecture). No marketing or user acquisition activities are included. |
| Technical | No native mobile apps (iOS/Android) for Version 1.0; accessible via web browsers only. Payment integration is limited to Razorpay. |
| Resource | Project must be delivered by a 5-member team with no additional<br>budget for external sales or marketing resources. |
| Time | 30-day (1 month) hard deadline for MVP launch, requiring parallel<br>development and a "feature-freeze" on non-essential items. |
| Regulatory | Must comply with institutional data privacy policies and ensure secure<br>storage of student personally identifiable information (PII). |


## 7.1.2 Project Assumptions

The project team proceeds based on the following assumptions:

**·Infrastructure:** MITAOE students and staff have consistent internet access via mobile or desktop devices.

**·Institutional Support**: MITAOE administration fully supports the transition from manual to digital event management.

**·Participation:** At least 15-20 active college clubs will adopt the platform as their primary management tool.

**·Resource** **Availability**: Club coordinators can allocate time for initial training and data migration.

**·User** **Preference**: Students prefer a streamlined digital registration process over manual forms and WhatsApp coordination.

**·Technical Literacy:** All primary stakeholders (Admins/Coordinators) possess the basic digital skills required to navigate a web portal.

<!-- Business Requirements Document -->

<!-- 11 -->

<!-- v0.2 -->

<!-- [Project Name] -->

# 8 Success Criteria & KPIs (Key Performance Indicators)

The success of the **Unbound** platform will be measured by its ability to meet specific operational, engagement, and technical benchmarks during the first academic semester.

## 8.1.1 Operational Metrics

**·Launch** **Readiness**: 100% deployment of the web platform within the **1-month** project window.

**·Registration** **Volume**: Facilitate **2,000+** total event registrations across all college activities in the first semester.

**·Content Volume:** Onboard at least **100 individual events** created by the participating clubs.

## 8.1.2 Engagement & Adoption Metrics

**·Student Satisfaction**: Achieve a satisfaction score of ≥ 85% based on post-registration user surveys.

**·Participation** **Growth**: Target a **30%** **increase** in overall student event attendance due to improved discoverability.

**·Club** **Adoption** **Rate**: Ensure **70%** **or** **more** of active MITAOE clubs move their registration process exclusively to Unbound.

## 8.1.3 System Performance Metrics

**·Platform** **Reliability**: Maintain a system uptime of 99% throughout the academic year.

**·User** **Experience:** Average page load time must remain **under** 3 **seconds** to ensure low bounce rates.

**·Funnel Efficiency**: Achieve a registration completion rate $of>90\%$ (from clicking "Register" to confirmation).

<!-- Business Requirements Document -->

<!-- 12 -->

<!-- v0.2 -->

<!-- [Project Name] -->

# 9 Risks & Mitigation Strategies

This section identifies potential threats to the project's success and provides a proactive plan to manage or eliminate them.


| Risk | Impact | Probability | Mitigation Strategy |
| --- | --- | --- | --- |
| Aggressive<br>Timeline | High | High | Use Agile methodology with daily<br>standups and parallel<br>frontend/backend development. |
| Payment<br>Gateway<br>Delays | High | Medium | Start Razorpay integration in Week 1;use sandbox environments for testing<br>early. |
| Low Club<br>Adoption | High | Medium | Host a mandatory training session<br>for club coordinators and provide a<br>"Quick-Start" guide. |
| Technical<br>Bottlenecks | High | High | Focus strictly on MVP features; defer secondary requests to Version 2.0. |
| Security<br>Breach | High | Low | Implement JWT authentication,<br>conduct vulnerability audits, and use<br>SSL encryption. |
| Scope Creep | High | High | Implement a strict Change Request<br>(CR) process; any new features are<br>added to the backlog for post-launch. |
| Team<br>Unavailability | Medium | Medium | Maintain thorough documentation<br>and cross-train developers to handle<br>both frontend and backend tasks. |


<!-- Business Requirements Document -->

<!-- 13 -->

<!-- v0.2 -->

<!-- [Project Name] -->

**10 Glossary**


| Term | Explanation |
| --- | --- |
| MITAOE | MIT Academy of Engineering, the specific educational institution for which this platform is developed. |
| MVP | Minimum Viable Product: A version of a product with just enough<br>features to be usable by early customers who can then provide feedback for future product development. |
| Siloed<br>Environment | A situation where different groups (clubs) work independently and do not share information, leading to fragmentation. |
| Razorpay | The third-party payment gateway service used to process online<br>transactions for paid events securely. |
| RBAC | Role-Based Access Control: A method of restricting system access to<br>authorized users (Admin, Club, or Student) based on their specific role. |
| UAT | User Acceptance Testing: The final phase of the software testing<br>process where actual users (students/coordinators) test the system to<br>ensure it handles required tasks in real-world scenarios. |
| Fest | A large-scale college festival consisting of multiple technical, cultural,or<br>sports events grouped under a single umbrella. |
| SaaS | Software as a Service: A software distribution model where a provider<br>hosts applications; noted as "Out of Scope" as Unbound is currently a<br>dedicated instance for MITAOE. |
| API | Application Programming Interface: A set of rules that allows the<br>Unbound platform to communicate with external services like Razorpay. |
| Discoverability | The ease with which a student can find and learn about upcoming events within the platform. |


<!-- Business Requirements Document -->

<!-- 14 -->

<!-- v0.2 -->

<!-- [Project Name] -->

**11 References**


| Name | Link |
| --- | --- |
| MITAOE Official Website | https://mitaoe.ac.in/ |
| Razorpay Standard Integration Docs | https://razorpay.com/docs/payments/<br>payment-gateway/web-integration/standard/ |
| Unbound Project GitHub Repository | https://github.com/PratikPBhosale/Unbound |
| Hack2Skill | https://hack2skill.com/ |
| Unstop | https://unstop.com/ |


<!-- Business Requirements Document -->

<!-- 15 -->

<!-- v0.2 -->

<!-- [Project Name] -->

# 12 Appendix

## 12.1.1.1 Appendix A: User Stories

These stories define the functional requirements **from** **the** **perspective** **of** **the** **end user** **to** guide the development and testing phases.


| User Role | Requirement (The "What") | Goal (The "Why") |
| --- | --- | --- |
| Student | I want to filter events by<br>category (Technical,<br>Cultural, etc.). | So that I can quickly find events that<br>align with my specific interests. |
| Student | I want to view my<br>registration history in a<br>personal dashboard. | So that I can keep track of upcoming<br>event dates and venues in one place. |
| Club<br>Coordinator | I want to export registration<br>data to a CSV/Excel file. | So that I can manage attendance and<br>logistics on the day of the event. |
| Club<br>Coordinator | I want to set a "Registration<br>Capacity" for my workshops. | So that I can prevent overbooking and<br>ensure the quality of the session. |
| MITAOE<br>Admin | I want to approve or reject a new Club's profile request. | So that I can ensure only authorized<br>student bodies are hosting events on<br>the platform. |


## 12.1.1.2 Appendix B: Business Driver Analysis

A comparison of the impact of the **Unbound** platform against the current manual methods used at MITAOE.

**·Automation** **Driver:** Transitioning from manual UPI verification to Razorpay integration reduces the financial reconciliation cycle from **2** **days** **to** **real-time.**

**·Centralization** **Driver**: Moving from 20+ fragmented WhatsApp groups to 1 unified portal increases event visibility by an estimated **300%** across the student body.

**·Data** **Accuracy** **Driver**: Eliminating Google Forms reduces the risk of duplicate data and "ghost registrations" by **90%.**

<!-- Business Requirements Document -->

<!-- 16 -->

<!-- v0.2 -->

