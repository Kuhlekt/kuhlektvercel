import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json")

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

export async function POST() {
  try {
    await ensureDataDir()

    let settings = { pageVisits: 0 }
    try {
      const data = await fs.readFile(SETTINGS_FILE, "utf8")
      settings = JSON.parse(data).settings || { pageVisits: 0 }
    } catch {
      // File doesn't exist, use default
    }

    settings.pageVisits += 1

    await fs.writeFile(SETTINGS_FILE, JSON.stringify({ settings }, null, 2))

    return NextResponse.json({ success: true, pageVisits: settings.pageVisits })
  } catch (error) {
    console.error("Error incrementing page visits:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
