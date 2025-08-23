import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

// Default data structure
const DEFAULT_DATA = {
  categories: [
    {
      id: "1",
      name: "Getting Started",
      description: "Basic information and setup guides",
      icon: "BookOpen",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articles: [
        {
          id: "1",
          title: "Welcome to Knowledge Base",
          content: "This is your knowledge base system. You can add, edit, and organize articles here.",
          categoryId: "1",
          tags: ["welcome", "introduction"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      subcategories: [],
    },
    {
      id: "2",
      name: "Administration",
      description: "Admin tools and management",
      icon: "Settings",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articles: [],
      subcategories: [],
    },
  ],
  users: [
    {
      id: "1",
      username: "admin",
      password: "admin123",
      role: "admin",
      email: "admin@example.com",
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "2",
      username: "editor",
      password: "editor123",
      role: "editor",
      email: "editor@example.com",
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "3",
      username: "viewer",
      password: "viewer123",
      role: "viewer",
      email: "viewer@example.com",
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
  ],
  auditLog: [
    {
      id: "1",
      action: "system_initialized",
      timestamp: new Date().toISOString(),
      username: "system",
      performedBy: "system",
      details: "Knowledge base system initialized",
    },
  ],
  pageVisits: 0,
}

async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function loadData() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(DATA_FILE, "utf8")
    const parsed = JSON.parse(data)

    // Ensure all required properties exist with defaults
    return {
      categories: Array.isArray(parsed.categories) ? parsed.categories : DEFAULT_DATA.categories,
      users: Array.isArray(parsed.users) ? parsed.users : DEFAULT_DATA.users,
      auditLog: Array.isArray(parsed.auditLog) ? parsed.auditLog : DEFAULT_DATA.auditLog,
      pageVisits: typeof parsed.pageVisits === "number" ? parsed.pageVisits : DEFAULT_DATA.pageVisits,
    }
  } catch (error) {
    console.log("📁 No existing data file, creating with defaults")
    await saveData(DEFAULT_DATA)
    return DEFAULT_DATA
  }
}

async function saveData(data: any) {
  try {
    await ensureDataDirectory()

    // Ensure data structure is valid
    const validData = {
      categories: Array.isArray(data.categories) ? data.categories : [],
      users: Array.isArray(data.users) ? data.users : [],
      auditLog: Array.isArray(data.auditLog) ? data.auditLog : [],
      pageVisits: typeof data.pageVisits === "number" ? data.pageVisits : 0,
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(validData, null, 2))
    return true
  } catch (error) {
    console.error("❌ Error saving data:", error)
    throw new Error("Failed to save data")
  }
}

export async function GET() {
  try {
    console.log("📖 API GET /api/data - Loading data...")
    const data = await loadData()

    console.log("✅ API GET /api/data - Data loaded successfully:", {
      categories: data.categories?.length || 0,
      users: data.users?.length || 0,
      auditLog: data.auditLog?.length || 0,
      pageVisits: data.pageVisits || 0,
    })

    return NextResponse.json({
      success: true,
      ...data,
    })
  } catch (error) {
    console.error("❌ API GET /api/data - Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("💾 API POST /api/data - Processing request...")

    const body = await request.json()

    if (!body || typeof body !== "object") {
      throw new Error("Invalid request body")
    }

    // Handle different actions
    if (body.action === "load") {
      const data = await loadData()
      return NextResponse.json({
        success: true,
        ...data,
      })
    }

    if (body.action === "save" && body.data) {
      await saveData(body.data)
      return NextResponse.json({
        success: true,
        message: "Data saved successfully",
      })
    }

    if (body.action === "import" && body.data) {
      await saveData(body.data)
      return NextResponse.json({
        success: true,
        message: "Data imported successfully",
      })
    }

    // Default save operation
    const currentData = await loadData()
    const updatedData = {
      categories: Array.isArray(body.categories) ? body.categories : currentData.categories,
      users: Array.isArray(body.users) ? body.users : currentData.users,
      auditLog: Array.isArray(body.auditLog) ? body.auditLog : currentData.auditLog,
      pageVisits: typeof body.pageVisits === "number" ? body.pageVisits : currentData.pageVisits,
    }

    await saveData(updatedData)

    console.log("✅ API POST /api/data - Data saved successfully")

    return NextResponse.json({
      success: true,
      message: "Data saved successfully",
    })
  } catch (error) {
    console.error("❌ API POST /api/data - Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
