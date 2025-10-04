-- Add the 'used' column to verification_codes table
ALTER TABLE verification_codes
ADD COLUMN IF NOT EXISTS used BOOLEAN DEFAULT false;

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_verification_codes_email_used 
ON verification_codes(email, used);

-- Create an index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at 
ON verification_codes(expires_at);
