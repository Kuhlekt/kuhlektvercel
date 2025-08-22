import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json")

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Read JSON file with fallback
async function readJsonFile(filePath: string, fallback: any) {
  try {
    const data = await fs.readFile(filePath, "utf8")
    return JSON.parse(data)
  } catch {
    return fallback
  }
}

// Write JSON file
async function writeJsonFile(filePath: string, data: any) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8")
}

export async function POST() {
  try {
    await ensureDataDir()

    const settings = await readJsonFile(SETTINGS_FILE, { pageVisits: 0 })
    settings.pageVisits = (settings.pageVisits || 0) + 1

    await writeJsonFile(SETTINGS_FILE, settings)

    return NextResponse.json({ pageVisits: settings.pageVisits })
  } catch (error) {
    console.error("Error incrementing page visits:", error)
    return NextResponse.json({ error: "Failed to increment page visits" }, { status: 500 })
  }
}
