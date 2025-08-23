import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "knowledge-base.json")

export async function POST() {
  try {
    // Try to read existing data
    let data
    try {
      const fileContent = await fs.readFile(DATA_FILE, "utf8")
      data = JSON.parse(fileContent)
    } catch {
      // If file doesn't exist or is invalid, create default structure
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

    // Save back to file
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))

    return NextResponse.json({
      success: true,
      pageVisits: data.pageVisits,
    })
  } catch (error) {
    console.error("Error incrementing page visits:", error)
    // Return success even on error to prevent blocking the app
    return NextResponse.json({
      success: true,
      pageVisits: 0,
      error: "Failed to increment but continuing",
    })
  }
}
