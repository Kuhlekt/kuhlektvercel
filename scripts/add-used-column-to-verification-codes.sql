-- Add the 'used' column to verification_codes table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'verification_codes' 
        AND column_name = 'used'
    ) THEN
        ALTER TABLE verification_codes 
        ADD COLUMN used BOOLEAN DEFAULT false NOT NULL;
    END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_verification_codes_email_code 
ON verification_codes(email, code) 
WHERE used = false;

-- Create index for cleanup of expired codes
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at 
ON verification_codes(expires_at) 
WHERE used = false;

-- Add comment
COMMENT ON COLUMN verification_codes.used IS 'Whether the verification code has been used';
