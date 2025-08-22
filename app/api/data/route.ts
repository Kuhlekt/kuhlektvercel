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

// Initialize default data files
async function initializeDataFiles() {
  await ensureDataDir()

  // Initialize categories.json
  try {
    await fs.access(CATEGORIES_FILE)
  } catch {
    const defaultCategories = []
    await fs.writeFile(CATEGORIES_FILE, JSON.stringify(defaultCategories, null, 2))
  }

  // Initialize users.json
  try {
    await fs.access(USERS_FILE)
  } catch {
    const defaultUsers = [
      {
        id: "1",
        username: "admin",
        password: "admin123",
        role: "admin",
        createdAt: new Date().toISOString(),
        lastLogin: null,
      },
      {
        id: "2",
        username: "editor",
        password: "editor123",
        role: "editor",
        createdAt: new Date().toISOString(),
        lastLogin: null,
      },
      {
        id: "3",
        username: "viewer",
        password: "viewer123",
        role: "viewer",
        createdAt: new Date().toISOString(),
        lastLogin: null,
      },
    ]
    await fs.writeFile(USERS_FILE, JSON.stringify(defaultUsers, null, 2))
  }

  // Initialize audit-log.json
  try {
    await fs.access(AUDIT_LOG_FILE)
  } catch {
    const defaultAuditLog = []
    await fs.writeFile(AUDIT_LOG_FILE, JSON.stringify(defaultAuditLog, null, 2))
  }

  // Initialize settings.json
  try {
    await fs.access(SETTINGS_FILE)
  } catch {
    const defaultSettings = { pageVisits: 0 }
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2))
  }
}

export async function GET() {
  try {
    await initializeDataFiles()

    const [categoriesData, usersData, auditLogData, settingsData] = await Promise.all([
      fs.readFile(CATEGORIES_FILE, "utf-8").then((data) => JSON.parse(data)),
      fs.readFile(USERS_FILE, "utf-8").then((data) => JSON.parse(data)),
      fs.readFile(AUDIT_LOG_FILE, "utf-8").then((data) => JSON.parse(data)),
      fs.readFile(SETTINGS_FILE, "utf-8").then((data) => JSON.parse(data)),
    ])

    return NextResponse.json({
      categories: categoriesData,
      users: usersData,
      auditLog: auditLogData,
      settings: settingsData,
    })
  } catch (error) {
    console.error("Error reading data:", error)
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDataFiles()

    const data = await request.json()

    const writePromises = []

    if (data.categories !== undefined) {
      writePromises.push(fs.writeFile(CATEGORIES_FILE, JSON.stringify(data.categories, null, 2)))
    }

    if (data.users !== undefined) {
      writePromises.push(fs.writeFile(USERS_FILE, JSON.stringify(data.users, null, 2)))
    }

    if (data.auditLog !== undefined) {
      writePromises.push(fs.writeFile(AUDIT_LOG_FILE, JSON.stringify(data.auditLog, null, 2)))
    }

    if (data.settings !== undefined) {
      writePromises.push(fs.writeFile(SETTINGS_FILE, JSON.stringify(data.settings, null, 2)))
    }

    await Promise.all(writePromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error writing data:", error)
    return NextResponse.json({ error: "Failed to write data" }, { status: 500 })
  }
}
