-- Create verification codes table
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '15 minutes')
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);

-- Create index on expires_at for cleanup
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires ON verification_codes(expires_at);

-- Enable Row Level Security
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to do everything
CREATE POLICY "Service role can manage verification codes" ON verification_codes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to cleanup expired codes
CREATE OR REPLACE FUNCTION cleanup_expired_verification_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM verification_codes WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
