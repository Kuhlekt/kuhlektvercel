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
    code: "CONSULT001",
    name: "FinanceConsult Pro",
    category: "Consulting Partner",
    discount: 20,
    commission: 15,
    isActive: true,
  },
  {
    code: "RESELLER001",
    name: "BusinessSoft Resellers",
    category: "Reseller Partner",
    discount: 25,
    commission: 20,
    isActive: true,
  },
  {
    code: "STARTUP001",
    name: "StartupAccelerator",
    category: "Startup Program",
    discount: 30,
    commission: 5,
    isActive: true,
  },
  {
    code: "ENTERPRISE001",
    name: "Enterprise Solutions Group",
    category: "Enterprise Partner",
    discount: 10,
    commission: 12,
    isActive: true,
  },
  {
    code: "FINANCE001",
    name: "CFO Network",
    category: "Finance Community",
    discount: 18,
    commission: 8,
    isActive: true,
  },
  {
    code: "ACCOUNTING001",
    name: "CPA Alliance",
    category: "Accounting Partner",
    discount: 22,
    commission: 18,
    isActive: true,
  },
  {
    code: "INTEGRATION001",
    name: "SystemIntegrators LLC",
    category: "Integration Partner",
    discount: 12,
    commission: 14,
    isActive: true,
  },
  {
    code: "REFERRAL001",
    name: "Customer Referral Program",
    category: "Customer Referral",
    discount: 15,
    commission: 25,
    isActive: true,
  },
  {
    code: "EDUCATION001",
    name: "Educational Institutions",
    category: "Education Partner",
    discount: 35,
    commission: 5,
    isActive: true,
  },
  {
    code: "NONPROFIT001",
    name: "Nonprofit Organizations",
    category: "Nonprofit Partner",
    discount: 40,
    commission: 0,
    isActive: true,
  },
  {
    code: "HEALTHCARE001",
    name: "Healthcare Solutions",
    category: "Healthcare Partner",
    discount: 20,
    commission: 15,
    isActive: true,
  },
  {
    code: "MANUFACTURING001",
    name: "Manufacturing Alliance",
    category: "Manufacturing Partner",
    discount: 18,
    commission: 12,
    isActive: true,
  },
  {
    code: "RETAIL001",
    name: "Retail Partners Network",
    category: "Retail Partner",
    discount: 16,
    commission: 10,
    isActive: true,
  },
  {
    code: "SAAS001",
    name: "SaaS Partners Collective",
    category: "SaaS Partner",
    discount: 25,
    commission: 20,
    isActive: true,
  },
  {
    code: "FINTECH001",
    name: "FinTech Innovators",
    category: "FinTech Partner",
    discount: 28,
    commission: 22,
    isActive: true,
  },
  {
    code: "CLOUD001",
    name: "Cloud Solutions Provider",
    category: "Cloud Partner",
    discount: 20,
    commission: 15,
    isActive: true,
  },
  {
    code: "SECURITY001",
    name: "CyberSecurity Partners",
    category: "Security Partner",
    discount: 15,
    commission: 12,
    isActive: true,
  },
  {
    code: "ANALYTICS001",
    name: "Data Analytics Group",
    category: "Analytics Partner",
    discount: 22,
    commission: 18,
    isActive: true,
  },
  {
    code: "AUTOMATION001",
    name: "Process Automation Experts",
    category: "Automation Partner",
    discount: 24,
    commission: 20,
    isActive: true,
  },
  {
    code: "COMPLIANCE001",
    name: "Compliance Solutions Inc",
    category: "Compliance Partner",
    discount: 18,
    commission: 14,
    isActive: true,
  },
  {
    code: "AUDIT001",
    name: "Audit Professionals Network",
    category: "Audit Partner",
    discount: 20,
    commission: 16,
    isActive: true,
  },
  {
    code: "TREASURY001",
    name: "Treasury Management Group",
    category: "Treasury Partner",
    discount: 17,
    commission: 13,
    isActive: true,
  },
  {
    code: "CREDIT001",
    name: "Credit Management Alliance",
    category: "Credit Partner",
    discount: 19,
    commission: 15,
    isActive: true,
  },
]

export function validateAffiliateCode(code: string): AffiliateCode | null {
  const affiliate = affiliateCodes.find(
    (affiliate) => affiliate.code.toLowerCase() === code.toLowerCase() && affiliate.isActive,
  )
  return affiliate || null
}

export function getAllAffiliateCodes(): AffiliateCode[] {
  return affiliateCodes.filter((affiliate) => affiliate.isActive)
}

export function getAffiliateByCategory(category: string): AffiliateCode[] {
  return affiliateCodes.filter(
    (affiliate) => affiliate.category.toLowerCase().includes(category.toLowerCase()) && affiliate.isActive,
  )
}
