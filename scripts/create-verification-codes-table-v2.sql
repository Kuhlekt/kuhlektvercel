-- Drop existing table if it exists
DROP TABLE IF EXISTS verification_codes CASCADE;

-- Create verification codes table with correct schema
CREATE TABLE verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '15 minutes')
);

-- Create index on email for faster lookups
CREATE INDEX idx_verification_codes_email ON verification_codes(email);

-- Create index on expires_at for cleanup
CREATE INDEX idx_verification_codes_expires ON verification_codes(expires_at);

-- Enable Row Level Security
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can manage verification codes" ON verification_codes;
DROP POLICY IF EXISTS "Allow all operations for service role" ON verification_codes;

-- Create policy to allow service role to do everything
CREATE POLICY "Allow all operations for service role" ON verification_codes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Grant permissions to service role
GRANT ALL ON verification_codes TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;
