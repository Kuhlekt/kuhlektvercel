# Supabase Environment Variable Cleanup

## Current Status

Both Supabase and Neon are currently configured. All application code has been migrated to Neon.

## Step 1: Verify Neon Works

Before removing Supabase, verify Neon is functioning:

```bash
# Test the verification script
npx ts-node scripts/verify-neon-migration.ts
```

Expected output:
```
✓ Connection successful
✓ Found XX tables
✓ All critical tables present
✓ Data counts: { form_count: X, visitor_count: Y, ... }
✓ Rate limit insert successful
✅ Neon migration verification complete!
```

## Step 2: Remove Supabase Environment Variables

In your Vercel project settings (Settings > Environment Variables), delete:

### Authentication & URLs
- [ ] SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] SUPABASE_JWT_SECRET

### API Keys
- [ ] SUPABASE_ANON_KEY
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY

### Connection Strings (Supabase versions)
- [ ] POSTGRES_URL
- [ ] POSTGRES_PRISMA_URL
- [ ] POSTGRES_URL_NON_POOLING

### Credentials (if separate Supabase DB)
- [ ] POSTGRES_USER (Supabase)
- [ ] POSTGRES_PASSWORD (Supabase)
- [ ] POSTGRES_DATABASE (Supabase)
- [ ] POSTGRES_HOST (Supabase)

## Step 3: Verify Neon Environment Variables

Ensure these are set (they should be from integrations):
- [ ] NEON_DATABASE_URL
- [ ] NEON_POSTGRES_URL
- [ ] NEON_POSTGRES_URL_NON_POOLING
- [ ] NEON_PGHOST
- [ ] NEON_POSTGRES_USER
- [ ] NEON_POSTGRES_PASSWORD
- [ ] NEON_POSTGRES_DATABASE

## Step 4: Deploy Updated Application

After removing Supabase env vars:

```bash
# Deploy to production
git push origin main
```

## Step 5: Monitor Deployment

After deployment:
- Check application logs for errors
- Test all forms and features
- Monitor database performance
- Verify no Supabase references in logs

## Step 6: Delete Supabase Database (Optional)

Once fully verified (48+ hours):

1. Go to Supabase dashboard
2. Select your Kuhlekt project
3. Settings > Databases > Delete (if you no longer need it)
4. Cancel Supabase subscription if applicable

## Quick Checklist

- [ ] Run verification script
- [ ] All tests pass
- [ ] Remove Supabase env vars
- [ ] Deploy to production
- [ ] Monitor logs for 24-48 hours
- [ ] Test all features in production
- [ ] Delete Supabase database
- [ ] Cancel Supabase subscription

## Important Notes

- Data is preserved during migration
- No breaking changes to API
- Neon performance should be equal or better
- All SQL queries work identically
- Connection pooling automatically handled by Neon

---

Ready to remove Supabase? Start with Step 1 above.
