// Predefined affiliate codes table
export const AFFILIATE_CODES = [
  "PARTNER001",
  "PARTNER002",
  "RESELLER01",
  "CHANNEL01",
  "AFFILIATE01",
  "PROMO2024",
  "SPECIAL01",
  "DISCOUNT10",
  "REFERRAL01",
  "BUSINESS01",
  "ENTERPRISE",
  "STARTUP50",
  "GROWTH25",
  "PREMIUM15",
  "WELCOME20",
] as const

export type AffiliateCode = (typeof AFFILIATE_CODES)[number]

export function validateAffiliateCode(code: string): boolean {
  if (!code || typeof code !== "string") {
    return false
  }

  return AFFILIATE_CODES.includes(code.toUpperCase() as AffiliateCode)
}

export function normalizeAffiliateCode(code: string): string | null {
  if (!code || typeof code !== "string") {
    return null
  }

  const normalizedCode = code.trim().toUpperCase()
  return validateAffiliateCode(normalizedCode) ? normalizedCode : null
}

export function getAffiliateDiscount(code: string): number {
  const normalizedCode = normalizeAffiliateCode(code)
  if (!normalizedCode) return 0

  // Define discount percentages for different affiliate codes
  const discountMap: Record<string, number> = {
    DISCOUNT10: 10,
    STARTUP50: 50,
    GROWTH25: 25,
    PREMIUM15: 15,
    WELCOME20: 20,
    SPECIAL01: 30,
    PROMO2024: 25,
  }

  return discountMap[normalizedCode] || 5 // Default 5% discount for valid codes
}
