// Affiliate validation utility functions
// These are NOT server actions, just utility functions

interface AffiliateInfo {
  isValid: boolean
  name?: string
  discount?: number
  category?: string
  isActive?: boolean
  code?: string
}

// Define affiliate codes and their information
const AFFILIATE_CODES = {
  PARTNER001: { name: "Strategic Partner A", discount: 15, category: "strategic", isActive: true },
  PARTNER002: { name: "Strategic Partner B", discount: 12, category: "strategic", isActive: true },
  RESELLER001: { name: "Reseller Partner A", discount: 10, category: "reseller", isActive: true },
  RESELLER002: { name: "Reseller Partner B", discount: 8, category: "reseller", isActive: true },
  CONSULTANT001: { name: "Consultant Partner A", discount: 5, category: "consultant", isActive: true },
  CONSULTANT002: { name: "Consultant Partner B", discount: 5, category: "consultant", isActive: true },
  REFERRAL001: { name: "Referral Partner A", discount: 3, category: "referral", isActive: true },
  REFERRAL002: { name: "Referral Partner B", discount: 3, category: "referral", isActive: true },
  TRIAL001: { name: "Trial Partner", discount: 0, category: "trial", isActive: true },
  DEMO001: { name: "Demo Partner", discount: 0, category: "demo", isActive: true },
} as const

// Valid affiliate codes array
const VALID_AFFILIATE_CODES = Object.keys(AFFILIATE_CODES)

// Affiliate partners object for additional functionality
const affiliatePartners: Record<string, AffiliateInfo> = {}

// Initialize affiliate partners
Object.entries(AFFILIATE_CODES).forEach(([code, info]) => {
  affiliatePartners[code] = {
    isValid: true,
    code,
    name: info.name,
    discount: info.discount,
    category: info.category,
    isActive: info.isActive,
  }
})

/**
 * Validates an affiliate code and returns affiliate information
 * @param code - The affiliate code to validate
 * @returns true if valid, false otherwise
 */
export function validateAffiliate(code: string): AffiliateInfo {
  const upperCode = code.toUpperCase().trim()
  const affiliate = AFFILIATE_CODES[upperCode as keyof typeof AFFILIATE_CODES]

  if (affiliate) {
    return {
      isValid: true,
      name: affiliate.name,
      discount: affiliate.discount,
      category: affiliate.category,
      isActive: affiliate.isActive,
      code: upperCode,
    }
  }

  return { isValid: false }
}

/**
 * Simple validation function for affiliate codes
 * @param code - The affiliate code to validate
 * @returns The validated code in uppercase or null if invalid
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
 * Gets affiliate information for a given code
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
    isValid: true,
    name: affiliate.name,
    discount: affiliate.discount,
    category: affiliate.category,
    isActive: affiliate.isActive,
    code: upperCode,
  }
}

export function getAllAffiliatePartners(): AffiliateInfo[] {
  return Object.values(affiliatePartners).filter((partner) => partner.isValid)
}

export function getAffiliatesByCategory(category: string): AffiliateInfo[] {
  return Object.values(affiliatePartners).filter((partner) => partner.isValid && partner.category === category)
}

export function getAllAffiliates(): AffiliateInfo[] {
  return Object.entries(AFFILIATE_CODES).map(([code, info]) => ({
    code,
    name: info.name || "",
    discount: info.discount || 0,
    category: info.category || "",
    isActive: info.isActive || false,
    isValid: true,
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
    PARTNER002: 12,
    RESELLER001: 10,
    RESELLER002: 8,
    CONSULTANT001: 5,
    CONSULTANT002: 5,
    REFERRAL001: 3,
    REFERRAL002: 3,
    TRIAL001: 0,
    DEMO001: 0,
  }

  return discounts[normalizedCode] || 0
}

export function getAllAffiliateCodes(): string[] {
  return Object.keys(AFFILIATE_CODES)
}
