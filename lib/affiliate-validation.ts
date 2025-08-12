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
    name: "AR Consulting Group",
    category: "Consulting Partner",
    discount: 20,
    commission: 15,
    isActive: true,
  },
  {
    code: "RESELLER001",
    name: "Business Solutions LLC",
    category: "Reseller",
    discount: 10,
    commission: 8,
    isActive: true,
  },
  {
    code: "REFERRAL001",
    name: "Customer Referral Program",
    category: "Referral",
    discount: 5,
    commission: 5,
    isActive: true,
  },
  {
    code: "ENTERPRISE001",
    name: "Enterprise Solutions Partner",
    category: "Enterprise",
    discount: 25,
    commission: 20,
    isActive: true,
  },
]

export function validateAffiliateCode(code: string) {
  const affiliate = affiliateCodes.find(
    (a) => a.code.toLowerCase() === code.toLowerCase() && a.isActive
  )

  if (!affiliate) {
    return {
      isValid: false,
      code: code,
      name: null,
      category: null,
      discount: 0,
      commission: 0,
    }
  }

  return {
    isValid: true,
    code: affiliate.code,
    name: affiliate.name,
    category: affiliate.category,
    discount: affiliate.discount,
    commission: affiliate.commission,
  }
}

export function getAllAffiliateCodes() {
  return affiliateCodes.filter((code) => code.isActive)
}
