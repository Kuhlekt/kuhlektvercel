# Security Setup Guide

## Password Hashing

To use hashed passwords instead of plaintext:

1. Generate a password hash by running this in Node.js:

\`\`\`javascript
const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

console.log(hashPassword('your-admin-password'));
\`\`\`

2. Add the hash to your environment variables:

\`\`\`
ADMIN_PASSWORD_HASH=<generated-hash>
\`\`\`

3. Remove the old `ADMIN_PASSWORD` variable (optional, kept for backward compatibility)

## Current Security Features

- ✅ Secure session tokens (64-character random hex)
- ✅ Password hashing with PBKDF2 (100,000 iterations)
- ✅ HttpOnly cookies
- ✅ SameSite=Strict protection
- ✅ Secure cookies in production
- ✅ Centralized authentication checks

## Migration Path

The system supports both hashed and plaintext passwords for backward compatibility:
- If `ADMIN_PASSWORD_HASH` is set and contains ":", it uses hashed verification
- Otherwise, it falls back to plaintext comparison with `ADMIN_PASSWORD`

This allows gradual migration without breaking existing deployments.
