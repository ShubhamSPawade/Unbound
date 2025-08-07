# Unbound Platform - Complete Project Documentation

## 🎯 **PROJECT OVERVIEW**

**Unbound Platform** is a comprehensive fest and event management system built with Spring Boot. It serves as a bridge between colleges (who host fests/events) and students (who participate in them), with admin oversight for content moderation.

### **Core Concept**
- **Colleges** can host fests and events, manage registrations, view analytics, approve certificates, send emails, and configure payment settings
- **Students** can explore events, register (solo or with teams—including unregistered members), make payments, give reviews, download certificates, and filter content
- **Admins** can approve/reject fests and events, monitor platform activity, and manage colleges
- **Public Users** can explore fests and events without authentication

---

## 🏗️ **SYSTEM ARCHITECTURE**

### **Technology Stack**
- **Backend**: Spring Boot 3.x with Java 17
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Razorpay integration
- **Email**: Spring Mail with Gmail SMTP and Thymeleaf HTML/CSS templates
- **File Storage**: Local file system with organized directories
- **Documentation**: Swagger/OpenAPI 3.0
- **PDF Generation**: OpenPDF for certificates
- **Build Tool**: Maven

### **Layered Architecture**
```
┌─────────────────┐
│   Controllers   │ ← REST API endpoints with Swagger docs
├─────────────────┤
│    Services     │ ← Business logic and external integrations
├─────────────────┤
│  Repositories   │ ← Data access layer (Spring Data JPA)
├─────────────────┤
│    Entities     │ ← JPA entities for database mapping
└─────────────────┘
```

### **Key Components**
- **Controllers**: Handle HTTP requests/responses with proper validation
- **Services**: Business logic, external integrations (email, payments, file storage)
- **Repositories**: Data access with Spring Data JPA
- **Entities**: JPA entities with Lombok for boilerplate reduction
- **DTOs**: Request/response objects with validation (see below for new/updated DTOs)
- **Config**: Security, CORS, Swagger, and application configuration
- **Mail Templates**: HTML/CSS email templates with Thymeleaf integration

---

## 👥 **USER ROLES & PERMISSIONS**

### **1. Student Role**
**Permissions:**
- Explore fests and events (public access)
- Register for events with payment (solo or with teams, including unregistered members)
- Create/join teams for team events
- Give reviews and ratings
- Download participation certificates
- View personal dashboard with registrations and teams
- Receive email notifications and receipts (HTML/CSS)

**Key Features:**
- Event registration with validation (deadlines, capacity, team requirements)
- Team registration supports both registered and unregistered members
- Payment integration with Razorpay (orderId, paymentId, status, refunds)
- Team management for team-based events
- Certificate generation and download
- Email receipts and notifications with beautiful HTML/CSS templates

### **2. College Role**
**Permissions:**
- Create and manage fests
- Create and manage events within fests (specify team size constraints)
- Upload fest and event images
- View registration analytics and earnings
- Approve certificates for participants
- Send emails to participants (HTML/CSS)
- View detailed student enrollment lists
- Configure payment settings (Razorpay, bank details)

**Key Features:**
- Comprehensive dashboard with earnings, registrations, analytics
- Event management with detailed information (prizes, rules, requirements, team size)
- Image upload for fests and events
- Certificate approval workflow
- Email management for participants (HTML/CSS)
- Payment analytics and refund processing

### **3. Admin Role**
**Permissions:**
- Approve/reject fests and events
- View platform statistics
- Manage all colleges
- Monitor system health
- Access admin dashboard

**Key Features:**
- Content moderation for fests and events
- Platform-wide analytics and statistics
- College management and oversight
- System monitoring and health checks

### **4. Public Users (No Authentication)**
**Permissions:**
- Explore approved fests and events
- View platform statistics
- Access uploaded images
- Use comprehensive filtering options

---

## 🔐 **AUTHENTICATION SYSTEM**

### **User Registration & Login**
All user types (Student, College, Admin) use the same authentication endpoints:

#### **Registration Endpoint**
```bash
POST /api/auth/register
```

**Student Registration:**
```json
{
  "email": "student@example.com",
  "password": "password123",
  "role": "Student",
  "sname": "Student Name",
  "collegeId": 1
}
```

**College Registration:**
```json
{
  "email": "college@example.com",
  "password": "password123",
  "role": "College",
  "cname": "College Name",
  "cdescription": "College Description",
  "address": "College Address",
  "contactEmail": "contact@college.com"
}
```

