# Unbound Platform - Backend API

A comprehensive fest and event management system for colleges and students, built with Spring Boot.

## 🚀 **Features**

### **Core Functionality**
- **User Management**: Student, College, and Admin roles with JWT authentication
- **Fest Management**: Create, manage, and approve fests with detailed information
- **Event Management**: Events can be standalone (not under any fest) or linked to a fest. The API returns both types distinctly for clarity.
- **Payment Integration**: Razorpay payment gateway for secure transactions with direct college routing, orderId/paymentId/refund support
- **Beautiful HTML Email Templates**: Professional email notifications with modern design and responsive layout (all notifications)
- **Certificate Generation**: PDF certificates for event participation
- **File Management**: Secure image upload and storage system
- **Team Management**: Support for team-based event registrations, including unregistered members and team size constraints

### **Advanced Features**
- **Admin Approval System**: Content moderation for fests and events
- **College Dashboard**: Analytics, earnings, and student management
- **Student Dashboard**: Event exploration, registration, payment tracking, and team visibility
- **Review System**: Student ratings and reviews for events
- **Search & Filtering**: Advanced event discovery with multiple filters
- **Audit Logging**: Comprehensive action tracking for security
- **Health Monitoring**: System health checks and performance metrics
- **Public Access**: Non-authenticated users can explore fests and events
- **College Payment Configuration**: Colleges can set up their payment receiving details

### **Enhanced Email System** ✨ **NEW**
- **HTML Email Templates**: Beautiful, responsive email templates with modern CSS for all notifications (registration, payment, refund, password reset, college payment alert)
- **Thymeleaf Integration**: Dynamic template rendering with data binding
- **Professional Design**: Gradient headers, organized sections, color-coded status badges
- **Mobile Responsive**: Optimized for all email clients and devices
- **Email Types**:
  - 🎉 **Registration Receipts**: Complete event details with payment information
  - 🔐 **Password Reset**: Secure password reset with clear instructions
  - ✅ **Payment Success**: Transaction details with event information
  - ❌ **Payment Failure**: Error details with troubleshooting steps
  - 💰 **Refund Notifications**: Refund process timeline and details
  - 💳 **College Payment Alerts**: Payment notifications for colleges

### **Payment System**
- **Direct College Routing**: Payments go directly to college's bank account
- **College Payment Setup**: Colleges configure Razorpay account and bank details
- **Automatic Payment Routing**: System automatically routes payments to correct college
- **Beautiful Payment Notifications**: Both student and college receive professional HTML email confirmations
- **Payment Analytics**: Detailed payment tracking and analytics for colleges
- **Refunds**: Colleges can process refunds and notify students

### **Public Access Features**
- **Fest Exploration**: Browse approved fests with filtering by name, college, location, mode
- **Event Discovery**: Search events with comprehensive filters (category, fee range, team participation)
- **Statistics**: View platform statistics without authentication
- **Image Access**: View uploaded fest and event images publicly
- **Enhanced Experience**: Login for additional features like registration and personalization

### **Technical Features**
- **RESTful API**: Well-structured REST endpoints
- **JWT Authentication**: Secure stateless authentication
- **Data Validation**: Comprehensive input validation
- **Error Handling**: Detailed error responses and logging
- **File Upload**: Secure image upload with validation
- **Database Optimization**: Efficient queries and indexing
- **API Documentation**: Swagger/OpenAPI documentation
- **CORS Support**: Cross-origin resource sharing
- **Health Checks**: System monitoring and diagnostics
- **Thymeleaf/HTML Email**: All email notifications use HTML/CSS templates rendered with Thymeleaf

## 🏗️ **Architecture**

### **Layered Architecture**
```
┌─────────────────┐
│   Controllers   │ ← REST API endpoints
├─────────────────┤
│    Services     │ ← Business logic
├─────────────────┤
│  Repositories   │ ← Data access
├─────────────────┤
│    Entities     │ ← Data models
└─────────────────┘
```

### **Key Components**
- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and external integrations
- **Repositories**: Data access layer with Spring Data JPA
- **Entities**: JPA entities for database mapping
- **DTOs**: Data transfer objects for API requests/responses (see below for new/updated DTOs)
- **Config**: Security, CORS, and application configuration
- **Mail Templates**: HTML email templates with Thymeleaf integration

## 📧 **Email Template System**

### **HTML Email Templates**
The platform now features beautiful, professional HTML email templates for all notifications:
- **Modern Design**: Gradient headers, organized sections, and professional styling
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Color-coded Status**: Different colors for different types of information
- **Interactive Elements**: Buttons and links with hover effects
- **Professional Branding**: Consistent Unbound Platform branding throughout
- **Thymeleaf Integration**: Dynamic template rendering with data binding
- **Context Variables**: All necessary data passed to templates
- **HTML/CSS**: Modern, responsive design with inline CSS for email compatibility
- **UTF-8 Support**: Full Unicode support for international characters
- **Email Client Compatibility**: Optimized for major email clients
- **Templates Location**: `src/main/resources/templates/email/`

#### **Available Templates**
1. **Registration Receipt** (`registration-receipt.html`)
2. **Password Reset** (`forgot-password.html`)
3. **Payment Success** (`payment-success.html`)
4. **Payment Failure** (`payment-failure.html`)
5. **Refund Notification** (`refund-notification.html`)
6. **College Payment Alert** (`college-payment-notification.html`)

## 🔐 **Authentication System**

### **User Registration & Login**
All user types (Student, College, Admin) use the same authentication endpoints:

