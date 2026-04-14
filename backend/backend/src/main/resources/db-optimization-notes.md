# Database Optimization Notes

## Indexes to Create

Run these SQL commands on your PostgreSQL database for optimal performance:

```sql
-- Event table indexes
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_club_id ON events(club_id);
CREATE INDEX IF NOT EXISTS idx_events_fest_id ON events(fest_id);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_status_date ON events(status, event_date);

-- Registration table indexes
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_user_event ON registrations(user_id, event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event_status ON registrations(event_id, status);
CREATE INDEX IF NOT EXISTS idx_registrations_date ON registrations(registration_date);

-- Payment table indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_event_id ON payments(event_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_user_status ON payments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_event_status ON payments(event_id, status);

-- Club table indexes
CREATE INDEX IF NOT EXISTS idx_clubs_status ON clubs(status);
CREATE INDEX IF NOT EXISTS idx_clubs_college_id ON clubs(college_id);
CREATE INDEX IF NOT EXISTS idx_clubs_created_by ON clubs(created_by);
CREATE INDEX IF NOT EXISTS idx_clubs_is_active ON clubs(is_active);
CREATE INDEX IF NOT EXISTS idx_clubs_status_active ON clubs(status, is_active);
CREATE INDEX IF NOT EXISTS idx_clubs_created_at ON clubs(created_at);

-- User table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_college_id ON users(college_id);

-- Fest table indexes
CREATE INDEX IF NOT EXISTS idx_fests_college_id ON fests(college_id);
CREATE INDEX IF NOT EXISTS idx_fests_start_date ON fests(start_date);
CREATE INDEX IF NOT EXISTS idx_fests_end_date ON fests(end_date);
```

## Query Optimization Strategies Applied

### 1. JOIN FETCH for Eager Loading
- Prevents N+1 query problem
- Loads related entities in single query
- Applied to: Events, Registrations, Payments, Clubs

### 2. Indexed Columns
- Foreign keys indexed
- Status columns indexed
- Date columns indexed
- Composite indexes for common queries

### 3. Query Hints
- DISTINCT used where necessary
- LEFT JOIN FETCH for optional relations
- ORDER BY optimized with indexes

### 4. Batch Operations
- Added batch fetch methods
- Reduces round trips to database
- Improves bulk operation performance

## Performance Monitoring

### Enable Query Logging
Add to `application.properties`:
```properties
# Show SQL queries
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Show query execution time
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# Show slow queries (queries taking more than 1 second)
spring.jpa.properties.hibernate.session.events.log.LOG_QUERIES_SLOWER_THAN_MS=1000
```

### Query Performance Metrics
Monitor these metrics:
- Query execution time
- Number of queries per request
- Database connection pool usage
- Cache hit ratio

## Best Practices

### 1. Use Appropriate Fetch Types
- LAZY for collections (default)
- EAGER only when always needed
- JOIN FETCH in queries when needed

### 2. Pagination
- Use `Pageable` for large result sets
- Prevents loading all records
- Improves memory usage

### 3. Caching
- Enable second-level cache for read-heavy entities
- Use query cache for repeated queries
- Configure cache regions appropriately

### 4. Connection Pooling
- Configure HikariCP properly
- Set appropriate pool size
- Monitor connection usage

## Expected Performance Improvements

### Before Optimization
- N+1 queries for related entities
- Multiple round trips to database
- Slow list operations
- High memory usage

### After Optimization
- Single query with JOIN FETCH
- Reduced database round trips
- Faster list operations (50-80% improvement)
- Lower memory footprint

## Testing Recommendations

### 1. Load Testing
- Test with 100+ concurrent users
- Monitor query execution time
- Check database connection pool

### 2. Query Analysis
- Use EXPLAIN ANALYZE in PostgreSQL
- Identify slow queries
- Optimize based on execution plan

### 3. Profiling
- Use JProfiler or YourKit
- Monitor database calls
- Identify bottlenecks

## Maintenance

### Regular Tasks
1. Analyze query performance monthly
2. Update statistics: `ANALYZE table_name;`
3. Vacuum database: `VACUUM ANALYZE;`
4. Monitor index usage
5. Remove unused indexes

### Index Maintenance
```sql
-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan;

-- Rebuild indexes if needed
REINDEX TABLE table_name;
```