**Admin Registration:**
```json
{
  "email": "admin@unbound.com",
  "password": "admin123",
  "role": "Admin"
}
```

#### **Login Endpoint**
```bash
POST /api/auth/login
```

**Login Request (All Roles):**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "token": "jwt_token_here",
  "role": "Student|College|Admin",
  "email": "user@example.com",
  "sname": "Student Name", // for students
  "cname": "College Name"  // for colleges
}
```

### **JWT Authentication**
- **Token Format**: `Authorization: Bearer {token}`
- **Token Expiration**: 24 hours
- **Role-based Access**: Different permissions for each role
- **Stateless**: No server-side session storage

### **Debugging Authentication**
Use the test endpoint to check existing users:
```bash
GET /api/users
```
This endpoint returns all registered users to help debug registration issues.

---

## 📋 **COMPLETE FEATURE LIST**

### **🔐 Authentication & Security**
- JWT-based stateless authentication
- Role-based access control (Student, College, Admin)
- Password encryption with BCrypt
- Password reset functionality with email tokens
- Token expiration (24 hours)
- CORS configuration for frontend integration
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### **🎪 Fest Management**
- Create fests with detailed information (name, description, dates, location)
- Upload fest images with validation
- Fest approval workflow (admin approval required)
- Fest statistics and analytics
- Fest-event relationship management: Events can be either linked to a fest or standalone (not under any fest). The API returns both types distinctly.
- Fest filtering and search

### **🎯 Event Management**
- Create events with comprehensive details:
  - Basic info (name, description, date, location)
  - Entry fees and capacity
  - Team participation settings (min/max team size)
  - Prize details (cash prizes, 1st/2nd/3rd prizes)
  - Location details (city, state, country)
  - Contact information (organizer details)
  - Rules and requirements
  - Registration deadlines
  - Event website and contact phone
- Event poster upload and management
- Event approval workflow
- Event statistics and analytics
- Event registration tracking (with team details)

### **💰 Payment Integration**
- Razorpay payment gateway integration with direct college routing
- College payment configuration (Razorpay account, bank details)
- Payment order creation and verification (orderId, paymentId, status)
- Payment status tracking with college routing
- Receipt generation and emailing to both student and college (HTML/CSS)
- Payment analytics for colleges with detailed tracking
- Refund processing and notifications
- Automatic payment routing to college's bank account
- College payment setup and management
- **Payment Debugging**: Get all registrations to find valid registration IDs
- **Error Handling**: Clear error messages for invalid registration IDs with available options
- **JSON Validation**: Proper handling of invalid JSON requests (e.g., leading zeros in numbers)

### **📧 Email System (HTML/CSS Templates)**
- Registration confirmation emails with detailed receipts (HTML/CSS)
- Payment confirmation emails to both student and college (HTML/CSS)
- Event reminder emails (automated, HTML/CSS)
- Password reset emails (HTML/CSS)
- College notification emails for new payments (HTML/CSS)
- Refund notifications (HTML/CSS)
- Email templates with dynamic content using Thymeleaf
- All templates are located in `src/main/resources/templates/email/`

### **💰 Payment System**
- **Direct College Routing**: Payments go directly to college's bank account
- **College Payment Setup**: Colleges configure Razorpay account and bank details
- **Automatic Payment Routing**: System automatically routes payments to correct college
- **Payment Notifications**: Both student and college receive email confirmations (HTML/CSS)
- **Payment Analytics**: Detailed payment tracking and analytics for colleges
- **Refunds**: Colleges can process refunds and notify students
- **Secure Processing**: All payments processed through Razorpay's secure gateway
- **Payment Configuration**: Colleges can set up and manage their payment receiving details
- **Payment Tracking**: Complete audit trail for all payment transactions
- **Payment Debugging**: Get all registrations to find valid registration IDs for payments
- **Error Handling**: Clear error messages with available registration options
- **JSON Validation**: Proper handling of invalid JSON requests (e.g., leading zeros in numbers)

### **📄 Certificate System**
- PDF certificate generation for event participation
- Certificate approval workflow (college approval)
- Certificate download for students
- Certificate audit logging

### **👥 Team Management**
- Team creation for team-based events
- Team member management (registered and unregistered members)
- Team registration validation (min/max size)
- Team statistics and analytics
- Teams visible on student dashboard
- Colleges can view teams and members for each event

### **⭐ Review System**
- Student ratings and reviews for events
- Review moderation and management
- Review analytics for colleges

### **🔍 Search & Filtering**
- Fest filtering by name, college, location, mode, date range
- Event filtering by name, category, fee range, team participation, location
- Advanced search with multiple parameters
- Sorting options (date, popularity, fee)
- Public access for exploration

### **📊 Analytics & Dashboard**
- **College Dashboard:**
  - Total earnings and revenue analytics
  - Registration statistics (total, paid, unpaid)
  - Analytics by fest and date
  - Top performing events
  - Student enrollment details
  - Certificate approval management
- **Student Dashboard:**
  - Personal registration history
  - Payment status tracking
  - Certificate downloads
  - Event participation statistics
  - Team management and visibility
- **Admin Dashboard:**
  - Platform-wide statistics
  - Content moderation queue
  - College management
  - System health monitoring

### **📁 File Management**
- Secure image upload for fests and events
- File validation (type, size, format)
- Organized directory structure (fests/, events/)
- Automatic file cleanup
- Public access to uploaded images

### **🏥 Health Monitoring**
- Comprehensive health checks with database connectivity
- Memory usage monitoring
- System performance metrics
- Simple ping endpoint for connectivity
- Health status reporting

### **📝 Audit & Logging**
- Comprehensive action logging
- Security event tracking
- Payment event logging
- Registration event tracking
- Error monitoring and reporting

### **📚 API Documentation**
- Swagger/OpenAPI 3.0 documentation
- Interactive API testing interface
- JWT authentication integration
- Request/response examples
- Professional documentation with proper metadata

---

## 🗄️ **DATABASE SCHEMA**

(See `SCHEMA.md` for full details. Key updates: Event now supports minTeamSize/maxTeamSize; UnregisteredTeamMember entity; Payment entity enhanced; team registration supports unregistered members.)

---

## 📊 **API ENDPOINTS REFERENCE**

### **Public Access (No Authentication)**
- `GET /api/explore/fests` - Explore fests with filtering
- `GET /api/explore/events` - Explore events with filtering
- `GET /api/explore/stats` - Platform statistics
- `GET /api/health` - System health check
- `GET /api/health/ping` - Simple connectivity check
- `GET /api/users` - Get all users (for debugging)

### **Authentication**
- `POST /api/auth/register` - User registration (Student/College/Admin)
- `POST /api/auth/login` - User login (Student/College/Admin)
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### **Profile Management**
- `GET /api/college/profile` - Get college profile information
- `PUT /api/college/profile` - Update college profile information
- `GET /api/student/events/profile` - Get student profile information
- `PUT /api/student/events/profile` - Update student profile information

### **Fest Management (College Access)**
- `GET /api/fests` - List college fests
- `POST /api/fests` - Create fest
- `PUT /api/fests/{fid}` - Update fest
- `DELETE /api/fests/{fid}` - Delete fest
- `POST /api/fests/{fid}/image` - Upload fest image
- `GET /api/fests/{fid}/events` - Get fest events (returns both fest-linked and standalone events for the college in separate lists)

### **Event Management (College Access)**
- `GET /api/events` - List college events
- `POST /api/events` - Create event (with min/max team size)
- `PUT /api/events/{eid}` - Update event
- `DELETE /api/events/{eid}` - Delete event
- `POST /api/events/{eid}/poster` - Upload event poster
- `DELETE /api/events/{eid}/poster` - Delete poster
- `GET /api/events/{eid}/poster/audit-logs` - Poster audit logs
- `GET /api/events/{eid}/registrations` - Get event registrations (with team details)

### **Student Operations (Student Access)**
- `POST /api/student/events/register` - Register for event (solo or team, with unregistered members)
- `GET /api/student/events/my` - My registrations
- `GET /api/student/events/dashboard/stats` - Student dashboard stats
- `GET /api/student/events/my/teams` - Get my teams (registered and unregistered members)
- `GET /api/student/events/{eventId}/certificate` - Download certificate

### **Team Management (Student Access)**
- `GET /api/student/teams/event/{eventId}` - View teams for event
- `GET /api/student/teams/my` - My teams
- `GET /api/student/teams/{teamId}/members` - View team members (registered/unregistered)
- `DELETE /api/student/teams/{teamId}/leave` - Leave team

### **College Dashboard (College Access)**
- `GET /api/college/dashboard/earnings` - Earnings analytics
- `GET /api/college/dashboard/registrations` - Registration analytics
- `GET /api/college/dashboard/analytics/by-fest` - Analytics by fest
- `GET /api/college/dashboard/analytics/by-date` - Analytics by date
- `GET /api/college/dashboard/analytics/top-events` - Top events
- `GET /api/college/dashboard/events/{eventId}/registrations` - Event registrations (with payment status and team details)
- `POST /api/college/dashboard/events/{eventId}/registrations/{registrationId}/approve-certificate` - Approve certificate
- `POST /api/college/dashboard/events/{eventId}/registrations/approve-all-certificates` - Approve all certificates
- `POST /api/college/dashboard/events/{eventId}/registrations/approve-certificates` - Approve certificate list

### **College Management (College Access)**
- `POST /api/college/payment-config` - Configure college payment settings
- `GET /api/college/payment-config` - Get college payment settings

### **Admin Management (Admin Access)**
- `GET /api/admin/fests/pending` - Get pending fests
- `GET /api/admin/events/pending` - Get pending events
- `POST /api/admin/fests/{festId}/approve` - Approve fest
- `POST /api/admin/fests/{festId}/reject` - Reject fest
- `POST /api/admin/events/{eventId}/approve` - Approve event
- `POST /api/admin/events/{eventId}/reject` - Reject event
- `GET /api/admin/dashboard/stats` - Admin dashboard stats
- `GET /api/admin/colleges` - Get all colleges

### **Payment & Team Management**
- `GET /api/payments/registrations` - Get all registrations with details (for finding valid registration IDs)
- `POST /api/payments/create-order` - Create payment order for a specific registration (orderId, paymentId)
- `POST /api/payments/verify` - Verify payment (typically called by Razorpay webhook)
- `GET /api/payments/order/{orderId}` - Get payment by order ID
- `GET /api/payments/payment/{paymentId}` - Get payment by payment ID
- `GET /api/payments/college/payments` - Get all payments for the authenticated college
- `GET /api/payments/college/analytics` - Get payment analytics for the authenticated college
- `POST /api/payments/refund/{paymentId}` - Process refund

### **Test & Debug Endpoints**
- `GET /api/protected` - Test protected endpoint
- `GET /api/users` - Get all users (for debugging registration issues)

---

## 🔧 **SETUP INSTRUCTIONS**

### **Prerequisites**
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Git
- **Thymeleaf** (for HTML/CSS email templates)

### **1. Project Setup**
```bash
# Clone repository (if starting from scratch)
git clone <repository-url>
cd unbound-backend