#### **Registration Endpoint**
```bash
POST /api/auth/register
```

#### **Login Endpoint**
```bash
POST /api/auth/login
```

## 📋 **API Endpoints & Flows**

### **Public Access (No Authentication Required)**
- `GET /api/explore/fests` - Explore fests with filtering options
- `GET /api/explore/events` - Explore events with comprehensive filtering
- `GET /api/explore/stats` - Get public statistics about platform usage
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

### **College Management**
- `POST /api/college/payment-config` - Configure college payment settings
- `GET /api/college/payment-config` - Get college payment settings

### **Fest Management**
- `GET /api/fests` - List fests (college view)
- `POST /api/fests` - Create fest
- `PUT /api/fests/{fid}` - Update fest
- `DELETE /api/fests/{fid}` - Delete fest
- `POST /api/fests/{fid}/image` - Upload fest image
- `GET /api/fests/{fid}/events` - Get fest events (returns both fest-linked and standalone events for the college in separate lists)

### **Event Management**
- `GET /api/events` - List events (college view)
- `POST /api/events` - Create event (with min/max team size)
- `PUT /api/events/{eid}` - Update event
- `DELETE /api/events/{eid}` - Delete event
- `POST /api/events/{eid}/poster` - Upload event poster
- `DELETE /api/events/{eid}/poster` - Delete poster
- `GET /api/events/{eid}/poster/audit-logs` - Poster audit logs
- `GET /api/events/{eid}/registrations` - Get event registrations (with team details)

### **Student Operations**
- `POST /api/student/events/register` - Register for event (solo or team, with unregistered members)
- `GET /api/student/events/my` - My registrations
- `GET /api/student/events/dashboard/stats` - Student dashboard stats
- `GET /api/student/events/my/teams` - Get my teams (registered and unregistered members)
- `GET /api/student/events/{eventId}/certificate` - Download certificate

### **Team Management**
- `GET /api/student/teams/event/{eventId}` - View teams for event
- `GET /api/student/teams/my` - My teams
- `GET /api/student/teams/{teamId}/members` - View team members (registered/unregistered)
- `DELETE /api/student/teams/{teamId}/leave` - Leave team

### **College Dashboard**
- `GET /api/college/dashboard/earnings` - Earnings analytics
- `GET /api/college/dashboard/registrations` - Registration analytics
- `GET /api/college/dashboard/analytics/by-fest` - Analytics by fest
- `GET /api/college/dashboard/analytics/by-date` - Analytics by date
- `GET /api/college/dashboard/analytics/top-events` - Top events
- `GET /api/college/dashboard/events/{eventId}/registrations` - Event registrations (with payment status and team details)
- `POST /api/college/dashboard/events/{eventId}/registrations/{registrationId}/approve-certificate` - Approve certificate
- `POST /api/college/dashboard/events/{eventId}/registrations/approve-all-certificates` - Approve all certificates
- `POST /api/college/dashboard/events/{eventId}/registrations/approve-certificates` - Approve certificate list

### **Admin Management**
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

## 📊 **DTOs (Data Transfer Objects)**
- **EventRequest**: includes minTeamSize, maxTeamSize, teamIsAllowed
- **EventRegistrationRequest**: supports team registration with both registered and unregistered members
- **TeamMemberRequest**: details for each team member (registered/unregistered)
- **TeamResponse**: includes lists of registered and unregistered members
- **PaymentRequest/PaymentResponse/PaymentVerificationRequest**: for payment order creation, status update, and analytics

## 💡 **Usage Examples**

### **Team Registration with Unregistered Members**
- Students can register for team events and add friends who are not yet registered on the platform. The team leader provides details for each member (name, email, phone, college, branch, year). Both registered and unregistered members are tracked and visible in dashboards.

### **Payment Flow**
- Students register for events, create payment orders (orderId/paymentId), and receive HTML email receipts. Refunds and analytics are supported for colleges.

### **Email Notification Example**
- All notifications (registration, payment, refund, password reset, college payment alert) use beautiful HTML/CSS templates for a professional experience.

## 📚 **API Documentation**
- **Swagger UI**: Available at `http://localhost:8081/swagger-ui/index.html`
- **OpenAPI Specification**: Available at `http://localhost:8081/v3/api-docs`
- **Interactive Testing**: Test all endpoints directly from the Swagger UI
- **Authentication**: JWT Bearer token authentication supported
- **Request/Response Examples**: Detailed examples for all endpoints
- **Enhanced Documentation**: Updated with HTML email template information

## 🔧 **Setup & Configuration**

### **Prerequisites**
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Thymeleaf (for HTML/CSS email templates)

### **Environment Setup**
1. **Clone Repository**
2. **Configure Database**
3. **Update application.properties** (including email and Razorpay settings)
4. **Build and Run**

### **Access Points**
- **Application**: http://localhost:8081
- **Swagger UI**: http://localhost:8081/swagger-ui/index.html
- **Health Check**: http://localhost:8081/api/health

## 🔒 **Security Features**
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different permissions for different user types
- **Input Validation**: Comprehensive validation on all inputs
- **Payment Security**: Secure payment processing through Razorpay
- **File Upload Security**: Validated and secure file uploads
- **CORS Configuration**: Secure cross-origin requests

## 📞 **Support**
For technical support or questions about the payment system, please contact the development team.

---

**The Unbound Platform provides a complete solution for fest and event management with secure payment processing, comprehensive analytics, beautiful HTML email templates, and user-friendly interfaces.**