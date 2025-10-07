-- Fix RLS policies for verification_codes table
-- This allows the application to insert, select, and update verification codes

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert" ON verification_codes;
DROP POLICY IF EXISTS "Allow public select" ON verification_codes;
DROP POLICY IF EXISTS "Allow public update" ON verification_codes;

-- Enable RLS
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (needed for verification flow)
CREATE POLICY "Allow public insert"
  ON verification_codes
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public select"
  ON verification_codes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public update"
  ON verification_codes
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE verification_codes IS 'Stores verification codes for ROI calculator with public RLS policies';
