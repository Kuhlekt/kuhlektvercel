import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json")

interface Settings {
  pageVisits: number
}

const defaultSettings: Settings = {
  pageVisits: 0,
}

async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function readSettings(): Promise<Settings> {
  try {
    const data = await fs.readFile(SETTINGS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2))
    return defaultSettings
  }
}

async function writeSettings(settings: Settings): Promise<void> {
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2))
}

export async function POST() {
  try {
    await ensureDataDirectory()

    const settings = await readSettings()
    settings.pageVisits += 1
    await writeSettings(settings)

    return NextResponse.json({ pageVisits: settings.pageVisits })
  } catch (error) {
    console.error("Error incrementing page visits:", error)
    return NextResponse.json({ error: "Failed to increment page visits" }, { status: 500 })
  }
}

export async function GET() {
  try {
    await ensureDataDirectory()
    const settings = await readSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error getting settings:", error)
    return NextResponse.json({ error: "Failed to get settings" }, { status: 500 })
  }
}
