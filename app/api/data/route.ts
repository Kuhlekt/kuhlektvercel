import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Helper function to read JSON file
async function readJsonFile(filename: string, defaultValue: any = {}) {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)
  try {
    const data = await fs.readFile(filePath, "utf8")
    return JSON.parse(data)
  } catch {
    return defaultValue
  }
}

// Helper function to write JSON file
async function writeJsonFile(filename: string, data: any) {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  try {
    switch (type) {
      case "categories":
        const categories = await readJsonFile("categories.json", { categories: [] })
        return NextResponse.json(categories)

      case "users":
        const users = await readJsonFile("users.json", {
          users: [
            { id: "1", username: "admin", password: "admin123", role: "admin" },
            { id: "2", username: "editor", password: "editor123", role: "editor" },
            { id: "3", username: "viewer", password: "viewer123", role: "viewer" },
          ],
        })
        return NextResponse.json(users)

      case "audit-log":
        const auditLog = await readJsonFile("audit-log.json", { auditLog: [] })
        return NextResponse.json(auditLog)

      case "settings":
        const settings = await readJsonFile("settings.json", { settings: { pageVisits: 0 } })
        return NextResponse.json(settings)

      default:
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in GET /api/data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  try {
    const body = await request.json()

    switch (type) {
      case "categories":
        await writeJsonFile("categories.json", { categories: body.categories })
        return NextResponse.json({ success: true })

      case "users":
        await writeJsonFile("users.json", { users: body.users })
        return NextResponse.json({ success: true })

      case "audit-log":
        await writeJsonFile("audit-log.json", { auditLog: body.auditLog })
        return NextResponse.json({ success: true })

      case "settings":
        await writeJsonFile("settings.json", { settings: body.settings })
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in POST /api/data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