# Or create new Spring Boot project with dependencies
```

### **2. Dependencies (pom.xml)**
(Include Thymeleaf and Spring Mail for HTML email support)

### **3. Application Properties (application.properties)**
(Configure email, Razorpay, and other settings as before)

### **4. Database Setup**
(Tables will be created automatically by Hibernate)

### **5. Project Structure**
(See previous structure; note new/updated mail/templates directory)

### **6. Build and Run**
(As before)

### **7. Access Points**
- **Application**: http://localhost:8081
- **Swagger UI**: http://localhost:8081/swagger-ui/index.html
- **API Docs**: http://localhost:8081/v3/api-docs
- **Health Check**: http://localhost:8081/api/health

---

## 📧 **EMAIL SYSTEM (HTML/CSS TEMPLATES)**
- All email notifications use beautiful, responsive HTML/CSS templates rendered with Thymeleaf.
- Templates are located in `src/main/resources/templates/email/`.
- Email types: registration receipt, payment success/failure, refund, forgot password, college payment notification.
- See codebase for details on how templates are used in the mail system.

---

## DTOs (Data Transfer Objects)
- **EventRequest**: includes minTeamSize, maxTeamSize, teamIsAllowed
- **EventRegistrationRequest**: supports team registration with both registered and unregistered members
- **TeamMemberRequest**: details for each team member (registered/unregistered)
- **TeamResponse**: includes lists of registered and unregistered members
- **PaymentRequest/PaymentResponse/PaymentVerificationRequest**: for payment order creation, status update, and analytics

---

## 🧪 **TESTING STRATEGY**

(As before, but now includes testing for team registration with unregistered members, payment analytics, and HTML/CSS email notifications.)

---

## 🚀 **DEPLOYMENT CONSIDERATIONS**

(As before)

---

## 📈 **PERFORMANCE OPTIMIZATION**

(As before)

---

## 🔧 **MAINTENANCE & UPDATES**

(As before)

---

## 📞 **SUPPORT & CONTACT**

(As before)

---

## 📄 **LICENSE**

(As before)

---

## 🎯 **PROJECT STATUS**

(As before)

---

**This README serves as a complete project prompt and can be used to recreate the entire Unbound Platform from scratch if needed. All implementation details, configurations, and features are documented comprehensively.**