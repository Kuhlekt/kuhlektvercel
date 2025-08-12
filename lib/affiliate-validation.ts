interface AffiliateCode {
  code: string
  discount: number
  type: string
  description: string
}

// Predefined affiliate codes with their discount percentages
const AFFILIATE_CODES: AffiliateCode[] = [
  // Partner codes
  { code: "PARTNER001", discount: 25, type: "Partner", description: "Strategic Partner Discount" },
  { code: "PARTNER002", discount: 30, type: "Partner", description: "Premium Partner Discount" },
  { code: "PARTNER003", discount: 20, type: "Partner", description: "Regional Partner Discount" },

  // Reseller codes
  { code: "RESELLER01", discount: 35, type: "Reseller", description: "Authorized Reseller Discount" },
  { code: "RESELLER02", discount: 40, type: "Reseller", description: "Premium Reseller Discount" },
  { code: "CHANNEL01", discount: 30, type: "Channel", description: "Channel Partner Discount" },

  // Discount codes
  { code: "DISCOUNT10", discount: 10, type: "Promotional", description: "10% Promotional Discount" },
  { code: "DISCOUNT15", discount: 15, type: "Promotional", description: "15% Promotional Discount" },
  { code: "DISCOUNT20", discount: 20, type: "Promotional", description: "20% Promotional Discount" },

  // Industry-specific codes
  { code: "HEALTHCARE", discount: 15, type: "Industry", description: "Healthcare Industry Discount" },
  { code: "MANUFACTURING", discount: 20, type: "Industry", description: "Manufacturing Industry Discount" },
  { code: "RETAIL", discount: 15, type: "Industry", description: "Retail Industry Discount" },
  { code: "FINTECH", discount: 25, type: "Industry", description: "FinTech Industry Discount" },

  // Special codes
  { code: "STARTUP50", discount: 50, type: "Startup", description: "Startup Special Discount" },
  { code: "GROWTH25", discount: 25, type: "Growth", description: "Growth Stage Company Discount" },
  { code: "ENTERPRISE", discount: 15, type: "Enterprise", description: "Enterprise Client Discount" },
  { code: "NONPROFIT", discount: 40, type: "Nonprofit", description: "Nonprofit Organization Discount" },

  // Welcome codes
  { code: "WELCOME20", discount: 20, type: "Welcome", description: "New Customer Welcome Discount" },
  { code: "FIRSTTIME", discount: 15, type: "Welcome", description: "First Time Customer Discount" },
  { code: "NEWCLIENT", discount: 18, type: "Welcome", description: "New Client Discount" },

  // Premium codes
  { code: "PREMIUM15", discount: 15, type: "Premium", description: "Premium Service Discount" },
  { code: "VIP30", discount: 30, type: "VIP", description: "VIP Client Discount" },
  { code: "PLATINUM", discount: 35, type: "Platinum", description: "Platinum Member Discount" },
]

interface AffiliateValidationResult {
  isValid: boolean
  code?: string
  discount?: number
  type?: string
  description?: string
  normalizedCode?: string
}

export function validateAffiliate(inputCode: string): AffiliateValidationResult {
  if (!inputCode || typeof inputCode !== "string") {
    return { isValid: false }
  }

  // Normalize the input code (uppercase, trim whitespace)
  const normalizedCode = inputCode.trim().toUpperCase()

  // Find matching affiliate code
  const affiliateCode = AFFILIATE_CODES.find((affiliate) => affiliate.code === normalizedCode)

  if (affiliateCode) {
    return {
      isValid: true,
      code: affiliateCode.code,
      discount: affiliateCode.discount,
      type: affiliateCode.type,
      description: affiliateCode.description,
      normalizedCode,
    }
  }

  return {
    isValid: false,
    normalizedCode,
  }
}

export function getAllAffiliateCodes(): AffiliateCode[] {
  return [...AFFILIATE_CODES]
}

export function getAffiliateCodesByType(type: string): AffiliateCode[] {
  return AFFILIATE_CODES.filter((code) => code.type.toLowerCase() === type.toLowerCase())
}

export function calculateDiscountedPrice(originalPrice: number, affiliateCode: string): number {
  const validation = validateAffiliate(affiliateCode)

  if (!validation.isValid || !validation.discount) {
    return originalPrice
  }

  const discountAmount = (originalPrice * validation.discount) / 100
  return originalPrice - discountAmount
}
