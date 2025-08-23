import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

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
    return JSON.parse(data)
  } catch (error) {
    // Return default structure if file doesn't exist
    return {
      categories: [],
      users: [],
      auditLog: [],
      pageVisits: 0,
    }
  }
}

async function saveData(data: any) {
  try {
    await ensureDataDirectory()
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error("❌ Error saving page visits data:", error)
    throw new Error("Failed to save page visits data")
  }
}

export async function GET() {
  try {
    console.log("📊 API GET /api/data/page-visits - Getting page visits...")
    const data = await loadData()

    return NextResponse.json({
      success: true,
      pageVisits: data.pageVisits || 0,
    })
  } catch (error) {
    console.error("❌ API GET /api/data/page-visits - Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get page visits",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("📈 API POST /api/data/page-visits - Incrementing page visits...")

    const data = await loadData()
    const newPageVisits = (data.pageVisits || 0) + 1

    const updatedData = {
      ...data,
      pageVisits: newPageVisits,
    }

    await saveData(updatedData)

    console.log(`✅ API POST /api/data/page-visits - Page visits incremented to: ${newPageVisits}`)

    return NextResponse.json({
      success: true,
      pageVisits: newPageVisits,
      message: "Page visits incremented successfully",
    })
  } catch (error) {
    console.error("❌ API POST /api/data/page-visits - Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to increment page visits",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
