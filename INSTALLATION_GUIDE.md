# Post-Security-Hardening Installation Guide

## Prerequisites

- Node.js 18+ installed
- All environment variables from `.env.example` configured
- Database migrations up to date

## Installation Steps

### 1. Update Environment Variables

Copy `.env.example` to `.env.local` and update all required values:

```bash
cp .env.example .env.local
```

### 2. Generate Admin Password Hash

Use this utility to create a secure admin password:

```bash
node -e "
const crypto = require('crypto');
const password = process.argv[1];
const salt = crypto.randomBytes(32).toString('hex');
const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
console.log('Add to .env.local:');
console.log('ADMIN_PASSWORD_HASH=' + salt + ':' + hash);
" "YourSecurePasswordHere"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Database Migrations

```bash
npm run migrate
```

### 5. Test Security Features

```bash
# Run security tests
npm run test:security

# This will verify:
# - CSRF protection is working
# - Rate limiting is enforced
# - Email sanitization is active
# - No debug logs in output
```

### 6. Start Development Server

```bash
npm run dev
```

### 7. Test Manually

#### Test CSRF Protection
1. Open http://localhost:3000/contact
2. Open DevTools → Network
3. Fill out form and submit
4. Verify "x-csrf-token" header is sent

#### Test Rate Limiting
1. Try to submit contact form 4+ times in quick succession
2. Should receive "Too many submissions" message on 4th attempt

#### Test Email Sanitization
1. In contact form, enter message: `<script>alert('xss')</script>`
2. Submit form
3. Check received email - script tags should be escaped

## Security Deployment Checklist

Before going to production:

- [ ] All environment variables configured
- [ ] Admin password hash generated and set
- [ ] CSRF token endpoint responding
- [ ] Rate limiting database connected
- [ ] Email escaping verified
- [ ] No console errors in production build
- [ ] Security headers configured
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] Error monitoring (Sentry) activated

## Production Deployment

### Vercel Deployment

```bash
# Deploy to Vercel
vercel deploy --prod

# Verify environment variables are set in Vercel dashboard
```

### Self-Hosted Deployment

1. Set all environment variables on your server
2. Run migrations: `npm run migrate`
3. Build: `npm run build`
4. Start: `npm start`
5. Configure reverse proxy (nginx/caddy) for HTTPS
6. Set up monitoring and alerting

## Monitoring Post-Deployment

### Key Metrics
- Monitor rate limit hits in database
- Track failed admin login attempts
- Monitor email delivery success rate
- Track CSRF token generation/validation

### Alerts to Configure
- More than 10 rate limit hits in 5 minutes
- More than 5 failed logins in 10 minutes
- Email sending errors > 5%
- Database connection failures

## Rollback Procedure

If issues arise, you can quickly rollback:

1. Disable CSRF checks (temporary):
   - Comment out CSRF validation in `lib/middleware/csrf-middleware.ts`
   - Redeploy

2. Disable Rate Limiting (temporary):
   - Set `checkRateLimit()` to always return `{ allowed: true }`
   - Redeploy

3. Full rollback to previous version:
   - `git revert` to previous commit
   - Redeploy

## Support & Troubleshooting

### Issue: CSRF token validation failing
**Solution:** Ensure fetch requests include the `x-csrf-token` header

### Issue: Rate limiting too aggressive
**Solution:** Adjust thresholds in `lib/rate-limiter.ts`

### Issue: Emails not sending
**Solution:** Verify AWS SES credentials in environment variables

### Issue: Admin login not working
**Solution:** Regenerate admin password hash with correct procedure

## Security References

- OWASP CSRF Prevention: https://owasp.org/www-community/attacks/csrf
- OWASP Rate Limiting: https://owasp.org/www-community/attacks/Denial_of_Service
- PBKDF2 Security: https://en.wikipedia.org/wiki/PBKDF2
