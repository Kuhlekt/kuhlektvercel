-- Create table for ROI calculator email verification codes
CREATE TABLE IF NOT EXISTS roi_verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  calculator_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Create index on email and code for faster lookups
CREATE INDEX IF NOT EXISTS idx_roi_verification_email_code ON roi_verification_codes(email, code);

-- Create index on expires_at for cleanup queries
CREATE INDEX IF NOT EXISTS idx_roi_verification_expires ON roi_verification_codes(expires_at);

-- Add comment to table
COMMENT ON TABLE roi_verification_codes IS 'Stores verification codes for ROI calculator email verification';
