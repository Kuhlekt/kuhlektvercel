// Affiliate validation utility functions
// These are NOT server actions, just utility functions

export interface AffiliateInfo {
  code?: string
  name?: string
  isValid: boolean
  isActive?: boolean
  category?: string
  discountPercentage?: number
}

// Define affiliate codes and their information
const AFFILIATE_CODES: Record<string, AffiliateInfo> = {
  PARTNER001: {
    name: "Strategic Partner Alpha",
    isValid: true,
    isActive: true,
    category: "strategic",
    discountPercentage: 15,
  },
  PARTNER002: {
    name: "Channel Partner Beta",
    isValid: true,
    isActive: true,
    category: "channel",
    discountPercentage: 10,
  },
  PARTNER003: {
    name: "Referral Partner Gamma",
    isValid: true,
    isActive: true,
    category: "referral",
    discountPercentage: 5,
  },
  CONSULTANT001: {
    name: "Consulting Partner Delta",
    isValid: true,
    isActive: true,
    category: "consultant",
    discountPercentage: 12,
  },
  RESELLER001: {
    name: "Reseller Partner Epsilon",
    isValid: true,
    isActive: true,
    category: "reseller",
    discountPercentage: 8,
  },
  DEMO2024: {
    name: "Demo Special 2024",
    isValid: true,
    isActive: true,
    category: "promotion",
    discountPercentage: 20,
  },
  EARLY2024: {
    name: "Early Adopter 2024",
    isValid: true,
    isActive: true,
    category: "promotion",
    discountPercentage: 25,
  },
  STARTUP50: {
    name: "Startup Discount",
    isValid: true,
    isActive: true,
    category: "startup",
    discountPercentage: 50,
  },
}

// Valid affiliate codes array for quick lookup
const VALID_AFFILIATE_CODES = Object.keys(AFFILIATE_CODES)

/**
 * Validates an affiliate code and returns affiliate information
 * @param code - The affiliate code to validate
 * @returns AffiliateInfo object with validation result
 */
export function validateAffiliate(code: string): AffiliateInfo {
  const upperCode = code.toUpperCase().trim()
  const affiliate = AFFILIATE_CODES[upperCode as keyof typeof AFFILIATE_CODES]

  if (!affiliate) {
    return { isValid: false }
  }

  return {
    code: upperCode,
    name: affiliate.name,
    isValid: true,
    isActive: affiliate.isActive,
    category: affiliate.category,
    discountPercentage: affiliate.discountPercentage,
  }
}

/**
 * Simple validation function that returns boolean
 * @param code - The affiliate code to validate
 * @returns true if valid, false otherwise
 */
export function validateAffiliateCode(code: string): boolean {
  if (!code || typeof code !== "string") {
    return false
  }

  return VALID_AFFILIATE_CODES.includes(code.toUpperCase().trim())
}

/**
 * Gets the list of all valid affiliate codes (for admin use)
 * @returns Array of valid affiliate codes
 */
export function getValidAffiliateCodes(): string[] {
  return [...VALID_AFFILIATE_CODES]
}

/**
 * Normalizes an affiliate code to uppercase and trimmed
 * @param code - The affiliate code to normalize
 * @returns Normalized code
 */
export function normalizeAffiliateCode(code: string): string {
  return code.trim().toUpperCase()
}

/**
 * Formats an affiliate code for display
 * @param code - The affiliate code to format
 * @returns Formatted affiliate code
 */
export function formatAffiliateCode(code: string): string {
  return normalizeAffiliateCode(code)
}

/**
 * Gets detailed affiliate information for a code
 * @param code - The affiliate code to validate
 * @returns Object with isValid boolean and partner string if valid, null otherwise
 */
export function getAffiliateInfo(code: string): AffiliateInfo {
  if (!validateAffiliateCode(code)) {
    return { isValid: false }
  }

  const upperCode = normalizeAffiliateCode(code)
  const affiliate = AFFILIATE_CODES[upperCode as keyof typeof AFFILIATE_CODES]

  return {
    code: upperCode,
    name: affiliate.name,
    isValid: true,
    isActive: affiliate.isActive,
    category: affiliate.category,
    discountPercentage: affiliate.discountPercentage,
  }
}

export function getAllAffiliatePartners(): AffiliateInfo[] {
  return Object.values(AFFILIATE_CODES).filter((partner) => partner.isValid)
}

export function getAffiliatesByCategory(category: string): AffiliateInfo[] {
  return Object.values(AFFILIATE_CODES).filter((partner) => partner.isValid && partner.category === category)
}

export function getAllAffiliates(): AffiliateInfo[] {
  return Object.entries(AFFILIATE_CODES).map(([code, info]) => ({
    code,
    name: info.name || "",
    isValid: info.isValid,
    isActive: info.isActive || false,
    category: info.category || "",
    discountPercentage: info.discountPercentage || 0,
  }))
}

export function getActiveAffiliates(): AffiliateInfo[] {
  return getAllAffiliates().filter((affiliate) => affiliate.isActive)
}

export function isAffiliateCodeRequired(): boolean {
  return false // Affiliate codes are optional
}

export function getAffiliateDiscount(code: string): number {
  const normalizedCode = code.trim().toUpperCase()

  // Define discount percentages for different codes
  const discounts: Record<string, number> = {
    PARTNER001: 15,
    PARTNER002: 10,
    PARTNER003: 5,
    CONSULTANT001: 12,
    RESELLER001: 8,
    DEMO2024: 20,
    EARLY2024: 25,
    STARTUP50: 50,
  }

  return discounts[normalizedCode] || 0
}

export function getAllAffiliateCodes(): string[] {
  return Object.keys(AFFILIATE_CODES)
}
