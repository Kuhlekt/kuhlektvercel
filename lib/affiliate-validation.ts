// Affiliate validation system for Kuhlekt
export interface AffiliateInfo {
  code: string
  discount: number
  type: string
  description: string
  isValid: boolean
}

// Predefined affiliate codes with their respective discounts and types
const AFFILIATE_CODES: Record<string, Omit<AffiliateInfo, "isValid">> = {
  // Startup and Growth codes
  STARTUP50: {
    code: "STARTUP50",
    discount: 50,
    type: "Startup",
    description: "Special 50% discount for startup companies",
  },
  GROWTH25: {
    code: "GROWTH25",
    discount: 25,
    type: "Growth",
    description: "25% discount for growing businesses",
  },
  SMB40: {
    code: "SMB40",
    discount: 40,
    type: "Small Business",
    description: "40% discount for small and medium businesses",
  },

  // Industry-specific codes
  HEALTHCARE: {
    code: "HEALTHCARE",
    discount: 15,
    type: "Industry",
    description: "Healthcare industry discount",
  },
  MANUFACTURING: {
    code: "MANUFACTURING",
    discount: 20,
    type: "Industry",
    description: "Manufacturing industry discount",
  },
  NONPROFIT: {
    code: "NONPROFIT",
    discount: 30,
    type: "Industry",
    description: "Non-profit organization discount",
  },
  EDUCATION: {
    code: "EDUCATION",
    discount: 35,
    type: "Industry",
    description: "Educational institution discount",
  },
  GOVERNMENT: {
    code: "GOVERNMENT",
    discount: 25,
    type: "Industry",
    description: "Government agency discount",
  },

  // Partner codes
  PARTNER001: {
    code: "PARTNER001",
    discount: 20,
    type: "Partner",
    description: "Certified partner discount",
  },
  PARTNER002: {
    code: "PARTNER002",
    discount: 25,
    type: "Partner",
    description: "Premium partner discount",
  },
  RESELLER01: {
    code: "RESELLER01",
    discount: 30,
    type: "Reseller",
    description: "Authorized reseller discount",
  },
  CHANNEL01: {
    code: "CHANNEL01",
    discount: 25,
    type: "Channel",
    description: "Channel partner discount",
  },

  // Promotional codes
  DISCOUNT20: {
    code: "DISCOUNT20",
    discount: 20,
    type: "Promotional",
    description: "Limited time 20% discount",
  },
  PROMO2024: {
    code: "PROMO2024",
    discount: 15,
    type: "Promotional",
    description: "2024 promotional discount",
  },
  WELCOME15: {
    code: "WELCOME15",
    discount: 15,
    type: "Welcome",
    description: "Welcome discount for new customers",
  },
  SPECIAL01: {
    code: "SPECIAL01",
    discount: 30,
    type: "Special",
    description: "Special event discount",
  },

  // VIP and Premium codes
  VIP30: {
    code: "VIP30",
    discount: 30,
    type: "VIP",
    description: "VIP customer discount",
  },
  PREMIUM15: {
    code: "PREMIUM15",
    discount: 15,
    type: "Premium",
    description: "Premium service discount",
  },
  ENTERPRISE: {
    code: "ENTERPRISE",
    discount: 10,
    type: "Enterprise",
    description: "Enterprise customer discount",
  },

  // Referral and loyalty codes
  REFERRAL10: {
    code: "REFERRAL10",
    discount: 10,
    type: "Referral",
    description: "Customer referral discount",
  },
  LOYALTY25: {
    code: "LOYALTY25",
    discount: 25,
    type: "Loyalty",
    description: "Loyalty program discount",
  },

  // Beta and early access codes
  BETA35: {
    code: "BETA35",
    discount: 35,
    type: "Beta",
    description: "Beta tester discount",
  },
  EARLY45: {
    code: "EARLY45",
    discount: 45,
    type: "Early Access",
    description: "Early access customer discount",
  },

  // Legacy codes
  AFFILIATE01: {
    code: "AFFILIATE01",
    discount: 20,
    type: "Affiliate",
    description: "General affiliate discount",
  },
}

/**
 * Validates an affiliate code and returns affiliate information
 * @param code - The affiliate code to validate
 * @returns AffiliateInfo object with validation result
 */
export function validateAffiliate(code: string): AffiliateInfo {
  if (!code || typeof code !== "string") {
    return {
      code: "",
      discount: 0,
      type: "",
      description: "",
      isValid: false,
    }
  }

  const normalizedCode = code.trim().toUpperCase()
  const affiliateData = AFFILIATE_CODES[normalizedCode]

  if (affiliateData) {
    return {
      ...affiliateData,
      isValid: true,
    }
  }

  return {
    code: normalizedCode,
    discount: 0,
    type: "",
    description: "Invalid affiliate code",
    isValid: false,
  }
}

/**
 * Gets all available affiliate codes (for admin purposes)
 * @returns Array of all affiliate codes
 */
export function getAllAffiliateCodes(): AffiliateInfo[] {
  return Object.values(AFFILIATE_CODES).map((code) => ({
    ...code,
    isValid: true,
  }))
}

/**
 * Gets affiliate codes by type
 * @param type - The type of affiliate codes to retrieve
 * @returns Array of affiliate codes of the specified type
 */
export function getAffiliateCodesByType(type: string): AffiliateInfo[] {
  return Object.values(AFFILIATE_CODES)
    .filter((code) => code.type.toLowerCase() === type.toLowerCase())
    .map((code) => ({
      ...code,
      isValid: true,
    }))
}

/**
 * Checks if an affiliate code exists
 * @param code - The affiliate code to check
 * @returns boolean indicating if the code exists
 */
export function affiliateCodeExists(code: string): boolean {
  if (!code || typeof code !== "string") {
    return false
  }

  const normalizedCode = code.trim().toUpperCase()
  return normalizedCode in AFFILIATE_CODES
}

/**
 * Gets the discount percentage for a valid affiliate code
 * @param code - The affiliate code
 * @returns The discount percentage (0 if invalid)
 */
export function getAffiliateDiscount(code: string): number {
  const affiliate = validateAffiliate(code)
  return affiliate.isValid ? affiliate.discount : 0
}
