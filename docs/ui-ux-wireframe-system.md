# Unbound UI/UX Wireframe System (Web + Mobile)

## 1. Product Scope
Unbound is a centralized college event management platform for:
- Super Admin
- College Admin
- Club Admin
- Student

Supports event categories:
- Technical
- Cultural
- Sports
- Workshops & Seminars
- Gaming
- Quiz
- Competitions

This document defines:
- sitemap
- user flows
- low to mid fidelity wireframes by module
- responsive strategy
- complete design system
- state patterns (empty/loading/error)

## 2. Information Architecture (Sitemap)

### Public
- Landing
- About
- Featured Fests and Events
- Explore Events
- Event Details
- Fest Details
- Search Results
- Login
- Signup
- Forgot Password

### Student
- Dashboard
- Browse Events
- Browse Fests
- Event Registration Form
- My Registrations
- Saved Events
- Event Calendar
- Notifications
- Profile
- Participation History
- Certificates and Achievements

### College Admin
- Dashboard
- Create Fest
- Manage Fests
- Fest Analytics
- Club Requests Approval
- College Profile
- Announcements

### Club Admin
- Dashboard
- Create Standalone Event
- Create Event Under Fest
- Manage Club Events
- Event Registrations Management
- Attendance Management
- Club Profile
- Certificate Upload and Result Publishing

### Super Admin
- Platform Overview Dashboard
- Manage Colleges
- Manage Clubs
- Manage Users
- Reports and Analytics
- Category Management
- Platform Settings

### Shared Utility
- Global Search
- Smart Filters
- Notifications Drawer
- Profile Menu
- Help and Support

## 3. Primary User Flows

### Student Registration Flow
1. Student opens Explore Events.
2. Uses category chips + smart filters + search.
3. Opens Event Details.
4. Clicks Register.
5. Fills registration form and confirms.
6. Sees success confirmation modal and ticket reference.
7. Event appears in My Registrations + Calendar.

### Club Event Publishing Flow
1. Club Admin opens Club Dashboard.
2. Clicks Create Event (Standalone or Under Fest).
3. Fills form: title, category, date, venue, capacity, fee, rules, prizes, speakers, poster.
4. Publishes event.
5. Tracks registrations and attendance from management screens.
6. Uploads certificates/results after completion.

### College Fest Management Flow
1. College Admin opens Create Fest.
2. Adds fest metadata: title, dates, clubs, sponsors, gallery placeholders.
3. Maps clubs and events to fest.
4. Publishes fest.
5. Monitors analytics and approvals from dashboard and fest analytics.

### Super Admin Governance Flow
1. Super Admin opens platform overview.
2. Reviews cross-college KPIs.
3. Manages colleges/clubs/users.
4. Updates categories and platform settings.
5. Exports reports and applies governance decisions.

## 4. Wireframes by Module (Low to Mid Fidelity)

All low-fidelity wireframes use grayscale blocks:
- `Header`, `Sidebar`, `Card`, `Table`, `Form`, `Chart Placeholder`, `Modal` labels only.
- No decorative color in base wireframe.
- Mid fidelity adds hierarchy, spacing, icon placeholders, statuses, and responsive behavior.

---

## 4A. Public / Landing Module

### 1) Landing Page
Desktop structure:
- Top navbar: logo, Explore, Fests, About, Login, Signup CTA.
- Hero split 60/40.
- Left: headline, short value proposition, Explore Events CTA, Browse Fests CTA.
- Right: stacked event/fest cards with date/status badges.
- Section strip: category chips.
- Featured cards carousel row.
- Footer: quick links, social, contact.

Mobile structure:
- Compact top bar + hamburger.
- Hero stacked vertical.
- CTA buttons full width.
- Horizontal scroll cards.
- Bottom sticky action: Explore Events.

### 2) About Platform Section
- Mission, role-based value blocks.
- 4 cards for role value: Student, Club Admin, College Admin, Super Admin.
- Stats row: colleges, clubs, events, registrations.

### 3) Featured Fests and Events
- Toggle tabs: Featured Fests | Featured Events.
- 3-column desktop cards, 1-column mobile cards.
- Each card includes title, date, venue, organizer, countdown, status badge.

### 4) Explore Events Page
- Search bar + filter panel + results grid.
- Filter panel fields: category, date range, venue, fee/free, fest linked, availability.
- Sort dropdown: newest, upcoming, popular.

### 5) Event Details Page
- Hero poster placeholder + core meta.
- Left content: description, rules, prizes, speakers/judges.
- Right sticky panel: fee/free tag, deadline, capacity meter, register button.
- Organizer card + optional parent fest link.

