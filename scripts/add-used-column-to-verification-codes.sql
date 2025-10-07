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
        ADD COLUMN used BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_verification_codes_email_code 
ON verification_codes(email, code, used);

CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at 
ON verification_codes(expires_at);

-- Add comment
COMMENT ON COLUMN verification_codes.used IS 'Indicates whether the verification code has been used';
