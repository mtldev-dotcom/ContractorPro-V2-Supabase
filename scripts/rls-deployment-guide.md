# RLS Migration Deployment Guide
## ContractorPro-V2 Row Level Security Implementation

### Overview
This guide walks you through safely implementing Row Level Security (RLS) on your ContractorPro application. The migration includes comprehensive security policies for multi-tenant data isolation and role-based access control.

### Pre-Deployment Checklist

#### 1. Database Backup
**CRITICAL**: Always backup your database before running RLS migrations
```bash
# Create a full database backup
pg_dump your_database > backup_before_rls.sql
```

#### 2. Environment Verification
- [ ] Confirm you're working on the correct environment (dev/staging first)
- [ ] Verify all existing data is properly associated with companies
- [ ] Check that user_companies table has proper associations
- [ ] Ensure all users have valid roles assigned

#### 3. Data Integrity Check
Run these queries to verify data integrity before RLS:

```sql
-- Check for orphaned records
SELECT 'Clients without company' as issue, COUNT(*) as count 
FROM clients WHERE company_id IS NULL
UNION ALL
SELECT 'Suppliers without company', COUNT(*) 
FROM suppliers WHERE company_id IS NULL
UNION ALL
SELECT 'Employees without company', COUNT(*) 
FROM employees WHERE company_id IS NULL
UNION ALL
SELECT 'Projects without company', COUNT(*) 
FROM projects_new WHERE company_id IS NULL;

-- Check for users without company associations
SELECT 'Users without company associations' as issue, COUNT(*) as count
FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_companies uc WHERE uc.user_id = u.id
);
```

### Deployment Steps

#### Step 1: Test Environment Deployment
1. **Apply to test/staging environment first**
2. **Run the RLS migration**:
   ```sql
   \i scripts/rls-migration.sql
   ```
3. **Run the test script**:
   ```sql
   \i scripts/rls-test.sql
   ```
4. **Verify all functionality works as expected**

#### Step 2: Production Deployment
1. **Schedule maintenance window** (RLS changes may cause brief downtime)
2. **Apply the migration**:
   ```sql
   \i scripts/rls-migration.sql
   ```
3. **Test with different user roles**
4. **Monitor application performance**

### Post-Deployment Verification

#### 1. Functionality Tests
Test these scenarios with different user roles:

**Admin User:**
- [ ] Can view all company data
- [ ] Can create/edit/delete records
- [ ] Can manage users and companies
- [ ] Can access payroll data

**Manager User:**
- [ ] Can view company data
- [ ] Can manage projects, tasks, employees
- [ ] Cannot access payroll data
- [ ] Cannot manage users or companies

**Employee User:**
- [ ] Can view assigned tasks
- [ ] Can update own time entries
- [ ] Can view own employee record
- [ ] Cannot access other employees' data
- [ ] Cannot access payroll data

**Client User:**
- [ ] Can view own project data
- [ ] Cannot access company internal data
- [ ] Cannot access employee or payroll data

#### 2. Performance Monitoring
Monitor these metrics after RLS implementation:

```sql
-- Check query performance
EXPLAIN ANALYZE SELECT * FROM projects_new WHERE company_id = ANY(get_user_company_ids());

-- Monitor slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
WHERE query LIKE '%projects_new%' 
ORDER BY mean_time DESC;
```

#### 3. Security Verification
Run these tests to verify security:

```sql
-- Test as different users
-- Should only see data from their companies
SELECT COUNT(*) FROM clients;
SELECT COUNT(*) FROM projects_new;
SELECT COUNT(*) FROM employees;
```

### Rollback Procedure

If issues arise, follow this rollback procedure:

#### 1. Emergency Rollback
```sql
-- Disable RLS on all tables (EMERGENCY ONLY)
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects_new DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE time_tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE equipment DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE communications DISABLE ROW LEVEL SECURITY;
ALTER TABLE change_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE material_usage DISABLE ROW LEVEL SECURITY;
ALTER TABLE payroll DISABLE ROW LEVEL SECURITY;
```

#### 2. Drop Policies
```sql
-- Drop all RLS policies
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            policy_record.policyname, 
            policy_record.schemaname, 
            policy_record.tablename);
    END LOOP;
END $$;
```

#### 3. Restore from Backup
```bash
# Restore from backup if needed
psql your_database < backup_before_rls.sql
```

### Troubleshooting Common Issues

#### Issue 1: "No data visible after RLS"
**Cause**: Missing user-company associations
**Solution**:
```sql
-- Check user associations
SELECT u.email, uc.company_id, c.name 
FROM users u 
LEFT JOIN user_companies uc ON u.id = uc.user_id
LEFT JOIN companies c ON uc.company_id = c.id;

-- Add missing associations
INSERT INTO user_companies (user_id, company_id, role)
SELECT u.id, c.id, u.role
FROM users u, companies c
WHERE NOT EXISTS (
  SELECT 1 FROM user_companies uc 
  WHERE uc.user_id = u.id AND uc.company_id = c.id
);
```

#### Issue 2: "Performance degradation"
**Cause**: Missing indexes on RLS policy columns
**Solution**:
```sql
-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON user_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_company_id ON user_companies(company_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
```

#### Issue 3: "Cannot access own data"
**Cause**: Incorrect policy logic
**Solution**: Check policy definitions and user associations

### Security Best Practices

#### 1. Regular Policy Reviews
- Review RLS policies quarterly
- Test with different user scenarios
- Monitor for policy conflicts

#### 2. Audit Logging
Consider implementing audit logging:
```sql
-- Create audit table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    table_name VARCHAR(100),
    action VARCHAR(20),
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. Policy Testing
Regularly test policies with different user roles:
```sql
-- Test as different users
SET LOCAL ROLE authenticated;
-- Run test queries
```

### Performance Optimization

#### 1. Index Maintenance
Regularly check index usage:
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

#### 2. Query Optimization
- Always include filters in application queries
- Use prepared statements
- Monitor slow query logs

### Support and Maintenance

#### 1. Monitoring
Set up alerts for:
- Failed authentication attempts
- Unusual data access patterns
- Performance degradation

#### 2. Documentation
- Document all RLS policies
- Maintain user role definitions
- Keep deployment procedures updated

### Conclusion

This RLS implementation provides:
- ✅ Multi-tenant data isolation
- ✅ Role-based access control
- ✅ Performance optimization
- ✅ Security best practices
- ✅ Comprehensive testing procedures

Follow this guide carefully to ensure a smooth and secure RLS deployment. 