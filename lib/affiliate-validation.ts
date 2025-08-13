// Affiliate validation utility functions
// These are NOT server actions, just utility functions

export interface AffiliateInfo {
  code?: string
  name?: string
  isValid: boolean
  isActive?: boolean
  category?: string
  discountPercentage?: number
  type?: string
}

export interface AffiliateData {
  affiliateId?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  referrer?: string
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
  RESELLER01: {
    name: "Reseller Partner One",
    isValid: true,
    isActive: true,
    category: "reseller",
    discountPercentage: 7,
  },
  RESELLER02: {
    name: "Reseller Partner Two",
    isValid: true,
    isActive: true,
    category: "reseller",
    discountPercentage: 6,
  },
  CHANNEL001: {
    name: "Channel Partner One",
    isValid: true,
    isActive: true,
    category: "channel",
    discountPercentage: 9,
  },
  CHANNEL002: {
    name: "Channel Partner Two",
    isValid: true,
    isActive: true,
    category: "channel",
    discountPercentage: 8,
  },
  DEMO001: {
    name: "Demo Special One",
    isValid: true,
    isActive: true,
    category: "promotion",
    discountPercentage: 18,
  },
  TRIAL001: {
    name: "Trial Special One",
    isValid: true,
    isActive: true,
    category: "promotion",
    discountPercentage: 15,
  },
}

// Valid affiliate codes array for quick lookup
const VALID_AFFILIATE_CODES = Object.keys(AFFILIATE_CODES)

const VALID_AFFILIATES = [
  "PARTNER001",
  "PARTNER002",
  "RESELLER01",
  "RESELLER02",
  "CHANNEL001",
  "CHANNEL002",
  "DEMO001",
  "TRIAL001",
]

/**
 * Validates an affiliate code and returns boolean
 * @param code - The affiliate code to validate
 * @returns true if valid, false otherwise
 */
export function validateAffiliate(code: string): boolean {
  if (!code || typeof code !== "string") {
    return false
  }

  const normalizedCode = code.toUpperCase().trim()
  return VALID_AFFILIATES.includes(normalizedCode)
}

/**
 * Simple validation function that returns boolean
 * @param code - The affiliate code to validate
 * @returns true if valid, false otherwise
 */
export function validateAffiliateCode(code: string): boolean {
  return validateAffiliate(code)
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
  if (!validateAffiliate(code)) {
    return { isValid: false }
  }

  const normalizedCode = normalizeAffiliateCode(code)
  const affiliate = AFFILIATE_CODES[normalizedCode as keyof typeof AFFILIATE_CODES]

  return {
    code: normalizedCode,
    name: affiliate.name,
    isValid: true,
    isActive: affiliate.isActive,
    category: affiliate.category,
    discountPercentage: affiliate.discountPercentage,
    type: normalizedCode.startsWith("PARTNER")
      ? "partner"
      : normalizedCode.startsWith("RESELLER")
        ? "reseller"
        : normalizedCode.startsWith("CHANNEL")
          ? "channel"
          : "other",
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
    type: code.startsWith("PARTNER")
      ? "partner"
      : code.startsWith("RESELLER")
        ? "reseller"
        : code.startsWith("CHANNEL")
          ? "channel"
          : "other",
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
    RESELLER01: 7,
    RESELLER02: 6,
    CHANNEL001: 9,
    CHANNEL002: 8,
    DEMO001: 18,
    TRIAL001: 15,
  }

  return discounts[normalizedCode] || 0
}

export function getAllAffiliateCodes(): string[] {
  return Object.keys(AFFILIATE_CODES)
}

/**
 * Validates an affiliate ID and returns boolean
 * @param affiliateId - The affiliate ID to validate
 * @returns true if valid, false otherwise
 */
export function validateAffiliateId(affiliateId: string): boolean {
  // Basic validation - affiliate ID should be alphanumeric and 6-20 characters
  const affiliateRegex = /^[a-zA-Z0-9]{6,20}$/
  return affiliateRegex.test(affiliateId)
}

/**
 * Extracts affiliate data from URL search parameters and referrer
 * @param searchParams - URL search parameters
 * @param referrer - Referrer URL
 * @returns AffiliateData object
 */
export function extractAffiliateData(searchParams: URLSearchParams, referrer?: string): AffiliateData {
  const affiliateId = searchParams.get("affiliate_id")
  const utmSource = searchParams.get("utm_source")
  const utmMedium = searchParams.get("utm_medium")
  const utmCampaign = searchParams.get("utm_campaign")

  return {
    affiliateId: affiliateId && validateAffiliateId(affiliateId) ? affiliateId : undefined,
    utmSource: utmSource || undefined,
    utmMedium: utmMedium || undefined,
    utmCampaign: utmCampaign || undefined,
    referrer: referrer || undefined,
  }
}

/**
 * Generates a tracking pixel URL with affiliate data
 * @param affiliateData - Affiliate data object
 * @returns Tracking pixel URL
 */
export function generateTrackingPixel(affiliateData: AffiliateData): string {
  const params = new URLSearchParams()

  if (affiliateData.affiliateId) {
    params.append("affiliate_id", affiliateData.affiliateId)
  }
  if (affiliateData.utmSource) {
    params.append("utm_source", affiliateData.utmSource)
  }
  if (affiliateData.utmMedium) {
    params.append("utm_medium", affiliateData.utmMedium)
  }
  if (affiliateData.utmCampaign) {
    params.append("utm_campaign", affiliateData.utmCampaign)
  }

  return `/api/track-conversion?${params.toString()}`
}

/**
 * Validates if the referrer is from a trusted domain
 * @param referrer - Referrer URL
 * @returns true if referrer is trusted, false otherwise
 */
export function isValidReferrer(referrer: string): boolean {
  try {
    const url = new URL(referrer)
    // Add your trusted referrer domains here
    const trustedDomains = [
      "google.com",
      "bing.com",
      "yahoo.com",
      "duckduckgo.com",
      "linkedin.com",
      "twitter.com",
      "facebook.com",
    ]

    return trustedDomains.some((domain) => url.hostname.includes(domain))
  } catch {
    return false
  }
}
