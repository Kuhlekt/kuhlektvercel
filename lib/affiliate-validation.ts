// Predefined affiliate codes with their details
export const AFFILIATE_CODES = {
  PARTNER001: { name: "TechCorp Solutions", commission: 15, active: true },
  PARTNER002: { name: "Digital Dynamics", commission: 12, active: true },
  PARTNER003: { name: "Innovation Labs", commission: 18, active: true },
  PARTNER004: { name: "Future Systems", commission: 10, active: true },
  PARTNER005: { name: "Smart Solutions", commission: 14, active: true },
  PARTNER006: { name: "Tech Innovators", commission: 16, active: true },
  PARTNER007: { name: "Digital Partners", commission: 13, active: true },
  PARTNER008: { name: "Advanced Systems", commission: 17, active: true },
  PARTNER009: { name: "Modern Tech", commission: 11, active: true },
  PARTNER010: { name: "Enterprise Solutions", commission: 19, active: true },
  PARTNER011: { name: "Cloud Experts", commission: 15, active: true },
  PARTNER012: { name: "Data Specialists", commission: 12, active: true },
  PARTNER013: { name: "AI Solutions", commission: 20, active: true },
  PARTNER014: { name: "Automation Pro", commission: 14, active: true },
  PARTNER015: { name: "Tech Leaders", commission: 16, active: true },
  PARTNER016: { name: "Digital Experts", commission: 13, active: true },
  PARTNER017: { name: "Innovation Hub", commission: 18, active: true },
  PARTNER018: { name: "Smart Tech", commission: 11, active: true },
  PARTNER019: { name: "Future Labs", commission: 17, active: true },
  PARTNER020: { name: "Tech Pioneers", commission: 15, active: true },
  PARTNER021: { name: "Digital Leaders", commission: 12, active: true },
  PARTNER022: { name: "Advanced Solutions", commission: 19, active: true },
  PARTNER023: { name: "Modern Systems", commission: 14, active: true },
  PARTNER024: { name: "Enterprise Tech", commission: 16, active: true },
} as const

export type AffiliateCode = keyof typeof AFFILIATE_CODES

export interface AffiliateInfo {
  name: string
  commission: number
  active: boolean
}

export function validateAffiliateCode(code: string): AffiliateInfo | null {
  const upperCode = code.toUpperCase() as AffiliateCode
  const affiliate = AFFILIATE_CODES[upperCode]

  if (affiliate && affiliate.active) {
    return affiliate
  }

  return null
}

export function getAllActiveAffiliateCodes(): Array<{ code: AffiliateCode; info: AffiliateInfo }> {
  return Object.entries(AFFILIATE_CODES)
    .filter(([, info]) => info.active)
    .map(([code, info]) => ({ code: code as AffiliateCode, info }))
}

export function getAffiliateCommission(code: string): number {
  const affiliate = validateAffiliateCode(code)
  return affiliate ? affiliate.commission : 0
}
