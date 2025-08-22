import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { initialUsers } from "../../../data/initial-users"
import { initialAuditLog } from "../../../data/initial-audit-log"

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

// Initialize files with default data if they don't exist
async function initializeFile(filePath: string, defaultData: any) {
  try {
    await fs.access(filePath)
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2))
  }
}

// Load data from files
async function loadData() {
  await ensureDataDir()

  // Initialize files with default data
  await initializeFile(CATEGORIES_FILE, [])
  await initializeFile(USERS_FILE, initialUsers)
  await initializeFile(AUDIT_LOG_FILE, initialAuditLog)
  await initializeFile(SETTINGS_FILE, { pageVisits: 0 })

  const [categories, users, auditLog, settings] = await Promise.all([
    fs.readFile(CATEGORIES_FILE, "utf-8").then(JSON.parse),
    fs.readFile(USERS_FILE, "utf-8").then(JSON.parse),
    fs.readFile(AUDIT_LOG_FILE, "utf-8").then(JSON.parse),
    fs.readFile(SETTINGS_FILE, "utf-8").then(JSON.parse),
  ])

  return { categories, users, auditLog, settings }
}

// Save data to files
async function saveData(data: any) {
  await ensureDataDir()

  await Promise.all([
    fs.writeFile(CATEGORIES_FILE, JSON.stringify(data.categories, null, 2)),
    fs.writeFile(USERS_FILE, JSON.stringify(data.users, null, 2)),
    fs.writeFile(AUDIT_LOG_FILE, JSON.stringify(data.auditLog, null, 2)),
    fs.writeFile(SETTINGS_FILE, JSON.stringify(data.settings, null, 2)),
  ])
}

export async function GET() {
  try {
    const data = await loadData()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error loading data:", error)
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    await saveData(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
