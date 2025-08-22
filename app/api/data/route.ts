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

export async function GET() {
  try {
    await ensureDataDir()

    const [categories, users, auditLog, settings] = await Promise.all([
      readJsonFile(CATEGORIES_FILE, []),
      readJsonFile(USERS_FILE, [
        {
          id: "1",
          username: "admin",
          password: "admin123",
          email: "admin@kuhlekt.com",
          role: "admin",
          createdAt: new Date().toISOString(),
          lastLogin: null,
        },
        {
          id: "2",
          username: "editor",
          password: "editor123",
          email: "editor@kuhlekt.com",
          role: "editor",
          createdAt: new Date().toISOString(),
          lastLogin: null,
        },
        {
          id: "3",
          username: "viewer",
          password: "viewer123",
          email: "viewer@kuhlekt.com",
          role: "viewer",
          createdAt: new Date().toISOString(),
          lastLogin: null,
        },
      ]),
      readJsonFile(AUDIT_LOG_FILE, []),
      readJsonFile(SETTINGS_FILE, { pageVisits: 0 }),
    ])

    return NextResponse.json({
      categories,
      users,
      auditLog,
      settings,
    })
  } catch (error) {
    console.error("Error loading data:", error)
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataDir()

    const data = await request.json()

    await Promise.all([
      writeJsonFile(CATEGORIES_FILE, data.categories || []),
      writeJsonFile(USERS_FILE, data.users || []),
      writeJsonFile(AUDIT_LOG_FILE, data.auditLog || []),
      writeJsonFile(SETTINGS_FILE, data.settings || { pageVisits: 0 }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
