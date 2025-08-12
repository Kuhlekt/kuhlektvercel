// Affiliate validation table with codes and their associated discounts
export const AFFILIATE_CODES = {
  // Partner codes
  PARTNER001: { discount: 15, description: "Partner Program - 15% discount" },
  PARTNER002: { discount: 20, description: "Premium Partner - 20% discount" },
  RESELLER01: { discount: 25, description: "Reseller Program - 25% discount" },
  CHANNEL01: { discount: 18, description: "Channel Partner - 18% discount" },

  // Discount codes
  DISCOUNT10: { discount: 10, description: "General Discount - 10% off" },
  DISCOUNT15: { discount: 15, description: "Special Discount - 15% off" },
  DISCOUNT20: { discount: 20, description: "Premium Discount - 20% off" },

  // Startup and growth codes
  STARTUP50: { discount: 50, description: "Startup Program - 50% discount" },
  STARTUP25: { discount: 25, description: "Startup Discount - 25% off" },
  GROWTH25: { discount: 25, description: "Growth Program - 25% discount" },

  // Welcome and premium codes
  WELCOME20: { discount: 20, description: "Welcome Offer - 20% discount" },
  PREMIUM15: { discount: 15, description: "Premium Customer - 15% off" },
  FIRSTTIME: { discount: 30, description: "First Time Customer - 30% off" },

  // Industry specific codes
  HEALTHCARE: { discount: 20, description: "Healthcare Industry - 20% discount" },
  EDUCATION: { discount: 35, description: "Education Sector - 35% discount" },
  NONPROFIT: { discount: 40, description: "Non-Profit Organization - 40% discount" },

  // Seasonal codes
  SUMMER2024: { discount: 15, description: "Summer 2024 Promotion - 15% off" },
  HOLIDAY25: { discount: 25, description: "Holiday Special - 25% discount" },
  NEWYEAR: { discount: 30, description: "New Year Offer - 30% off" },
} as const

export type AffiliateCode = keyof typeof AFFILIATE_CODES

export interface AffiliateInfo {
  discount: number
  description: string
}

/**
 * Validates an affiliate code and returns discount information
 */
export function validateAffiliateCode(code: string): { isValid: boolean; info?: AffiliateInfo } {
  if (!code || typeof code !== "string") {
    return { isValid: false }
  }

  // Normalize the code (uppercase, trim whitespace)
  const normalizedCode = code.trim().toUpperCase() as AffiliateCode

  if (normalizedCode in AFFILIATE_CODES) {
    return {
      isValid: true,
      info: AFFILIATE_CODES[normalizedCode],
    }
  }

  return { isValid: false }
}

/**
 * Gets all available affiliate codes (for admin purposes)
 */
export function getAllAffiliateCodes(): Record<string, AffiliateInfo> {
  return AFFILIATE_CODES
}

/**
 * Calculates the discounted price based on affiliate code
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  affiliateCode: string,
): {
  originalPrice: number
  discountPercent: number
  discountAmount: number
  finalPrice: number
} {
  const validation = validateAffiliateCode(affiliateCode)

  if (!validation.isValid || !validation.info) {
    return {
      originalPrice,
      discountPercent: 0,
      discountAmount: 0,
      finalPrice: originalPrice,
    }
  }

  const discountPercent = validation.info.discount
  const discountAmount = (originalPrice * discountPercent) / 100
  const finalPrice = originalPrice - discountAmount

  return {
    originalPrice,
    discountPercent,
    discountAmount,
    finalPrice,
  }
}
