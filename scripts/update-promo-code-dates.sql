-- Update the BLACKFRIDAY2024 promo code with correct dates
-- Starts today and ends midnight Monday December 1st, 2024

UPDATE promo_codes
SET 
  valid_from = NOW(),
  valid_until = '2024-12-02 00:00:00+00'::timestamptz,  -- Midnight Monday Dec 1st (start of Dec 2nd UTC)
  is_active = true
WHERE code = 'BLACKFRIDAY2024';

-- If the promo code doesn't exist yet, insert it
INSERT INTO promo_codes (code, discount_percent, free_setup, valid_from, valid_until, is_active, description)
VALUES (
  'BLACKFRIDAY2024',
  50,
  true,
  NOW(),
  '2024-12-02 00:00:00+00'::timestamptz,
  true,
  'Black Friday Sale - 50% off first year + free setup (ends midnight Monday December 1st)'
)
ON CONFLICT (code) DO UPDATE
SET 
  valid_from = EXCLUDED.valid_from,
  valid_until = EXCLUDED.valid_until,
  is_active = EXCLUDED.is_active,
  description = EXCLUDED.description;
