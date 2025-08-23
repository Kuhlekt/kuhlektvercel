import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "knowledge-base.json")

export async function POST() {
  try {
    // Read current data
    let data
    try {
      const fileContent = await fs.readFile(DATA_FILE, "utf8")
      data = JSON.parse(fileContent)
    } catch {
      // File doesn't exist, create default structure
      data = {
        categories: [],
        articles: [],
        users: [],
        auditLog: [],
        pageVisits: 0,
      }
    }

    // Increment page visits
    data.pageVisits = (data.pageVisits || 0) + 1

    // Save updated data
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))

    return NextResponse.json({
      success: true,
      pageVisits: data.pageVisits,
    })
  } catch (error) {
    console.error("Error incrementing page visits:", error)
    return NextResponse.json({ success: false, error: "Failed to increment page visits" }, { status: 500 })
  }
}
