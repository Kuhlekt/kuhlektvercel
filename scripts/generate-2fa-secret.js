const speakeasy = require("speakeasy")

// Generate a new 2FA secret
const secret = speakeasy.generateSecret({
  name: "Kuhlekt Admin",
  issuer: "Kuhlekt Website",
  length: 32,
})

console.log("=".repeat(50))
console.log("NEW 2FA SECRET GENERATED")
console.log("=".repeat(50))
console.log("")
console.log("Secret (Base32):", secret.base32)
console.log("")
console.log("Add this to your environment variables:")
console.log(`ADMIN_2FA_SECRET=${secret.base32}`)
console.log("")
console.log("QR Code URL:", secret.otpauth_url)
console.log("")
console.log("=".repeat(50))
