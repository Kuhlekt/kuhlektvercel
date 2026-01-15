# Removing Supabase Dependencies

## Files to Remove/Update

### Remove These Files
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `utils/supabase/server.ts`
- `lib/supabase/middleware.ts` (if exists)

### Update Imports
Find and replace all Supabase imports:

```typescript
// Remove:
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'

// Replace with:
import { neon } from '@neondatabase/serverless'
const neonDb = neon(process.env.NEON_DATABASE_URL!)
```

### Environment Variables to Remove
After confirming Neon is working:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_JWT_SECRET
- POSTGRES_URL (if Supabase-specific)
- POSTGRES_PRISMA_URL (if Supabase-specific)
- POSTGRES_PASSWORD
- POSTGRES_USER
- POSTGRES_HOST
- POSTGRES_DATABASE

### Dependencies to Remove
```bash
npm uninstall @supabase/supabase-js @supabase/ssr
```

### Files Still Needing Migration
- `lib/rate-limiter.ts`
- `lib/real-time-analytics.ts`
- `proxy.ts` (remove Supabase middleware import)
- Any authentication components using Supabase Auth

## Content Security Policy Update
Update `proxy.ts`:

```typescript
// Remove from CSP:
"connect-src 'self' https://*.supabase.co"

// Should now only have:
"connect-src 'self' https://your-neon-endpoint.com"
```

## Next Steps
After Supabase removal is complete:
1. Run full test suite
2. Check all API routes
3. Monitor error logs
4. Update documentation
