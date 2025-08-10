// Simple admin configuration management
let adminPassword = "admin123" // Default password

export function setAdminPassword(newPassword: string): boolean {
  if (newPassword && newPassword.length >= 6) {
    adminPassword = newPassword
    return true
  }
  return false
}

export function validateAdminPassword(password: string): boolean {
  return password === adminPassword
}

export function getCurrentAdminPassword(): string {
  return adminPassword
}
