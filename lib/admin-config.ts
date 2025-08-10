// Simple admin configuration
// In production, this would be stored securely in a database with proper hashing
let adminPassword = "admin123" // Default password

export function validateAdminPassword(password: string): boolean {
  return password === adminPassword
}

export function updateAdminPassword(newPassword: string): void {
  adminPassword = newPassword
}

export function getAdminConfig() {
  return {
    hasPassword: adminPassword.length > 0,
  }
}
