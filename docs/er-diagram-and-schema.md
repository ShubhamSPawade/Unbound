# Unbound Event Management Database

## Overview

The Unbound database is designed to manage college fests, events, student participation, teams, attendance, and certificates.

It follows a relational structure where all entities are connected using primary and foreign keys to maintain data integrity and avoid redundancy.

---

## Entities and Description

### 1. Colleges
Stores information about colleges.

- college_id (PK)
- name
- location
- description
- created_at

A college can have multiple users, clubs, and fests.

---

### 2. Users
Stores all users of the system.

- user_id (PK)
- name
- email
- password
- role (student, club_admin, college_admin, super_admin)
- college_id (FK)
- created_at

Users can register for events, join teams, attend events, and receive certificates.

---

### 3. Clubs
Represents clubs within a college.

- club_id (PK)
- club_name
- description
- college_id (FK)
- created_at

Each club belongs to a college and organizes events.

---

### 4. Fests
Stores details about college festivals.

- fest_id (PK)
- fest_name
- college_id (FK)
- start_date
- end_date
- description

Each fest contains multiple events.

---

### 5. Categories
Classifies events into types.

- category_id (PK)
- category_name

One category can have multiple events.

---

### 6. Events
Central entity storing event details.

- event_id (PK)
- title
- description
- fest_id (FK)
- club_id (FK)
- category_id (FK)
- event_date
- venue
- max_participants
- created_at

Events are organized by clubs, belong to fests, and are categorized.

---

### 7. Registrations
Stores event registrations.

- registration_id (PK)
- user_id (FK)
- event_id (FK)
- registration_date
- status

Represents many-to-many relationship between users and events.

---

### 8. Attendance
Tracks event attendance.

- attendance_id (PK)
- user_id (FK)
- event_id (FK)
- status (present/absent)
- marked_at

---

### 9. Certificates
Stores certificates issued to users.

- certificate_id (PK)
- user_id (FK)
- event_id (FK)
- certificate_url
- issued_at

---

### 10. Teams
Used for team-based events.

- team_id (PK)
- event_id (FK)
- team_name
- created_at

One event can have multiple teams.

---

### 11. Team Members
Maps users to teams.

- id (PK)
- team_id (FK)
- user_id (FK)

Represents many-to-many relationship between users and teams.

---

### 12. Announcements
Stores college-level announcements.

- announcement_id (PK)
- college_id (FK)
- title
- message
- created_at

---

## Relationships

- User belongs to College  
- Club belongs to College  
- Fest is organized by College  
- Announcement is published by College  

- Club organizes Events  
- Event belongs to Fest  
- Event belongs to Category  

- User registers for Event  
- User attends Event  
- User receives Certificate for Event  

- Event has Teams  
- Team has Members (Users)  
- User joins Team  

---

## System Workflow

1. Colleges create and manage fests  
2. Clubs organize events under fests  
3. Events are categorized and scheduled  
4. Students browse and register for events  
5. Attendance is recorded during events  
6. Certificates are issued after completion  
7. Teams are created for group-based events  

---

## Key Design Concepts

### One-to-Many (1:N)
- College → Users  
- College → Clubs  
- College → Fests  
- Club → Events  
- Event → Teams  

### Many-to-Many (M:N)
- Users ↔ Events (via Registrations)  
- Users ↔ Teams (via Team Members)  

---

## Summary

The database is designed to:

- Handle multiple colleges and events efficiently  
- Maintain structured relationships between entities  
- Support both individual and team participation  
- Ensure scalability and data consistency  