interface AffiliateCode {
  code: string
  name: string
  category: string
  discount: number
  active: boolean
}

const affiliateCodes: AffiliateCode[] = [
  // Accounting Firms
  { code: "DELOITTE2024", name: "Deloitte", category: "Big 4 Accounting", discount: 15, active: true },
  { code: "PWC2024", name: "PwC", category: "Big 4 Accounting", discount: 15, active: true },
  { code: "EY2024", name: "Ernst & Young", category: "Big 4 Accounting", discount: 15, active: true },
  { code: "KPMG2024", name: "KPMG", category: "Big 4 Accounting", discount: 15, active: true },
  { code: "BDO2024", name: "BDO", category: "Accounting Firm", discount: 12, active: true },
  { code: "RSM2024", name: "RSM", category: "Accounting Firm", discount: 12, active: true },

  // Technology Partners
  { code: "SALESFORCE2024", name: "Salesforce", category: "CRM Partner", discount: 20, active: true },
  { code: "MICROSOFT2024", name: "Microsoft", category: "Technology Partner", discount: 18, active: true },
  { code: "ORACLE2024", name: "Oracle", category: "ERP Partner", discount: 18, active: true },
  { code: "SAP2024", name: "SAP", category: "ERP Partner", discount: 18, active: true },
  { code: "QUICKBOOKS2024", name: "QuickBooks", category: "Accounting Software", discount: 10, active: true },
  { code: "XERO2024", name: "Xero", category: "Accounting Software", discount: 10, active: true },

  // Consulting Partners
  { code: "ACCENTURE2024", name: "Accenture", category: "Consulting", discount: 15, active: true },
  { code: "IBM2024", name: "IBM", category: "Technology Consulting", discount: 15, active: true },
  { code: "CAPGEMINI2024", name: "Capgemini", category: "Consulting", discount: 12, active: true },

  // Industry Associations
  { code: "NACM2024", name: "NACM", category: "Credit Management", discount: 8, active: true },
  { code: "IOFM2024", name: "IOFM", category: "Finance Operations", discount: 8, active: true },
  { code: "AFP2024", name: "AFP", category: "Treasury & Finance", discount: 8, active: true },

  // Regional Partners
  { code: "NORTHEAST2024", name: "Northeast Regional", category: "Regional Partner", discount: 5, active: true },
  { code: "SOUTHEAST2024", name: "Southeast Regional", category: "Regional Partner", discount: 5, active: true },
  { code: "MIDWEST2024", name: "Midwest Regional", category: "Regional Partner", discount: 5, active: true },
  { code: "WEST2024", name: "West Regional", category: "Regional Partner", discount: 5, active: true },

  // Special Codes
  { code: "EARLY2024", name: "Early Adopter", category: "Special Offer", discount: 25, active: true },
  { code: "REFERRAL2024", name: "Customer Referral", category: "Referral Program", discount: 20, active: true },
  { code: "WEBINAR2024", name: "Webinar Attendee", category: "Marketing", discount: 10, active: true },
]

export function validateAffiliateCode(code: string): AffiliateCode | null {
  const normalizedCode = code.trim().toUpperCase()
  const affiliate = affiliateCodes.find(
    (affiliate) => affiliate.code.toUpperCase() === normalizedCode && affiliate.active,
  )
  return affiliate || null
}

export function getAllAffiliateCodes(): AffiliateCode[] {
  return affiliateCodes.filter((code) => code.active)
}

export function getAffiliatesByCategory(category: string): AffiliateCode[] {
  return affiliateCodes.filter((code) => code.category === category && code.active)
}

export function searchAffiliates(query: string): AffiliateCode[] {
  const normalizedQuery = query.toLowerCase()
  return affiliateCodes.filter(
    (code) =>
      code.active &&
      (code.name.toLowerCase().includes(normalizedQuery) ||
        code.category.toLowerCase().includes(normalizedQuery) ||
        code.code.toLowerCase().includes(normalizedQuery)),
  )
}
