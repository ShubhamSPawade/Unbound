# Unbound Platform: Database Schema

---

## Entity Relationship Overview

- User (Student or College)
- Student (linked to User, belongs to College)
- College (linked to User)
- Fest (belongs to College)
- Event (belongs to College, optionally to Fest)
- EventRegistration (links Student, Event, optionally Team)
- Team (belongs to Event, has creator Student)
- TeamMembers (links Team and Student)
- UnregisteredTeamMember (team members not registered on platform)
- Payment (for EventRegistration, with enhanced fields)
- EventReview (links Student and Event)

---

## Entities

### User
| Field      | Type      | Description                |
|------------|-----------|----------------------------|
| uid        | Integer   | Primary key                |
| email      | String    | Unique, login email        |
| password   | String    | Hashed password            |
| role       | Enum      | Student or College         |
| createdAt  | Timestamp | Account creation time      |

### Student
| Field   | Type    | Description                |
|---------|---------|----------------------------|
| sid     | Integer | Primary key                |
| user    | User    | One-to-one, FK to User     |
| college | College | Many-to-one, FK to College |
| sname   | String  | Student name               |

### College
| Field                | Type    | Description                    |
|----------------------|---------|--------------------------------|
| cid                  | Integer | Primary key                    |
| user                 | User    | One-to-one, FK to User         |
| cname                | String  | College name                   |
| cdescription         | String  | Description                    |
| address              | String  | Address                        |
| contactEmail         | String  | Contact email                  |
| razorpayAccountId    | String  | Razorpay account ID for payments |
| bankAccountNumber    | String  | Bank account number            |
| bankIfscCode         | String  | Bank IFSC code                 |
| bankAccountHolderName| String  | Bank account holder name       |

### Fest
| Field        | Type    | Description                |
|--------------|---------|----------------------------|
| fid          | Integer | Primary key                |
| college      | College | Many-to-one, FK to College |
| fname        | String  | Fest name                  |
| fdescription | String  | Description                |
| startDate    | String  | Start date (YYYY-MM-DD)    |
| endDate      | String  | End date (YYYY-MM-DD)      |

### Event
| Field              | Type    | Description                        |
|--------------------|---------|------------------------------------|
| eid                | Integer | Primary key                        |
| college            | College | Many-to-one, FK to College         |
| fest               | Fest    | Many-to-one, FK to Fest (nullable) |
| ename              | String  | Event name                         |
| edescription       | String  | Description                        |
| eventDate          | String  | Date (YYYY-MM-DD)                  |
| fees               | Integer | Entry fee (0 = free)               |
| location           | String  | Location                           |
| capacity           | Integer | Max registrations                  |
| teamIsAllowed      | Boolean | Team registration allowed          |
| minTeamSize        | Integer | Minimum team size when team registration is allowed |
| maxTeamSize        | Integer | Maximum team size when team registration is allowed |
| category           | String  | Category (e.g., Technical)         |
| mode               | String  | Online/Offline                     |
| posterUrl          | String  | Poster image URL                   |
| posterThumbnailUrl | String  | Poster thumbnail URL               |
| approved           | Boolean | Event approved by admin            |
| (registrations)    | -       | Registration count fetched via EventRegistrationRepository |

### EventRegistration
| Field              | Type    | Description                        |
|--------------------|---------|------------------------------------|
| rid                | Integer | Primary key                        |
| event              | Event   | Many-to-one, FK to Event           |
| student            | Student | Many-to-one, FK to Student         |
| team               | Team    | Many-to-one, FK to Team (nullable) |
| erdateTime         | String  | Registration datetime              |
| status             | String  | Registration status                |
| paymentStatus      | String  | Payment status                     |
| certificateApproved| Boolean | Certificate approved               |

### Team
| Field   | Type    | Description                |
|---------|---------|----------------------------|
| tid     | Integer | Primary key                |
| event   | Event   | Many-to-one, FK to Event   |
| tname   | String  | Team name                  |
| creator | Student | Many-to-one, FK to Student |
| (members) | -     | Members are both registered (TeamMembers) and unregistered (UnregisteredTeamMember) |

### TeamMembers
| Field   | Type    | Description                |
|---------|---------|----------------------------|
| team    | Team    | Many-to-one, FK to Team    |
| student | Student | Many-to-one, FK to Student |

### UnregisteredTeamMember
| Field   | Type    | Description                |
|---------|---------|----------------------------|
| id      | Long    | Primary key (auto-generated)|
| team    | Team    | Many-to-one, FK to Team    |
| name    | String  | Member name                |
| email   | String  | Member email               |
| phone   | String  | Member phone number        |
| college | String  | Member's college name      |
| branch  | String  | Member's branch/stream     |
| year    | Integer | Member's year of study     |
| addedBy | String  | Email of team leader who added |

### Payment
| Field              | Type              | Description                        |
|--------------------|-------------------|------------------------------------|
| pid                | Integer           | Primary key                        |
| eventRegistration  | EventRegistration | Many-to-one, FK to EventRegistration|
| college            | College           | Many-to-one, FK to College (receives payment) |
| razorpayOrderId    | String            | Razorpay order ID                  |
| paymentId          | String            | Razorpay payment ID                |
| status             | String            | Payment status (pending, paid, failed, cancelled, refunded, partially_refunded) |
| amount             | Integer           | Amount paid                        |
| currency           | String            | Currency (e.g., INR)               |
| createdAt          | LocalDateTime     | Payment creation datetime          |
| updatedAt          | LocalDateTime     | Payment update datetime            |
| receiptEmail       | String            | Email for receipt                  |
| description        | String            | Optional payment description       |
| errorCode          | String            | Error code for failed payments     |
| errorDescription   | String            | Error description for failed payments |
| signature          | String            | Payment verification signature     |
| refundedAt         | LocalDateTime     | When payment was refunded          |
| refundAmount       | Integer           | Amount refunded                    |
| refundReason       | String            | Reason for refund                  |

### EventReview
| Field      | Type    | Description                |
|------------|---------|----------------------------|
| id         | Integer | Primary key                |
| event      | Event   | Many-to-one, FK to Event   |
| student    | Student | Many-to-one, FK to Student |
| rating     | Integer | 1-5 rating                 |
| reviewText | String  | Review text                |
| createdAt  | String  | Review creation datetime   |

---

## Relationships Diagram (Textual)

- User 1---1 Student
- User 1---1 College
- College 1---* Fest
- College 1---* Event
- Fest 1---* Event
- Event 1---* EventRegistration
- Student 1---* EventRegistration
- Event 1---* Team
- Team 1---* TeamMembers (registered members)
- Team 1---* UnregisteredTeamMember (unregistered members)
- Student 1---* TeamMembers
- Team 1---* UnregisteredTeamMember
- EventRegistration 1---1 Payment
- Event 1---* EventReview
- Student 1---* EventReview

---

## Email System (HTML/CSS Templates)

- All email notifications (registration receipt, payment success/failure, refund, forgot password, college payment notification) use beautiful HTML/CSS templates rendered with Thymeleaf.
- Templates are located in `src/main/resources/templates/email/` and are dynamically populated with relevant data.

---

## DTOs (Data Transfer Objects)

- **EventRequest**: includes minTeamSize, maxTeamSize, teamIsAllowed
- **EventRegistrationRequest**: supports team registration with both registered and unregistered members
- **TeamMemberRequest**: details for each team member (registered/unregistered)
- **TeamResponse**: includes lists of registered and unregistered members
- **PaymentRequest/PaymentResponse/PaymentVerificationRequest**: for payment order creation, status update, and analytics

For a visual ERD, use the above relationships in a diagramming tool. 