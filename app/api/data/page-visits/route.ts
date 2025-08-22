import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json")

export async function POST() {
  try {
    // Ensure data directory exists
    try {
      await fs.access(DATA_DIR)
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true })
    }

    // Read current settings
    let settings = { pageVisits: 0 }
    try {
      const data = await fs.readFile(SETTINGS_FILE, "utf8")
      settings = JSON.parse(data)
    } catch {
      // File doesn't exist, use default
    }

    // Increment page visits
    settings.pageVisits = (settings.pageVisits || 0) + 1

    // Save updated settings
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2))

    return NextResponse.json({ pageVisits: settings.pageVisits })
  } catch (error) {
    console.error("Error incrementing page visits:", error)
    return NextResponse.json({ error: "Failed to increment page visits" }, { status: 500 })
  }
}
