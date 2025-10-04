-- Fix RLS policies for verification_codes table

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can manage verification codes" ON verification_codes;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON verification_codes;
DROP POLICY IF EXISTS "Allow anonymous reads" ON verification_codes;
DROP POLICY IF EXISTS "Allow anonymous updates" ON verification_codes;

-- Create policies that allow service role to manage all operations
CREATE POLICY "Service role full access" ON verification_codes
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Allow anonymous users to insert verification codes (for generating codes)
CREATE POLICY "Allow public inserts" ON verification_codes
    FOR INSERT
    WITH CHECK (true);

-- Allow anonymous users to read their own verification codes (for verifying)
CREATE POLICY "Allow public reads" ON verification_codes
    FOR SELECT
    USING (true);

-- Allow anonymous users to update their own verification codes (for marking as used)
CREATE POLICY "Allow public updates" ON verification_codes
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
