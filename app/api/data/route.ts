import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { Category, User, AuditLogEntry } from "../../../types/knowledge-base"

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

// Helper to safely read JSON file
async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const data = await fs.readFile(filePath, "utf-8")
    const parsed = JSON.parse(data)

    // Convert date strings back to Date objects for categories
    if (filePath === CATEGORIES_FILE && Array.isArray(parsed)) {
      return parsed.map((category: any) => ({
        ...category,
        articles: (category.articles || []).map((article: any) => ({
          ...article,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt),
        })),
        subcategories: (category.subcategories || []).map((sub: any) => ({
          ...sub,
          articles: (sub.articles || []).map((article: any) => ({
            ...article,
            createdAt: new Date(article.createdAt),
            updatedAt: new Date(article.updatedAt),
          })),
        })),
      })) as T
    }

    // Convert date strings for users
    if (filePath === USERS_FILE && Array.isArray(parsed)) {
      return parsed.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
      })) as T
    }

    // Convert date strings for audit log
    if (filePath === AUDIT_LOG_FILE && Array.isArray(parsed)) {
      return parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      })) as T
    }

    return parsed
  } catch {
    return defaultValue
  }
}

// Helper to write JSON file
async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
}

// Initialize default data
async function initializeData() {
  await ensureDataDir()

  // Initialize categories if not exists
  try {
    await fs.access(CATEGORIES_FILE)
  } catch {
    await writeJsonFile(CATEGORIES_FILE, [])
  }

  // Initialize users if not exists
  try {
    await fs.access(USERS_FILE)
  } catch {
    const defaultUsers: User[] = [
      {
        id: "1",
        username: "admin",
        password: "admin123",
        email: "admin@kuhlekt.com",
        role: "admin",
        createdAt: new Date("2024-01-01"),
        lastLogin: undefined,
      },
      {
        id: "2",
        username: "editor",
        password: "editor123",
        email: "editor@kuhlekt.com",
        role: "editor",
        createdAt: new Date("2024-01-01"),
        lastLogin: undefined,
      },
      {
        id: "3",
        username: "viewer",
        password: "viewer123",
        email: "viewer@kuhlekt.com",
        role: "viewer",
        createdAt: new Date("2024-01-01"),
        lastLogin: undefined,
      },
    ]
    await writeJsonFile(USERS_FILE, defaultUsers)
  }

  // Initialize audit log if not exists
  try {
    await fs.access(AUDIT_LOG_FILE)
  } catch {
    await writeJsonFile(AUDIT_LOG_FILE, [])
  }

  // Initialize settings if not exists
  try {
    await fs.access(SETTINGS_FILE)
  } catch {
    await writeJsonFile(SETTINGS_FILE, { pageVisits: 0 })
  }
}

export async function GET() {
  try {
    await initializeData()

    const [categories, users, auditLog, settings] = await Promise.all([
      readJsonFile<Category[]>(CATEGORIES_FILE, []),
      readJsonFile<User[]>(USERS_FILE, []),
      readJsonFile<AuditLogEntry[]>(AUDIT_LOG_FILE, []),
      readJsonFile<{ pageVisits: number }>(SETTINGS_FILE, { pageVisits: 0 }),
    ])

    return NextResponse.json({
      categories,
      users,
      auditLog,
      pageVisits: settings.pageVisits,
    })
  } catch (error) {
    console.error("Error reading data:", error)
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json()

    await initializeData()

    switch (type) {
      case "categories":
        await writeJsonFile(CATEGORIES_FILE, data)
        break
      case "users":
        await writeJsonFile(USERS_FILE, data)
        break
      case "auditLog":
        await writeJsonFile(AUDIT_LOG_FILE, data)
        break
      case "incrementPageVisits":
        const settings = await readJsonFile<{ pageVisits: number }>(SETTINGS_FILE, { pageVisits: 0 })
        settings.pageVisits += 1
        await writeJsonFile(SETTINGS_FILE, settings)
        return NextResponse.json({ pageVisits: settings.pageVisits })
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error writing data:", error)
    return NextResponse.json({ error: "Failed to write data" }, { status: 500 })
  }
}
