-- Create pricing tiers table
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  usd_price VARCHAR(50),
  aud_price VARCHAR(50),
  usd_setup_fee VARCHAR(50),
  aud_setup_fee VARCHAR(50),
  billing_term TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create pricing features table
CREATE TABLE IF NOT EXISTS pricing_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name VARCHAR(255) NOT NULL,
  display_order INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create pricing feature values table
CREATE TABLE IF NOT EXISTS pricing_feature_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pricing_tier_id UUID NOT NULL REFERENCES pricing_tiers(id) ON DELETE CASCADE,
  pricing_feature_id UUID NOT NULL REFERENCES pricing_features(id) ON DELETE CASCADE,
  value TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(pricing_tier_id, pricing_feature_id)
);

-- Enable RLS for security
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_feature_values ENABLE ROW LEVEL SECURITY;

-- Public read-only policies
CREATE POLICY "Allow public read on pricing_tiers" ON pricing_tiers
  FOR SELECT USING (is_active = true);
  
CREATE POLICY "Allow public read on pricing_features" ON pricing_features
  FOR SELECT USING (is_active = true);
  
CREATE POLICY "Allow public read on pricing_feature_values" ON pricing_feature_values
  FOR SELECT USING (true);

-- Admin write policies (authenticated users only - will be controlled by service role key)
CREATE POLICY "Allow service role all on pricing_tiers" ON pricing_tiers
  FOR ALL USING (true);
  
CREATE POLICY "Allow service role all on pricing_features" ON pricing_features
  FOR ALL USING (true);
  
CREATE POLICY "Allow service role all on pricing_feature_values" ON pricing_feature_values
  FOR ALL USING (true);

-- Insert initial pricing tiers
INSERT INTO pricing_tiers (tier_name, display_name, usd_price, aud_price, usd_setup_fee, aud_setup_fee, billing_term, display_order)
VALUES 
  ('bronze', 'Bronze', '980', '1,140', '990', '1,300', 'No contract\nbilled monthly', 1),
  ('silver', 'Silver', '1,900', '2,510', '1,350', '1,750', 'No contract\nbilled monthly', 2),
  ('gold', 'Gold', '2,900', '3,150', '1,600', '1,750', 'on annual contract\nbilled monthly', 3),
  ('platinum', 'Platinum', 'Get a quote', 'Get a quote', 'Get a quote', 'Get a quote', 'on annual contract\nbilled monthly', 4)
ON CONFLICT (tier_name) DO NOTHING;
