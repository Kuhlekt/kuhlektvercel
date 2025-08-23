import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "knowledge-base.json")

export async function POST() {
  try {
    console.log("📈 Page Visits API - Incrementing page visits")

    // Read current data
    let currentData
    try {
      const data = await fs.readFile(DATA_FILE, "utf8")
      currentData = JSON.parse(data)
    } catch (error) {
      console.log("📝 Page Visits API - No existing data, creating initial structure")
      currentData = {
        categories: [],
        articles: [],
        users: [],
        auditLog: [],
        pageVisits: 0,
        lastUpdated: new Date().toISOString(),
      }
    }

    // Increment page visits
    currentData.pageVisits = (currentData.pageVisits || 0) + 1
    currentData.lastUpdated = new Date().toISOString()

    // Save updated data
    await fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2))

    console.log("✅ Page Visits API - Page visits incremented to:", currentData.pageVisits)
    return NextResponse.json({
      success: true,
      pageVisits: currentData.pageVisits,
    })
  } catch (error) {
    console.error("❌ Page Visits API - Error:", error)
    return NextResponse.json({ success: false, error: "Failed to increment page visits" }, { status: 500 })
  }
}
