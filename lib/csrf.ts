import crypto from "crypto"

const CSRF_TOKEN_LENGTH = 32
const CSRF_TOKEN_HEADER = "x-csrf-token"

export function generateCSRFToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString("hex")
}

export function verifyCSRFToken(token: string, storedToken: string): boolean {
  if (token.length !== storedToken.length) {
    return false
  }

  let match = 0
  for (let i = 0; i < token.length; i++) {
    match |= token.charCodeAt(i) ^ storedToken.charCodeAt(i)
  }

  return match === 0
}
