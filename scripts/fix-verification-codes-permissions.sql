-- Fix verification_codes table permissions and structure
-- This script ensures the table has the correct structure and RLS policies

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous insert" ON verification_codes;
DROP POLICY IF EXISTS "Allow anonymous select" ON verification_codes;
DROP POLICY IF EXISTS "Allow anonymous update" ON verification_codes;

-- Ensure the table has all required columns
DO $$ 
BEGIN
  -- Check if 'used' column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'verification_codes' 
    AND column_name = 'used'
  ) THEN
    ALTER TABLE verification_codes ADD COLUMN used BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Enable RLS on the table
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for anonymous access
-- This allows the API routes to work without authentication

-- Policy for INSERT operations
CREATE POLICY "Allow anonymous insert on verification_codes"
ON verification_codes
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy for SELECT operations
CREATE POLICY "Allow anonymous select on verification_codes"
ON verification_codes
FOR SELECT
TO anon
USING (true);

-- Policy for UPDATE operations
CREATE POLICY "Allow anonymous update on verification_codes"
ON verification_codes
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_verification_codes_email_code 
ON verification_codes(email, code) 
WHERE used = false;

CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at 
ON verification_codes(expires_at) 
WHERE used = false;

-- Grant necessary permissions to anon role
GRANT SELECT, INSERT, UPDATE ON verification_codes TO anon;

-- Verify the structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'verification_codes'
ORDER BY ordinal_position;
