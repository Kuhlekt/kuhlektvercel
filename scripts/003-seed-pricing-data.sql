-- Seed initial pricing tiers
INSERT INTO pricing_tiers (id, tier_name, display_name, usd_price, aud_price, usd_setup_fee, aud_setup_fee, billing_term, display_order, is_active)
VALUES 
  (gen_random_uuid(), 'bronze', 'Bronze', '980', '1,140', '990', '1,300', 'No contract billed monthly', 1, true),
  (gen_random_uuid(), 'silver', 'Silver', '1,900', '2,510', '1,350', '1,750', 'No contract billed monthly', 2, true),
  (gen_random_uuid(), 'gold', 'Gold', '2,900', '3,150', '1,600', '1,750', 'on annual contract billed monthly', 3, true),
  (gen_random_uuid(), 'platinum', 'Platinum', 'Get a quote', 'Get a quote', 'Get a quote', 'Get a quote', 'on annual contract billed monthly', 4, true)
ON CONFLICT (id) DO NOTHING;

-- Get tier IDs for feature values
DO $$
DECLARE
  bronze_id uuid;
  silver_id uuid;
  gold_id uuid;
  platinum_id uuid;
  feature_id uuid;
BEGIN
  SELECT id INTO bronze_id FROM pricing_tiers WHERE tier_name = 'bronze' LIMIT 1;
  SELECT id INTO silver_id FROM pricing_tiers WHERE tier_name = 'silver' LIMIT 1;
  SELECT id INTO gold_id FROM pricing_tiers WHERE tier_name = 'gold' LIMIT 1;
  SELECT id INTO platinum_id FROM pricing_tiers WHERE tier_name = 'platinum' LIMIT 1;

  -- Insert features and their values
  -- Feature 1: Minimum
  INSERT INTO pricing_features (id, feature_name, display_order, is_active) 
  VALUES (gen_random_uuid(), 'Minimum', 1, true) RETURNING id INTO feature_id;
  INSERT INTO pricing_feature_values (id, pricing_feature_id, pricing_tier_id, value) VALUES
    (gen_random_uuid(), feature_id, bronze_id, '1 Admin user'),
    (gen_random_uuid(), feature_id, silver_id, '1 Admin user'),
    (gen_random_uuid(), feature_id, gold_id, '1 Admin user'),
    (gen_random_uuid(), feature_id, platinum_id, '1 Admin user');

  -- Feature 2: Maximum Core Users
  INSERT INTO pricing_features (id, feature_name, display_order, is_active) 
  VALUES (gen_random_uuid(), 'Maximum Core Users', 2, true) RETURNING id INTO feature_id;
  INSERT INTO pricing_feature_values (id, pricing_feature_id, pricing_tier_id, value) VALUES
    (gen_random_uuid(), feature_id, bronze_id, '5 Core users'),
    (gen_random_uuid(), feature_id, silver_id, '10 Core users'),
    (gen_random_uuid(), feature_id, gold_id, '15 Core users'),
    (gen_random_uuid(), feature_id, platinum_id, '∞ Users');

  -- Feature 3: Maximum Sales Users
  INSERT INTO pricing_features (id, feature_name, display_order, is_active) 
  VALUES (gen_random_uuid(), 'Maximum Sales Users', 3, true) RETURNING id INTO feature_id;
  INSERT INTO pricing_feature_values (id, pricing_feature_id, pricing_tier_id, value) VALUES
    (gen_random_uuid(), feature_id, bronze_id, '20 Sales users'),
    (gen_random_uuid(), feature_id, silver_id, '30 Sales users'),
    (gen_random_uuid(), feature_id, gold_id, '40 Sales users'),
    (gen_random_uuid(), feature_id, platinum_id, '∞ Sales');

  -- Feature 4: CSV SFTP load only
  INSERT INTO pricing_features (id, feature_name, display_order, is_active) 
  VALUES (gen_random_uuid(), 'CSV SFTP load only', 4, true) RETURNING id INTO feature_id;
  INSERT INTO pricing_feature_values (id, pricing_feature_id, pricing_tier_id, value) VALUES
    (gen_random_uuid(), feature_id, bronze_id, 'true'),
    (gen_random_uuid(), feature_id, silver_id, 'true'),
    (gen_random_uuid(), feature_id, gold_id, 'Options'),
    (gen_random_uuid(), feature_id, platinum_id, 'Options');

  -- Feature 5: Unlimited accounts
  INSERT INTO pricing_features (id, feature_name, display_order, is_active) 
  VALUES (gen_random_uuid(), 'Unlimited accounts', 5, true) RETURNING id INTO feature_id;
  INSERT INTO pricing_feature_values (id, pricing_feature_id, pricing_tier_id, value) VALUES
    (gen_random_uuid(), feature_id, bronze_id, 'true'),
    (gen_random_uuid(), feature_id, silver_id, 'true'),
    (gen_random_uuid(), feature_id, gold_id, 'true'),
    (gen_random_uuid(), feature_id, platinum_id, 'true');

  -- Feature 6: Unlimited open items
  INSERT INTO pricing_features (id, feature_name, display_order, is_active) 
  VALUES (gen_random_uuid(), 'Unlimited open items', 6, true) RETURNING id INTO feature_id;
  INSERT INTO pricing_feature_values (id, pricing_feature_id, pricing_tier_id, value) VALUES
    (gen_random_uuid(), feature_id, bronze_id, 'true'),
    (gen_random_uuid(), feature_id, silver_id, 'true'),
    (gen_random_uuid(), feature_id, gold_id, 'true'),
    (gen_random_uuid(), feature_id, platinum_id, 'true');

  -- Feature 7: Regions / Businesses
  INSERT INTO pricing_features (id, feature_name, display_order, is_active) 
  VALUES (gen_random_uuid(), 'Regions / Businesses', 7, true) RETURNING id INTO feature_id;
  INSERT INTO pricing_feature_values (id, pricing_feature_id, pricing_tier_id, value) VALUES
    (gen_random_uuid(), feature_id, bronze_id, '1'),
    (gen_random_uuid(), feature_id, silver_id, '2'),
    (gen_random_uuid(), feature_id, gold_id, '3'),
    (gen_random_uuid(), feature_id, platinum_id, 'Unlimited');

  -- Feature 8: Kuhlekt collection management platform
  INSERT INTO pricing_features (id, feature_name, display_order, is_active) 
  VALUES (gen_random_uuid(), 'Kuhlekt collection management platform', 8, true) RETURNING id INTO feature_id;
  INSERT INTO pricing_feature_values (id, pricing_feature_id, pricing_tier_id, value) VALUES
    (gen_random_uuid(), feature_id, bronze_id, 'true'),
    (gen_random_uuid(), feature_id, silver_id, 'true'),
    (gen_random_uuid(), feature_id, gold_id, 'true'),
    (gen_random_uuid(), feature_id, platinum_id, 'true');

  -- Feature 9: Multiple dunning procedures
  INSERT INTO pricing_features (id, feature_name, display_order, is_active) 
  VALUES (gen_random_uuid(), 'Multiple dunning procedures', 9, true) RETURNING id INTO feature_id;
  INSERT INTO pricing_feature_values (id, pricing_feature_id, pricing_tier_id, value) VALUES
    (gen_random_uuid(), feature_id, bronze_id, 'true'),
    (gen_random_uuid(), feature_id, silver_id, 'true'),
    (gen_random_uuid(), feature_id, gold_id, 'true'),
    (gen_random_uuid(), feature_id, platinum_id, 'true');

  -- Feature 10: Escalations
  INSERT INTO pricing_features (id, feature_name, display_order, is_active) 
  VALUES (gen_random_uuid(), 'Escalations', 10, true) RETURNING id INTO feature_id;
  INSERT INTO pricing_feature_values (id, pricing_feature_id, pricing_tier_id, value) VALUES
    (gen_random_uuid(), feature_id, bronze_id, 'true'),
    (gen_random_uuid(), feature_id, silver_id, 'true'),
    (gen_random_uuid(), feature_id, gold_id, 'true'),
    (gen_random_uuid(), feature_id, platinum_id, 'true');

  -- Feature 11: Provisioning
  INSERT INTO pricing_features (id, feature_name, display_order, is_active) 
  VALUES (gen_random_uuid(), 'Provisioning', 11, true) RETURNING id INTO feature_id;
  INSERT INTO pricing_feature_values (id, pricing_feature_id, pricing_tier_id, value) VALUES
    (gen_random_uuid(), feature_id, bronze_id, 'true'),
    (gen_random_uuid(), feature_id, silver_id, 'true'),
    (gen_random_uuid(), feature_id, gold_id, 'true'),
    (gen_random_uuid(), feature_id, platinum_id, 'true');

  -- Feature 12: Dispute workflow management
  INSERT INTO pricing_features (id, feature_name, display_order, is_active) 
  VALUES (gen_random_uuid(), 'Dispute workflow management', 12, true) RETURNING id INTO feature_id;
  INSERT INTO pricing_feature_values (id, pricing_feature_id, pricing_tier_id, value) VALUES
    (gen_random_uuid(), feature_id, bronze_id, 'true'),
    (gen_random_uuid(), feature_id, silver_id, 'true'),
    (gen_random_uuid(), feature_id, gold_id, 'true'),
    (gen_random_uuid(), feature_id, platinum_id, 'true');

  -- Feature 13: Kuhlekt portal
  INSERT INTO pricing_features (id, feature_name, display_order, is_active) 
  VALUES (gen_random_uuid(), 'Kuhlekt portal', 13, true) RETURNING id INTO feature_id;
  INSERT INTO pricing_feature_values (id, pricing_feature_id, pricing_tier_id, value) VALUES
    (gen_random_uuid(), feature_id, bronze_id, '$250'),
    (gen_random_uuid(), feature_id, silver_id, '$175 USD / $150 AUD'),
    (gen_random_uuid(), feature_id, gold_id, 'true'),
    (gen_random_uuid(), feature_id, platinum_id, 'true');

  -- Feature 14: Payments
  INSERT INTO pricing_features (id, feature_name, display_order, is_active) 
  VALUES (gen_random_uuid(), 'Payments', 14, true) RETURNING id INTO feature_id;
  INSERT INTO pricing_feature_values (id, pricing_feature_id, pricing_tier_id, value) VALUES
    (gen_random_uuid(), feature_id, bronze_id, 'false'),
    (gen_random_uuid(), feature_id, silver_id, 'true'),
    (gen_random_uuid(), feature_id, gold_id, 'true'),
    (gen_random_uuid(), feature_id, platinum_id, 'true');

  -- Feature 15: Direct Debits
  INSERT INTO pricing_features (id, feature_name, display_order, is_active) 
  VALUES (gen_random_uuid(), 'Direct Debits', 15, true) RETURNING id INTO feature_id;
  INSERT INTO pricing_feature_values (id, pricing_feature_id, pricing_tier_id, value) VALUES
    (gen_random_uuid(), feature_id, bronze_id, 'false'),
    (gen_random_uuid(), feature_id, silver_id, 'true'),
    (gen_random_uuid(), feature_id, gold_id, 'true'),
    (gen_random_uuid(), feature_id, platinum_id, 'true');

END $$;
