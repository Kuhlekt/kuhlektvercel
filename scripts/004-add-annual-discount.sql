-- Add annual_discount column to pricing_tiers table if it doesn't exist
ALTER TABLE pricing_tiers 
ADD COLUMN IF NOT EXISTS annual_discount DECIMAL(5, 2) DEFAULT 15;

-- Set the default discount for existing tiers to 15% if not already set
UPDATE pricing_tiers 
SET annual_discount = 15 
WHERE annual_discount IS NULL;