### 6) Fest Details Page
- Fest hero: title, college, dates, description.
- Participating clubs strip.
- Featured events list with register/view details CTAs.
- Sponsors row + gallery placeholders.

### 7) Search and Filter Results
- Query summary bar.
- Applied filters chips with remove action.
- Results cards/list toggle.
- Empty state if no match.

### 8) Login Page
- Split layout desktop, single card mobile.
- Fields: email, password, remember me.
- Actions: login, forgot password, signup.

### 9) Signup Page
- Fields: name, email, role selector, college, password, confirm password.
- Role-aware helper text.

### 10) Forgot Password Page
- Email field.
- Submit action.
- Confirmation success state.

---

## 4B. Student Module

### 1) Student Dashboard
- Top summary cards: upcoming events, registrations, certificates, notifications.
- Quick actions: Browse Events, Browse Fests, My Registrations.
- Recommended events row.
- Calendar widget mini view.

### 2) Browse All Events
- Same pattern as Explore with signed-in enhancements.
- Save/bookmark action on card.

### 3) Browse All Fests
- Fest card grid with dates, clubs count, events count.

### 4) Event Registration Form
- Step form:
1. Personal details
2. Team info (if required)
3. Payment (if paid)
4. Confirmation
- Progress indicator at top.

### 5) My Registrations
- Table or cards with status:
- Registered
- Waitlisted
- Confirmed
- Cancelled
- Download pass action.

### 6) Saved / Bookmarked Events
- Card list with quick register.

### 7) Event Calendar View
- Month/week toggle.
- Event color tags by category.
- Event detail drawer on click.

### 8) Notifications Page
- Notification cards by type:
- Deadline reminder
- Registration confirmation
- Event update
- Certificate available

### 9) Student Profile Page
- Personal info form.
- Academic details.
- Preferences: categories, notification channels.

### 10) Participation History
- Timeline/list of completed events.
- Outcomes and rankings.

### 11) Certificates / Achievements
- Certificate cards with preview/download/share.
- Filter by year/category.

---

## 4C. College Admin Module

### 1) College Admin Dashboard
- KPI cards: active fests, active clubs, total registrations, pending approvals.
- Trend chart placeholders.
- Approval workflow cards.

### 2) Create Fest Page
- Form sections:
- Basic details
- Date range
- Clubs inclusion
- Sponsors
- Gallery placeholders
- Publish controls with draft/publish toggle.

### 3) Manage Fests Page
- Table list with status badges.
- Actions: view, edit, archive, analytics.

### 4) Fest Analytics Page
- Chart placeholders: registrations over time, category split, attendance rate.
- Top events ranking table.

### 5) Approve / Manage Club Requests
- Approval cards with request details.
- Approve/reject with modal reason.

### 6) Manage College Profile
- Profile form.
- Branding assets placeholders.
- Contact and location.

### 7) Announcements Page
- Rich text area + audience targeting.
- Announcement history list.

---

## 4D. Club Admin Module

### 1) Club Dashboard
- KPI cards: published events, registrations, attendance.
- Upcoming event timeline.

### 2) Create Standalone Event Page
- Full event form with data structure fields.

### 3) Create Event Under Fest Page
- Same as standalone plus fest selector.

### 4) Manage Club Events
- Event table/cards with state: draft, published, completed.

### 5) Event Registrations Management
- Registrations table with search and bulk actions.

### 6) Attendance / Participant Management
- QR/manual attendance input module.
- Mark present/absent.

### 7) Club Profile Page
- Club info and social links.

### 8) Certificates Upload / Result Publishing
- Upload module + mapping to participants.
- Publish result and notify action.

---

## 4E. Super Admin Module

### 1) Platform Overview Dashboard
- Total colleges, clubs, users, events, registrations.
- Health indicators.

### 2) Manage Colleges
- Table with verification status and action menu.

### 3) Manage Clubs
- Table with parent college mapping and moderation status.

### 4) Manage Users
- Role-based filters.
- Lock/unlock/reset actions.

### 5) Reports and Analytics
- Export panel.
- Multi-chart placeholders.

### 6) Category Management
- CRUD table for event categories.

### 7) Platform Settings
- Global settings forms:
- registration rules
- moderation rules
- notification defaults

## 5. Shared Components (Wireframe Inventory)
- Top navbar
- Sidebar navigation
- Mobile bottom nav (student)
- Event card
- Fest card
- Search bar
- Smart filters panel
- Category chips
- Date and venue block
- Organizer card
- Status badges
- Countdown timer
- Calendar widget
- Notification card
- Analytics chart placeholder card
- Data table
- Approval workflow card
- Modal and drawer
- Form section card

