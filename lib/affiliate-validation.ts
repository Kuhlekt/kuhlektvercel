// Affiliate validation system for Kuhlekt
export interface AffiliateCode {
  code: string
  discount: number
  category: string
  description: string
  active: boolean
}

export const AFFILIATE_CODES: AffiliateCode[] = [
  // Startup & Growth
  { code: "STARTUP50", discount: 50, category: "startup", description: "50% off for startups", active: true },
  { code: "GROWTH25", discount: 25, category: "startup", description: "25% off for growing businesses", active: true },
  {
    code: "SMB40",
    discount: 40,
    category: "startup",
    description: "40% off for small-medium businesses",
    active: true,
  },
  { code: "EARLY45", discount: 45, category: "startup", description: "45% off for early adopters", active: true },
  { code: "BETA35", discount: 35, category: "startup", description: "35% off for beta participants", active: true },

  // Industry Specific
  {
    code: "HEALTHCARE",
    discount: 15,
    category: "industry",
    description: "15% off for healthcare organizations",
    active: true,
  },
  {
    code: "MANUFACTURING",
    discount: 20,
    category: "industry",
    description: "20% off for manufacturing companies",
    active: true,
  },
  {
    code: "NONPROFIT",
    discount: 30,
    category: "industry",
    description: "30% off for non-profit organizations",
    active: true,
  },
  {
    code: "EDUCATION",
    discount: 35,
    category: "industry",
    description: "35% off for educational institutions",
    active: true,
  },
  {
    code: "GOVERNMENT",
    discount: 25,
    category: "industry",
    description: "25% off for government agencies",
    active: true,
  },

  // Partners & Channels
  {
    code: "PARTNER001",
    discount: 20,
    category: "partner",
    description: "20% off for strategic partners",
    active: true,
  },
  { code: "PARTNER002", discount: 25, category: "partner", description: "25% off for premium partners", active: true },
  { code: "RESELLER01", discount: 30, category: "partner", description: "30% off for reseller partners", active: true },
  { code: "CHANNEL01", discount: 25, category: "partner", description: "25% off for channel partners", active: true },
  {
    code: "AFFILIATE01",
    discount: 15,
    category: "partner",
    description: "15% off for affiliate partners",
    active: true,
  },

  // Promotional
  { code: "PROMO2024", discount: 15, category: "promotional", description: "15% off promotional offer", active: true },
  { code: "SPECIAL01", discount: 20, category: "promotional", description: "20% off special promotion", active: true },
  { code: "WELCOME15", discount: 15, category: "promotional", description: "15% off welcome offer", active: true },
  { code: "DISCOUNT20", discount: 20, category: "promotional", description: "20% off general discount", active: true },
  { code: "REFERRAL10", discount: 10, category: "promotional", description: "10% off referral bonus", active: true },

  // VIP & Premium
  { code: "VIP30", discount: 30, category: "vip", description: "30% off for VIP customers", active: true },
  { code: "PREMIUM15", discount: 15, category: "vip", description: "15% off for premium customers", active: true },
  { code: "ENTERPRISE", discount: 10, category: "vip", description: "10% off for enterprise customers", active: true },
  { code: "LOYALTY25", discount: 25, category: "vip", description: "25% off loyalty reward", active: true },
]

/**
 * Validates an affiliate code and returns affiliate information
 * @param code - The affiliate code to validate
 * @returns AffiliateCode object with validation result or null if invalid
 */
export function validateAffiliateCode(code: string): AffiliateCode | null {
  if (!code || typeof code !== "string") {
    return null
  }

  const normalizedCode = code.trim().toUpperCase()
  const affiliateCode = AFFILIATE_CODES.find((ac) => ac.code === normalizedCode && ac.active)

  return affiliateCode || null
}

/**
 * Gets the discount percentage for a valid affiliate code
 * @param code - The affiliate code
 * @returns The discount percentage (0 if invalid)
 */
export function getAffiliateDiscount(code: string): number {
  const affiliateCode = validateAffiliateCode(code)
  return affiliateCode ? affiliateCode.discount : 0
}

/**
 * Gets affiliate codes by category
 * @param category - The category of affiliate codes to retrieve
 * @returns Array of affiliate codes of the specified category
 */
export function getAffiliatesByCategory(category: string): AffiliateCode[] {
  return AFFILIATE_CODES.filter((ac) => ac.category === category && ac.active)
}

/**
 * Gets all active affiliate codes (for admin purposes)
 * @returns Array of all active affiliate codes
 */
export function getAllActiveAffiliateCodes(): AffiliateCode[] {
  return AFFILIATE_CODES.filter((ac) => ac.active)
}
