import bcrypt from "bcryptjs"

const password = process.argv[2]

if (!password) {
  console.error('Usage: node scripts/generate-admin-hash.js "your-password"')
  process.exit(1)
}
;(async () => {
  try {
    const hash = await bcrypt.hash(password, 12)
    console.log("Bcryptjs hash for your password:")
    console.log(hash)
    console.log("\nCopy this hash and set it as ADMIN_PASSWORD_HASH in your environment variables")
  } catch (error) {
    console.error("Error generating hash:", error)
    process.exit(1)
  }
})()
