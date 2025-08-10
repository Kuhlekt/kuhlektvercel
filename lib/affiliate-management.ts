// In-memory affiliate management (in production, use a database)
const validAffiliates = new Set<string>(["PARTNER001", "RESELLER01", "AGENT123", "REFERRAL99", "CHANNEL01"])

export function addAffiliate(code: string): boolean {
  if (code && code.trim().length > 0) {
    validAffiliates.add(code.trim().toUpperCase())
    return true
  }
  return false
}

export function removeAffiliate(code: string): boolean {
  return validAffiliates.delete(code.trim().toUpperCase())
}

export function isValidAffiliate(code: string): boolean {
  if (!code || code.trim().length === 0) {
    return true // Empty affiliate is allowed
  }
  return validAffiliates.has(code.trim().toUpperCase())
}

export function getAllAffiliates(): string[] {
  return Array.from(validAffiliates).sort()
}