## 6. Event and Fest Data Mapping in UI

### Event Fields
- title
- description
- category
- date and time
- venue
- organizer club
- parent fest (optional)
- registration deadline
- capacity
- fee/free tag
- rules
- prizes
- speakers/judges
- poster image placeholder

### Fest Fields
- title
- description
- college name
- dates
- participating clubs
- featured events
- sponsors
- gallery placeholders

## 7. Design System (Low Fidelity Base + Polished Direction)

## 7A. Low Fidelity Baseline
- Grayscale blocks only.
- Typography hierarchy labels:
- H1
- H2
- Body
- Caption
- Placeholders for charts/tables/forms.
- No branding visuals.

## 7B. Polished Visual Direction (Neo-brutalism Light)

### Color Styles
- Background: `#FFFDF5`
- Foreground: `#000000`
- Accent: `#FF6B6B`
- Secondary: `#FFD93D`
- Muted: `#C4B5FD`
- White: `#FFFFFF`

### Typography Scale (Space Grotesk)
- Display: 72/80, weight 900
- H1: 56/64, weight 900
- H2: 40/48, weight 900
- H3: 32/40, weight 900
- Body L: 20/30, weight 700
- Body: 16/26, weight 700
- Label: 14/20, weight 700 uppercase

### Spacing and Shape
- 8px base spacing
- Sharp corners by default
- Thick black border (`4px`) for primary components
- Hard offset shadows

### Core Components Tokens
- Buttons:
- Primary red block with black border + hard shadow
- Secondary yellow block
- Inputs:
- white background, thick black border, yellow focus state
- Cards:
- white surface, border 4px black, shadow offset
- Tables:
- high contrast headers, bold labels
- Badges:
- pill or square, uppercase
- Tabs:
- segmented hard-edge tabs
- Modals:
- centered sheet with strong border and shadow

## 8. Responsive Mobile Versions

### Mobile Student App Pattern
- Top compact header.
- Bottom navigation with 4-5 tabs:
- Home
- Explore
- Calendar
- Registrations
- Profile
- Cards in one-column stack.
- Sticky registration CTA in event detail.
- Filter opens as bottom drawer.

### Mobile Admin Pattern
- Collapsible sidebar drawer.
- KPI cards in 2-column grid.
- Tables convert to stacked cards.
- Primary actions pinned near top.

## 9. States and UX Reliability

### Empty States
- No events found.
- No registrations yet.
- No notifications yet.
- Include primary action CTA.

### Loading States
- Skeleton cards for list pages.
- Skeleton rows for tables.
- Spinner only for small actions.

### Error States
- Inline validation for forms.
- Page-level error card with retry.
- Permission denied screen for role mismatch.

## 10. Accessibility Requirements
- Keyboard reachable navigation and controls.
- Focus visible with strong contrast outlines.
- Text contrast AA minimum.
- Form error messages linked to inputs.
- Touch targets at least 44px.
- Reduce-motion friendly animation behavior.

## 11. Workflow Alignment (docs/workflow.md)
- All feature work starts from `develop`.
- UI tasks must be linked to issue IDs.
- PRs must use PR template and include:
- milestone mapping
- module mapping
- checklist completion
- Workflow board progression:
- Backlog -> Todo -> In Progress -> Review -> Testing -> Done
- Release gate remains `develop -> main` after testing.

## 12. Suggested Execution Order
1. Build design system page and component page first.
2. Implement public module templates.
3. Implement student module.
4. Implement club and college admin modules.
5. Implement super admin module.
6. Add responsive refinements and state coverage.
7. Conduct accessibility pass.

## 13. Deliverables Checklist
- Sitemap complete
- User flows complete
- Public screens complete
- Student screens complete
- College admin screens complete
- Club admin screens complete
- Super admin screens complete
- Design system page complete
- Components page complete
- Typography and color styles complete
- Mobile responsive variants complete
- Empty/loading/error states complete

## 14. Figma / FigJam Assets
- Unbound Sitemap: https://www.figma.com/online-whiteboard/create-diagram/0271a637-9b0f-42e5-b868-8f27a2e6d1e2?utm_source=other&utm_content=edit_in_figjam&oai_id=&request_id=c1eb2fd0-238a-4560-bdd1-8753efd560df
- Unbound Core User Flows: https://www.figma.com/online-whiteboard/create-diagram/e5d55675-23ad-4c37-beba-4c8408874aac?utm_source=other&utm_content=edit_in_figjam&oai_id=&request_id=f20f9270-55e9-402b-81cc-59edb68c37af
