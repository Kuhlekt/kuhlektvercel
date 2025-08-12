interface AffiliateCode {
  code: string
  name: string
  category: string
  discount: number
  commission: number
  isActive: boolean
}

const affiliateCodes: AffiliateCode[] = [
  {
    code: "PARTNER001",
    name: "TechSolutions Inc",
    category: "Technology Partner",
    discount: 15,
    commission: 10,
    isActive: true,
  },
  {
    code: "FINANCE2024",
    name: "Finance Leaders Network",
    category: "Professional Association",
    discount: 20,
    commission: 15,
    isActive: true,
  },
  {
    code: "CONSULTANT50",
    name: "AR Consulting Group",
    category: "Consulting Partner",
    discount: 25,
    commission: 20,
    isActive: true,
  },
  {
    code: "REFERRAL123",
    name: "Customer Referral Program",
    category: "Customer Referral",
    discount: 10,
    commission: 5,
    isActive: true,
  },
  {
    code: "ENTERPRISE2024",
    name: "Enterprise Solutions Partner",
    category: "Enterprise Partner",
    discount: 30,
    commission: 25,
    isActive: true,
  },
  {
    code: "STARTUP15",
    name: "Startup Accelerator",
    category: "Startup Program",
    discount: 35,
    commission: 15,
    isActive: true,
  },
  {
    code: "CHANNEL001",
    name: "Channel Partner Network",
    category: "Channel Partner",
    discount: 20,
    commission: 18,
    isActive: true,
  },
  {
    code: "RESELLER2024",
    name: "Authorized Reseller",
    category: "Reseller",
    discount: 25,
    commission: 22,
    isActive: true,
  },
  {
    code: "INTEGRATION50",
    name: "Integration Partner",
    category: "Technology Integration",
    discount: 15,
    commission: 12,
    isActive: true,
  },
  {
    code: "NONPROFIT25",
    name: "Nonprofit Discount Program",
    category: "Nonprofit",
    discount: 40,
    commission: 10,
    isActive: true,
  },
  {
    code: "EDUCATION30",
    name: "Educational Institution",
    category: "Education",
    discount: 45,
    commission: 8,
    isActive: true,
  },
  {
    code: "GOVERNMENT20",
    name: "Government Agency",
    category: "Government",
    discount: 20,
    commission: 15,
    isActive: true,
  },
  {
    code: "HEALTHCARE15",
    name: "Healthcare Partner",
    category: "Healthcare",
    discount: 18,
    commission: 14,
    isActive: true,
  },
  {
    code: "MANUFACTURING10",
    name: "Manufacturing Alliance",
    category: "Manufacturing",
    discount: 12,
    commission: 10,
    isActive: true,
  },
  {
    code: "RETAIL2024",
    name: "Retail Solutions Partner",
    category: "Retail",
    discount: 15,
    commission: 12,
    isActive: true,
  },
  {
    code: "SAAS50",
    name: "SaaS Partner Program",
    category: "SaaS Integration",
    discount: 20,
    commission: 16,
    isActive: true,
  },
  {
    code: "ACCOUNTING25",
    name: "Accounting Firm Partnership",
    category: "Accounting",
    discount: 22,
    commission: 18,
    isActive: true,
  },
  {
    code: "LEGAL15",
    name: "Legal Services Partner",
    category: "Legal",
    discount: 15,
    commission: 12,
    isActive: true,
  },
  {
    code: "CONSULTING2024",
    name: "Management Consulting",
    category: "Consulting",
    discount: 25,
    commission: 20,
    isActive: true,
  },
  {
    code: "FINTECH30",
    name: "FinTech Alliance",
    category: "FinTech",
    discount: 18,
    commission: 15,
    isActive: true,
  },
  {
    code: "BANKING20",
    name: "Banking Solutions Partner",
    category: "Banking",
    discount: 16,
    commission: 13,
    isActive: true,
  },
  {
    code: "INSURANCE25",
    name: "Insurance Industry Partner",
    category: "Insurance",
    discount: 20,
    commission: 16,
    isActive: true,
  },
  {
    code: "LOGISTICS15",
    name: "Logistics & Supply Chain",
    category: "Logistics",
    discount: 14,
    commission: 11,
    isActive: true,
  },
  {
    code: "ENERGY2024",
    name: "Energy Sector Partner",
    category: "Energy",
    discount: 17,
    commission: 14,
    isActive: true,
  },
]

export function validateAffiliateCode(code: string): AffiliateCode | null {
  const affiliate = affiliateCodes.find((affiliate) => affiliate.code.toLowerCase() === code.toLowerCase())

  if (!affiliate || !affiliate.isActive) {
    return null
  }

  return affiliate
}

export function getAllAffiliateCodes(): AffiliateCode[] {
  return affiliateCodes.filter((affiliate) => affiliate.isActive)
}

export function getAffiliateByCategory(category: string): AffiliateCode[] {
  return affiliateCodes.filter(
    (affiliate) => affiliate.isActive && affiliate.category.toLowerCase() === category.toLowerCase(),
  )
}
