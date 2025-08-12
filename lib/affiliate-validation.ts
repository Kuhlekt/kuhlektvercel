interface AffiliateInfo {
  name: string
  category: string
  discount: number
  isActive: boolean
}

const affiliateCodes: Record<string, AffiliateInfo> = {
  // Accounting Firms
  DELOITTE2024: {
    name: "Deloitte & Touche",
    category: "Big 4 Accounting",
    discount: 15,
    isActive: true,
  },
  PWC2024: {
    name: "PricewaterhouseCoopers",
    category: "Big 4 Accounting",
    discount: 15,
    isActive: true,
  },
  EY2024: {
    name: "Ernst & Young",
    category: "Big 4 Accounting",
    discount: 15,
    isActive: true,
  },
  KPMG2024: {
    name: "KPMG",
    category: "Big 4 Accounting",
    discount: 15,
    isActive: true,
  },

  // Technology Partners
  SALESFORCE: {
    name: "Salesforce Partner Network",
    category: "CRM Integration",
    discount: 20,
    isActive: true,
  },
  MICROSOFT: {
    name: "Microsoft Partner",
    category: "ERP Integration",
    discount: 18,
    isActive: true,
  },
  ORACLE: {
    name: "Oracle Partner Network",
    category: "ERP Integration",
    discount: 18,
    isActive: true,
  },
  SAP: {
    name: "SAP Partner",
    category: "ERP Integration",
    discount: 18,
    isActive: true,
  },

  // Consulting Partners
  ACCENTURE: {
    name: "Accenture",
    category: "Management Consulting",
    discount: 12,
    isActive: true,
  },
  MCKINSEY: {
    name: "McKinsey & Company",
    category: "Management Consulting",
    discount: 12,
    isActive: true,
  },
  BCG: {
    name: "Boston Consulting Group",
    category: "Management Consulting",
    discount: 12,
    isActive: true,
  },
  BAIN: {
    name: "Bain & Company",
    category: "Management Consulting",
    discount: 12,
    isActive: true,
  },

  // Industry Associations
  NACM2024: {
    name: "National Association of Credit Management",
    category: "Industry Association",
    discount: 10,
    isActive: true,
  },
  IOFM2024: {
    name: "Institute of Finance & Management",
    category: "Industry Association",
    discount: 10,
    isActive: true,
  },
  AFP2024: {
    name: "Association for Financial Professionals",
    category: "Industry Association",
    discount: 10,
    isActive: true,
  },
  AICPA2024: {
    name: "American Institute of CPAs",
    category: "Industry Association",
    discount: 10,
    isActive: true,
  },

  // Regional Partners
  NORTHEAST: {
    name: "Northeast Regional Partner",
    category: "Regional Partner",
    discount: 8,
    isActive: true,
  },
  SOUTHEAST: {
    name: "Southeast Regional Partner",
    category: "Regional Partner",
    discount: 8,
    isActive: true,
  },
  MIDWEST: {
    name: "Midwest Regional Partner",
    category: "Regional Partner",
    discount: 8,
    isActive: true,
  },
  WEST: {
    name: "West Coast Regional Partner",
    category: "Regional Partner",
    discount: 8,
    isActive: true,
  },

  // Special Promotions
  EARLY2024: {
    name: "Early Adopter Program",
    category: "Special Promotion",
    discount: 25,
    isActive: true,
  },
  STARTUP: {
    name: "Startup Discount Program",
    category: "Special Promotion",
    discount: 30,
    isActive: true,
  },
  NONPROFIT: {
    name: "Non-Profit Organization",
    category: "Special Promotion",
    discount: 20,
    isActive: true,
  },
  EDUCATION: {
    name: "Educational Institution",
    category: "Special Promotion",
    discount: 20,
    isActive: true,
  },
}

export function validateAffiliateCode(code: string): AffiliateInfo | null {
  const upperCode = code.toUpperCase().trim()
  const affiliate = affiliateCodes[upperCode]

  if (!affiliate || !affiliate.isActive) {
    return null
  }

  return affiliate
}

export function getAllAffiliateCodes(): Record<string, AffiliateInfo> {
  return affiliateCodes
}

export function getAffiliatesByCategory(category: string): Record<string, AffiliateInfo> {
  const filtered: Record<string, AffiliateInfo> = {}

  Object.entries(affiliateCodes).forEach(([code, info]) => {
    if (info.category === category && info.isActive) {
      filtered[code] = info
    }
  })

  return filtered
}
