import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json")
const USERS_FILE = path.join(DATA_DIR, "users.json")
const AUDIT_LOG_FILE = path.join(DATA_DIR, "audit-log.json")
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
async function readJSONFile(filePath: string, fallback: any) {
  try {
    const data = await fs.readFile(filePath, "utf8")
    return JSON.parse(data)
  } catch {
    return fallback
  }
}

// Write JSON file
async function writeJSONFile(filePath: string, data: any) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    await ensureDataDir()

    const [categories, users, auditLog, settings] = await Promise.all([
      readJSONFile(CATEGORIES_FILE, []),
      readJSONFile(USERS_FILE, [
        {
          id: "1",
          username: "admin",
          password: "admin123",
          role: "admin",
          createdAt: new Date().toISOString(),
        },
      ]),
      readJSONFile(AUDIT_LOG_FILE, []),
      readJSONFile(SETTINGS_FILE, { pageVisits: 0 }),
    ])

    return NextResponse.json({
      categories,
      users,
      auditLog,
      settings,
    })
  } catch (error) {
    console.error("Error reading data:", error)
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataDir()

    const data = await request.json()
    const { categories, users, auditLog, settings } = data

    await Promise.all([
      writeJSONFile(CATEGORIES_FILE, categories || []),
      writeJSONFile(USERS_FILE, users || []),
      writeJSONFile(AUDIT_LOG_FILE, auditLog || []),
      writeJSONFile(SETTINGS_FILE, settings || { pageVisits: 0 }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
