import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "knowledge-base.json")

export async function POST() {
  try {
    console.log("📈 API POST /api/data/page-visits - Incrementing page visits...")

    // Ensure data directory exists
    const dataDir = path.dirname(DATA_FILE)
    try {
      await fs.access(dataDir)
    } catch {
      await fs.mkdir(dataDir, { recursive: true })
    }

    // Read current data
    let data
    try {
      const fileContent = await fs.readFile(DATA_FILE, "utf-8")
      data = JSON.parse(fileContent)
    } catch {
      // If file doesn't exist, create minimal structure
      data = {
        categories: [],
        users: [],
        auditLog: [],
        pageVisits: 0,
      }
    }

    // Increment page visits safely
    const currentVisits = typeof data.pageVisits === "number" ? data.pageVisits : 0
    const newVisits = currentVisits + 1

    // Update data
    const updatedData = {
      ...data,
      pageVisits: newVisits,
    }

    // Write back to file
    await fs.writeFile(DATA_FILE, JSON.stringify(updatedData, null, 2))

    console.log(`✅ API POST /api/data/page-visits - Page visits incremented to ${newVisits}`)

    return NextResponse.json({
      success: true,
      pageVisits: newVisits,
    })
  } catch (error) {
    console.error("❌ API POST /api/data/page-visits - Error:", error)

    // Return success with 0 to prevent blocking the app
    return NextResponse.json({
      success: true,
      pageVisits: 0,
      error: "Failed to increment but continuing",
    })
  }
}
