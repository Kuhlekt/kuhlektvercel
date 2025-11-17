-- Create promo codes table for Black Friday sale
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL,
  free_setup BOOLEAN DEFAULT false,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create promo code redemptions table
CREATE TABLE IF NOT EXISTS promo_code_redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  promo_code_id UUID REFERENCES promo_codes(id),
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company VARCHAR(255),
  phone VARCHAR(50),
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  form_submission_id UUID REFERENCES form_submitters(id)
);

-- Insert Black Friday promo code (6 days from now)
INSERT INTO promo_codes (code, discount_percent, free_setup, valid_from, valid_until, max_uses, is_active)
VALUES (
  'BLACKFRIDAY2024',
  50,
  true,
  NOW(),
  NOW() + INTERVAL '6 days',
  NULL,  -- unlimited uses
  true
);

-- Enable RLS
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_code_redemptions ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage
CREATE POLICY "Service role can manage promo codes"
ON promo_codes FOR ALL
TO service_role
USING (true);

CREATE POLICY "Service role can manage redemptions"
ON promo_code_redemptions FOR ALL
TO service_role
USING (true);

-- Allow public to read active promo codes
CREATE POLICY "Public can read active promo codes"
ON promo_codes FOR SELECT
TO anon, authenticated
USING (is_active = true AND NOW() BETWEEN valid_from AND valid_until);
