// List of valid affiliate numbers
export const VALID_AFFILIATES = [
  "AFF001",
  "AFF002",
  "AFF003",
  "AFF004",
  "AFF005",
  "AFF010",
  "AFF015",
  "AFF020",
  "AFF025",
  "AFF030",
  "AFF100",
  "AFF101",
  "AFF102",
  "AFF103",
  "AFF104",
]

export function validateAffiliate(affiliateNumber: string): boolean {
  return VALID_AFFILIATES.includes(affiliateNumber.toUpperCase())
}

export function getAffiliateError(affiliateNumber: string): string | null {
  // If no affiliate number provided, that's okay (it's optional)
  if (!affiliateNumber || !affiliateNumber.trim()) {
    return null
  }

  // Only validate if an affiliate number was provided
  if (!validateAffiliate(affiliateNumber)) {
    return "Invalid affiliate number. Please check and try again."
  }

  return null
}
