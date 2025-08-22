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

// Load data from file
async function loadData() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(DATA_FILE, "utf8")
    const parsed = JSON.parse(data)

    console.log("Loaded data from file:", {
      categories: parsed.categories?.length || 0,
      users: parsed.users?.length || 0,
      auditLog: parsed.auditLog?.length || 0,
      pageVisits: parsed.pageVisits || 0,
    })

    return parsed
  } catch (error) {
    console.log("No existing data file found, returning empty data")
    return {
      categories: [],
      users: [],
      auditLog: [],
      pageVisits: 0,
    }
  }
}

// Save data to file
async function saveData(data: any) {
  try {
    await ensureDataDirectory()
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8")

    console.log("Saved data to file:", {
      categories: data.categories?.length || 0,
      users: data.users?.length || 0,
      auditLog: data.auditLog?.length || 0,
      pageVisits: data.pageVisits || 0,
    })
  } catch (error) {
    console.error("Error saving data to file:", error)
    throw error
  }
}

// GET - Load data
export async function GET() {
  try {
    const data = await loadData()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/data:", error)
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 })
  }
}

// POST - Save data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received data to save:", {
      categories: body.categories?.length || 0,
      users: body.users?.length || 0,
      auditLog: body.auditLog?.length || 0,
      pageVisits: body.pageVisits || 0,
    })

    // Load existing data
    const existingData = await loadData()

    // Merge with new data (only update provided fields)
    const updatedData = {
      categories: body.categories !== undefined ? body.categories : existingData.categories,
      users: body.users !== undefined ? body.users : existingData.users,
      auditLog: body.auditLog !== undefined ? body.auditLog : existingData.auditLog,
      pageVisits: body.pageVisits !== undefined ? body.pageVisits : existingData.pageVisits,
    }

    await saveData(updatedData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in POST /api/data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
