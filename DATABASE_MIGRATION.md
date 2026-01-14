# Supabase to Neon Migration Guide

## Overview
This document describes the complete migration of the Kuhlekt database from Supabase to Neon PostgreSQL.

## Why Migrate to Neon?
- Single, unified database connection
- Better performance for analytics queries
- Direct PostgreSQL access without abstraction layers
- Reduced operational complexity
- Cost efficiency

## Migration Steps

### 1. Pre-Migration (Complete)
- ✅ Identified all 59 tables in both databases
- ✅ Confirmed schema parity between Supabase and Neon
- ✅ Created migration scripts
- ✅ Set up Neon connection utilities

### 2. Data Migration
Run the migration script:
```bash
npx ts-node scripts/migrate-supabase-to-neon.ts
```

This script:
- Exports all data from Supabase (batched)
- Imports data into Neon with ON CONFLICT handling
- Logs progress and errors
- Returns summary statistics

### 3. Updated API Routes
The following routes have been updated to use Neon:
- `app/api/track-visitor/route.ts` - Visitor tracking
- `app/api/site-visits/route.ts` - Analytics queries
- `app/api/demo/route.ts` - Demo form & promo codes
- `app/api/chat/handoff/route.ts` - Chat integration
- `app/api/promo-codes/generate/route.ts` - Promo code generation
- `app/api/promo-codes/validate/route.ts` - Promo code validation
- `app/api/verification-code/generate/route.tsx` - Email verification
- `app/api/verification-code/verify/route.ts` - Code verification

### 4. New Utilities
Created Neon client utilities:
- `lib/neon/client.ts` - Client-side utilities
- `lib/neon/server.ts` - Server-side utilities with connection pooling

### 5. Benefits of New Query Pattern
Instead of:
```typescript
const { data, error } = await supabase.from('table').select()
```

Now using:
```typescript
const result = await neonDb('SELECT * FROM table')
```

Benefits:
- Direct SQL control
- Better query optimization
- Parameterized queries prevent SQL injection
- Faster execution
- Full PostgreSQL feature access

## Environment Variables
Ensure these are set:
- `NEON_DATABASE_URL` - Connection string (required)
- `SUPABASE_*` - Can be removed after migration (kept for reference)

## Rollback Plan
If issues occur:
1. Keep Supabase data as backup for 30 days
2. Revert code to use Supabase clients
3. Update environment to point back to Supabase

## Verification Checklist
- [ ] Migration script runs successfully
- [ ] All 59 tables have data
- [ ] No foreign key constraint violations
- [ ] API routes return correct data
- [ ] Analytics calculations match Supabase
- [ ] Forms submit successfully
- [ ] Rate limiting works correctly
- [ ] Email verification codes generate/verify
- [ ] Promo code validation works

## Timeline
1. Run migration script
2. Test analytics queries
3. Monitor API routes for 24 hours
4. Decommission Supabase (after verification)
5. Remove Supabase environment variables

## Support
Contact the development team if issues arise during migration.
