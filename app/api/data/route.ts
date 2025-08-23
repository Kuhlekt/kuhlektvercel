import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

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

// Default data structure
const defaultData = {
  categories: [],
  articles: [],
  users: [],
  auditLog: [],
  pageVisits: 0,
}

export async function GET() {
  try {
    await ensureDataDirectory()

    try {
      const data = await fs.readFile(DATA_FILE, "utf8")
      const parsedData = JSON.parse(data)

      // Ensure all required properties exist
      const completeData = {
        ...defaultData,
        ...parsedData,
      }

      return NextResponse.json(completeData)
    } catch (error) {
      // File doesn't exist or is invalid, return default data
      console.log("Data file not found or invalid, returning default data")
      return NextResponse.json(defaultData)
    }
  } catch (error) {
    console.error("Error reading data:", error)
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataDirectory()

    const body = await request.json()

    // Validate the data structure
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    // Ensure all required properties exist
    const dataToSave = {
      categories: Array.isArray(body.categories) ? body.categories : [],
      articles: Array.isArray(body.articles) ? body.articles : [],
      users: Array.isArray(body.users) ? body.users : [],
      auditLog: Array.isArray(body.auditLog) ? body.auditLog : [],
      pageVisits: typeof body.pageVisits === "number" ? body.pageVisits : 0,
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(dataToSave, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving data:", error)
    return NextResponse.json(
      { error: "Failed to save data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
