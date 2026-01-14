# Neon Migration - Complete Guide

## Status: Ready for Execution

All preparation is complete. The Kuhlekt website is ready to migrate from Supabase to Neon.

## What Has Been Done

### 1. Migration Infrastructure (Complete)
- Created `scripts/migrate-supabase-to-neon.ts` - Full data migration script
- Created `lib/neon/client.ts` - Client utilities
- Created `lib/neon/server.ts` - Server utilities with connection pooling
- Updated 8 major API routes to use Neon directly
- All queries parameterized to prevent SQL injection

### 2. API Routes Updated to Neon
✅ `app/api/track-visitor/route.ts` - Visitor tracking with full upsert logic
✅ `app/api/site-visits/route.ts` - Analytics queries for dashboard
✅ `app/api/demo/route.ts` - Demo form with promo code integration
✅ `app/api/chat/handoff/route.ts` - Chat handoff form
✅ `app/api/promo-codes/generate/route.ts` - Promo code generation
✅ `app/api/promo-codes/validate/route.ts` - Promo code validation
✅ `app/api/verification-code/generate/route.tsx` - Email verification codes
✅ `app/api/verification-code/verify/route.ts` - Verification code verification

### 3. Query Pattern Transformation
All routes now use direct PostgreSQL parameterized queries:
- Old: `supabase.from('table').select().eq('col', $1)`
- New: `await neonDb('SELECT * FROM table WHERE col = $1', [$1])`

Benefits:
- Faster execution
- Better control over queries
- Full PostgreSQL capabilities
- Improved security with parameterized queries
- Easier to optimize performance

### 4. Still Need Migration
These files still reference Supabase and should be migrated after data transfer:
- `lib/rate-limiter.ts` - Can use direct Neon query
- `lib/real-time-analytics.ts` - Can use direct Neon query
- `app/api/contact-form/route.ts` - Should verify works with Neon
- Any authentication components (if using Supabase Auth)

## Migration Execution Steps

### Step 1: Verify Neon Connection
```bash
# Test connection
psql $NEON_DATABASE_URL -c "SELECT 1"
```

### Step 2: Run Data Migration
```bash
# Run migration script
npx ts-node scripts/migrate-supabase-to-neon.ts

# Expected output:
# [table_name] Starting migration...
# [table_name] Found X records to migrate
# [table_name] Inserted X/X records
# ... (repeat for all 59 tables)
# 
# MIGRATION SUMMARY
# Total tables processed: 59
# Successful migrations: 59
# Failed migrations: 0
# Total records migrated: [COUNT]
```

### Step 3: Deploy Code Changes
```bash
git add .
git commit -m "chore: migrate from Supabase to Neon"
git push origin main
# Deploy to Vercel
```

### Step 4: Monitor & Test
- Check error logs for any database errors
- Test visitor tracking: Visit the site and check if data appears
- Test form submissions: Submit demo/contact forms
- Test analytics: Check if dashboard queries return data
- Test email verification: Request verification code
- Test promo codes: Try redeeming a promo code

### Step 5: Verify Analytics
```bash
# Check key tables
SELECT COUNT(*) FROM visitor_tracking;  -- Should have data
SELECT COUNT(*) FROM form_submitters;   -- Should have data
SELECT COUNT(*) FROM verification_codes; -- May be empty initially
```

### Step 6: Decommission Supabase (Optional)
Once confident everything works:
1. Remove Supabase environment variables from Vercel
2. Delete Supabase project or keep as backup
3. Remove Supabase packages from dependencies
4. Remove Supabase client files

## Rollback Plan (If Needed)

### If Critical Issues Occur
1. Revert git to previous commit
2. Restore Supabase client imports
3. Redeploy to Vercel
4. Neon data remains intact as backup

No data will be lost - both databases remain independent.

## Monitoring & Alerts

Monitor these metrics:
- Response time for API routes (should improve)
- Error rate in logs
- Database query performance
- Rate limiting accuracy
- Visitor tracking data collection

## Environment Variables Needed

### Required (New)
- `NEON_DATABASE_URL` - Full connection string

### Optional (Old - can remove after verification)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `POSTGRES_URL`
- `POSTGRES_PASSWORD`

## Post-Migration Todos

- [ ] Update database documentation
- [ ] Update developer setup guide
- [ ] Remove Supabase from dependency docs
- [ ] Update CI/CD scripts if needed
- [ ] Notify team of completion
- [ ] Archive Supabase project
- [ ] Review database indexing for performance
- [ ] Set up automated backups for Neon

## Performance Expectations

After migration, you should see:
- Faster query execution (direct SQL vs REST API)
- Lower latency for real-time updates
- Better handling of concurrent connections
- More predictable performance under load
- Easier query optimization

## Questions & Support

If issues arise:
1. Check error logs in Vercel dashboard
2. Verify NEON_DATABASE_URL is set correctly
3. Ensure all tables have been migrated
4. Test individual queries with psql
5. Review migration logs

Contact development team for additional support.
