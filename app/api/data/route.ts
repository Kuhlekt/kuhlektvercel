import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { Category, User, AuditLogEntry } from "../../../types/knowledge-base"

const DATA_DIR = path.join(process.cwd(), "data")
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json")
const USERS_FILE = path.join(DATA_DIR, "users.json")
const AUDIT_LOG_FILE = path.join(DATA_DIR, "audit-log.json")

// Default data
const defaultCategories: Category[] = []

const defaultUsers: User[] = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    email: "admin@kuhlekt.com",
    role: "admin",
    createdAt: new Date(),
    lastLogin: null,
  },
  {
    id: "2",
    username: "editor",
    password: "editor123",
    email: "editor@kuhlekt.com",
    role: "editor",
    createdAt: new Date(),
    lastLogin: null,
  },
  {
    id: "3",
    username: "viewer",
    password: "viewer123",
    email: "viewer@kuhlekt.com",
    role: "viewer",
    createdAt: new Date(),
    lastLogin: null,
  },
]

const defaultAuditLog: AuditLogEntry[] = [
  {
    id: "1",
    action: "system_initialized",
    performedBy: "system",
    timestamp: new Date(),
    details: "Knowledge base system initialized",
  },
]

async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function readJsonFile<T>(filePath: string, defaultData: T): Promise<T> {
  try {
    const data = await fs.readFile(filePath, "utf-8")
    return JSON.parse(data)
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2))
    return defaultData
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    await ensureDataDirectory()

    const [categories, users, auditLog] = await Promise.all([
      readJsonFile(CATEGORIES_FILE, defaultCategories),
      readJsonFile(USERS_FILE, defaultUsers),
      readJsonFile(AUDIT_LOG_FILE, defaultAuditLog),
    ])

    return NextResponse.json({
      categories,
      users,
      auditLog,
    })
  } catch (error) {
    console.error("Error loading data:", error)
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataDirectory()

    const { categories, users, auditLog } = await request.json()

    await Promise.all([
      writeJsonFile(CATEGORIES_FILE, categories || []),
      writeJsonFile(USERS_FILE, users || defaultUsers),
      writeJsonFile(AUDIT_LOG_FILE, auditLog || []),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
