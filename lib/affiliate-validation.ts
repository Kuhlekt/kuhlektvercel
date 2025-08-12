export interface AffiliateCode {
  code: string
  discount: number
  category: "startup" | "industry" | "partner" | "promotional" | "vip"
  description: string
  isActive: boolean
}

export const AFFILIATE_CODES: AffiliateCode[] = [
  // Startup codes (10-15% discount)
  { code: "STARTUP10", discount: 10, category: "startup", description: "New startup discount", isActive: true },
  { code: "EARLYBIRD", discount: 15, category: "startup", description: "Early adopter discount", isActive: true },
  { code: "LAUNCH2024", discount: 12, category: "startup", description: "2024 launch special", isActive: true },
  { code: "NEWBIZ", discount: 10, category: "startup", description: "New business discount", isActive: true },
  { code: "FOUNDER", discount: 15, category: "startup", description: "Founder special rate", isActive: true },

  // Industry codes (15-25% discount)
  { code: "FINTECH20", discount: 20, category: "industry", description: "Fintech industry discount", isActive: true },
  {
    code: "HEALTHCARE15",
    discount: 15,
    category: "industry",
    description: "Healthcare sector discount",
    isActive: true,
  },
  { code: "MANUFACTURING", discount: 18, category: "industry", description: "Manufacturing discount", isActive: true },
  { code: "RETAIL25", discount: 25, category: "industry", description: "Retail industry special", isActive: true },
  { code: "SAAS20", discount: 20, category: "industry", description: "SaaS company discount", isActive: true },
  {
    code: "ECOMMERCE",
    discount: 22,
    category: "industry",
    description: "E-commerce platform discount",
    isActive: true,
  },

  // Partner codes (20-30% discount)
  { code: "PARTNER25", discount: 25, category: "partner", description: "Strategic partner discount", isActive: true },
  { code: "INTEGRATION", discount: 20, category: "partner", description: "Integration partner rate", isActive: true },
  { code: "RESELLER30", discount: 30, category: "partner", description: "Reseller partner discount", isActive: true },
  { code: "CONSULTANT", discount: 22, category: "partner", description: "Consultant partner rate", isActive: true },
  { code: "AGENCY25", discount: 25, category: "partner", description: "Agency partner discount", isActive: true },

  // Promotional codes (15-35% discount)
  { code: "SUMMER2024", discount: 20, category: "promotional", description: "Summer 2024 promotion", isActive: true },
  { code: "BLACKFRIDAY", discount: 35, category: "promotional", description: "Black Friday special", isActive: true },
  { code: "NEWYEAR25", discount: 25, category: "promotional", description: "New Year promotion", isActive: true },
  {
    code: "WEBINAR15",
    discount: 15,
    category: "promotional",
    description: "Webinar attendee discount",
    isActive: true,
  },
  {
    code: "CONFERENCE",
    discount: 18,
    category: "promotional",
    description: "Conference special offer",
    isActive: true,
  },

  // VIP codes (30-50% discount)
  { code: "VIP40", discount: 40, category: "vip", description: "VIP customer discount", isActive: true },
  { code: "ENTERPRISE50", discount: 50, category: "vip", description: "Enterprise tier discount", isActive: true },
  { code: "PLATINUM", discount: 35, category: "vip", description: "Platinum member rate", isActive: true },
  { code: "EXECUTIVE", discount: 30, category: "vip", description: "Executive package discount", isActive: true },
]

export function validateAffiliateCode(code: string): AffiliateCode | null {
  const normalizedCode = code.toUpperCase().trim()
  return AFFILIATE_CODES.find((affiliate) => affiliate.code === normalizedCode && affiliate.isActive) || null
}

export function getAffiliateDiscount(code: string): number {
  const affiliate = validateAffiliateCode(code)
  return affiliate ? affiliate.discount : 0
}

export function getAffiliatesByCategory(category: AffiliateCode["category"]): AffiliateCode[] {
  return AFFILIATE_CODES.filter((affiliate) => affiliate.category === category && affiliate.isActive)
}

export function getAllActiveAffiliates(): AffiliateCode[] {
  return AFFILIATE_CODES.filter((affiliate) => affiliate.isActive)
}

export function formatDiscountText(discount: number): string {
  return `${discount}% off`
}

export function calculateDiscountedPrice(originalPrice: number, discountPercent: number): number {
  return originalPrice * (1 - discountPercent / 100)
}
