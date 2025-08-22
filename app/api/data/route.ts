import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { initialUsers } from "@/data/initial-users"
import { initialData } from "@/data/initial-data"
import { initialAuditLog } from "@/data/initial-audit-log"

const DATA_FILE = path.join(process.cwd(), "data", "knowledge-base.json")

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Load data from file or create default
async function loadData() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(DATA_FILE, "utf8")
    const parsed = JSON.parse(data)

    console.log("📁 Data loaded from file:", {
      categories: parsed.categories?.length || 0,
      users: parsed.users?.length || 0,
      auditLog: parsed.auditLog?.length || 0,
      pageVisits: parsed.pageVisits || 0,
    })

    return parsed
  } catch (error) {
    console.log("🔧 Creating default data file...")

    const defaultData = {
      categories: initialData,
      users: initialUsers,
      auditLog: initialAuditLog,
      pageVisits: 0,
    }

    await saveData(defaultData)
    return defaultData
  }
}

// Save data to file
async function saveData(data: any) {
  try {
    await ensureDataDirectory()
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    console.log("💾 Data saved to file successfully")
  } catch (error) {
    console.error("❌ Error saving data:", error)
    throw error
  }
}

export async function GET() {
  try {
    console.log("🔍 API GET /api/data - Loading data...")

    const data = await loadData()

    // Ensure users have all required fields
    const users = (data.users || []).map((user: any) => ({
      id: user.id || Date.now().toString(),
      username: user.username,
      password: user.password,
      email: user.email || `${user.username}@example.com`,
      role: user.role || "viewer",
      createdAt: user.createdAt || new Date().toISOString(),
      lastLogin: user.lastLogin || null,
      isActive: user.isActive !== false,
    }))

    const response = {
      categories: data.categories || [],
      users: users,
      auditLog: data.auditLog || [],
      pageVisits: data.pageVisits || 0,
    }

    console.log("✅ API GET /api/data - Data sent:", {
      categories: response.categories.length,
      users: response.users.length,
      usernames: response.users.map((u: any) => u.username),
      auditLog: response.auditLog.length,
      pageVisits: response.pageVisits,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("❌ API GET /api/data - Error:", error)

    // Return fallback data instead of error
    const fallbackData = {
      categories: initialData,
      users: initialUsers,
      auditLog: initialAuditLog,
      pageVisits: 0,
    }

    return NextResponse.json(fallbackData)
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("💾 API POST /api/data - Saving data...")

    const newData = await request.json()
    const currentData = await loadData()

    // Merge with existing data
    const updatedData = {
      categories: newData.categories !== undefined ? newData.categories : currentData.categories,
      users: newData.users !== undefined ? newData.users : currentData.users,
      auditLog: newData.auditLog !== undefined ? newData.auditLog : currentData.auditLog,
      pageVisits: newData.pageVisits !== undefined ? newData.pageVisits : currentData.pageVisits,
    }

    await saveData(updatedData)

    console.log("✅ API POST /api/data - Data saved successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ API POST /api/data - Error:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
