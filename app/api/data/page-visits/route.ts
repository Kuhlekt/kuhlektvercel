import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const VISITS_FILE = path.join(DATA_DIR, "page-visits.json")

interface VisitsData {
  count: number
  lastVisit: string
}

async function ensureVisitsFile(): Promise<void> {
  try {
    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true })

    // Check if visits file exists
    try {
      await fs.access(VISITS_FILE)
      console.log("✅ Visits file exists")
    } catch {
      console.log("📄 Creating visits file...")
      const initialData: VisitsData = {
        count: 0,
        lastVisit: new Date().toISOString(),
      }
      await fs.writeFile(VISITS_FILE, JSON.stringify(initialData, null, 2))
      console.log("✅ Visits file created")
    }
  } catch (error) {
    console.error("❌ Error ensuring visits file:", error)
    throw error
  }
}

async function loadVisits(): Promise<VisitsData> {
  try {
    await ensureVisitsFile()
    const fileContent = await fs.readFile(VISITS_FILE, "utf-8")
    const data = JSON.parse(fileContent)

    // Validate data structure
    if (typeof data.count !== "number") {
      data.count = 0
    }
    if (typeof data.lastVisit !== "string") {
      data.lastVisit = new Date().toISOString()
    }

    return data
  } catch (error) {
    console.error("❌ Error loading visits data, using defaults:", error)
    return {
      count: 0,
      lastVisit: new Date().toISOString(),
    }
  }
}

async function saveVisits(data: VisitsData): Promise<void> {
  try {
    await ensureVisitsFile()
    await fs.writeFile(VISITS_FILE, JSON.stringify(data, null, 2))
    console.log("✅ Visits data saved successfully")
  } catch (error) {
    console.error("❌ Error saving visits data:", error)
    throw error
  }
}

export async function GET() {
  try {
    console.log("📊 GET /api/data/page-visits - Loading visits...")
    const data = await loadVisits()
    console.log("✅ GET /api/data/page-visits - Success:", data)
    return NextResponse.json({ success: true, ...data })
  } catch (error) {
    console.error("❌ GET /api/data/page-visits - Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load page visits",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    console.log("📊 POST /api/data/page-visits - Incrementing visits...")

    const data = await loadVisits()
    data.count += 1
    data.lastVisit = new Date().toISOString()

    await saveVisits(data)

    console.log("✅ POST /api/data/page-visits - Success:", { count: data.count })
    return NextResponse.json({ success: true, totalVisits: data.count })
  } catch (error) {
    console.error("❌ POST /api/data/page-visits - Error:", error)
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
