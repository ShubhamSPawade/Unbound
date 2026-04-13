-- Database Optimization: Create Indexes for Better Query Performance
-- Run this migration to create all necessary indexes

-- ============================================================================
-- EVENT TABLE INDEXES
-- ============================================================================

-- Index on status for filtering published/draft events
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- Index on club_id for fetching events by club
CREATE INDEX IF NOT EXISTS idx_events_club_id ON events(club_id);

-- Index on fest_id for fetching events by fest
CREATE INDEX IF NOT EXISTS idx_events_fest_id ON events(fest_id);

-- Index on event_date for date range queries
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);

-- Index on category for filtering by event type
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

-- Composite index for common query pattern (status + date)
CREATE INDEX IF NOT EXISTS idx_events_status_date ON events(status, event_date);

-- ============================================================================
-- REGISTRATION TABLE INDEXES
-- ============================================================================

-- Index on user_id for fetching user's registrations
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);

-- Index on event_id for fetching event registrations
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);

-- Index on status for filtering by registration status
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);

-- Composite index for checking duplicate registrations
CREATE INDEX IF NOT EXISTS idx_registrations_user_event ON registrations(user_id, event_id);

-- Composite index for counting confirmed registrations
CREATE INDEX IF NOT EXISTS idx_registrations_event_status ON registrations(event_id, status);

-- Index on registration_date for sorting
CREATE INDEX IF NOT EXISTS idx_registrations_date ON registrations(registration_date);

-- ============================================================================
-- PAYMENT TABLE INDEXES
-- ============================================================================

-- Index on user_id for payment history
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

-- Index on event_id for event revenue tracking
CREATE INDEX IF NOT EXISTS idx_payments_event_id ON payments(event_id);

-- Index on status for filtering successful/failed payments
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Index on razorpay_order_id for payment verification
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON payments(razorpay_order_id);

-- Index on created_at for date range queries
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Composite index for user payment statistics
CREATE INDEX IF NOT EXISTS idx_payments_user_status ON payments(user_id, status);

-- Composite index for event revenue calculation
CREATE INDEX IF NOT EXISTS idx_payments_event_status ON payments(event_id, status);

-- ============================================================================
-- CLUB TABLE INDEXES
-- ============================================================================

-- Index on status for approval workflow
CREATE INDEX IF NOT EXISTS idx_clubs_status ON clubs(status);

-- Index on college_id for college-specific clubs
CREATE INDEX IF NOT EXISTS idx_clubs_college_id ON clubs(college_id);

-- Index on created_by for ownership checks
CREATE INDEX IF NOT EXISTS idx_clubs_created_by ON clubs(created_by);

-- Index on is_active for soft delete filtering
CREATE INDEX IF NOT EXISTS idx_clubs_is_active ON clubs(is_active);

-- Composite index for active clubs by status
CREATE INDEX IF NOT EXISTS idx_clubs_status_active ON clubs(status, is_active);

-- Index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_clubs_created_at ON clubs(created_at);

-- ============================================================================
-- USER TABLE INDEXES
-- ============================================================================

-- Index on email for login queries (unique constraint already creates index)
-- CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index on role for role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Index on college_id for college-specific users
CREATE INDEX IF NOT EXISTS idx_users_college_id ON users(college_id);

-- ============================================================================
-- FEST TABLE INDEXES
-- ============================================================================

-- Index on college_id for college fests
CREATE INDEX IF NOT EXISTS idx_fests_college_id ON fests(college_id);

-- Index on start_date for date range queries
CREATE INDEX IF NOT EXISTS idx_fests_start_date ON fests(start_date);

-- Index on end_date for date range queries
CREATE INDEX IF NOT EXISTS idx_fests_end_date ON fests(end_date);

-- ============================================================================
-- ANALYZE TABLES FOR QUERY PLANNER
-- ============================================================================

ANALYZE events;
ANALYZE registrations;
ANALYZE payments;
ANALYZE clubs;
ANALYZE users;
ANALYZE fests;
ANALYZE colleges;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check created indexes
-- SELECT schemaname, tablename, indexname, indexdef
-- FROM pg_indexes
-- WHERE schemaname = 'public'
-- ORDER BY tablename, indexname;

-- Check index usage statistics
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public'
-- ORDER BY idx_scan DESC;
