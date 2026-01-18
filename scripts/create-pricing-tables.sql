-- Create pricing_tiers table
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_name VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  usd_price DECIMAL(10, 2) NOT NULL,
  aud_price DECIMAL(10, 2) NOT NULL,
  usd_setup_fee DECIMAL(10, 2) DEFAULT 0,
  aud_setup_fee DECIMAL(10, 2) DEFAULT 0,
  billing_term VARCHAR(50) DEFAULT 'monthly',
  display_order INT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create pricing_features table
CREATE TABLE IF NOT EXISTS pricing_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name VARCHAR(255) NOT NULL UNIQUE,
  display_order INT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create pricing_feature_values table
CREATE TABLE IF NOT EXISTS pricing_feature_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pricing_feature_id UUID NOT NULL REFERENCES pricing_features(id) ON DELETE CASCADE,
  pricing_tier_id UUID NOT NULL REFERENCES pricing_tiers(id) ON DELETE CASCADE,
  value VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(pricing_feature_id, pricing_tier_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_is_active ON pricing_tiers(is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_features_is_active ON pricing_features(is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_feature_values_feature_id ON pricing_feature_values(pricing_feature_id);
CREATE INDEX IF NOT EXISTS idx_pricing_feature_values_tier_id ON pricing_feature_values(pricing_tier_id);
