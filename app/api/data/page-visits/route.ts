import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const VISITS_FILE = path.join(DATA_DIR, "page-visits.json")

async function ensureVisitsFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })

    try {
      await fs.access(VISITS_FILE)
    } catch {
      // File doesn't exist, create it
      const initialData = {
        totalVisits: 0,
        visits: [],
      }
      await fs.writeFile(VISITS_FILE, JSON.stringify(initialData, null, 2))
    }
  } catch (error) {
    console.error("❌ Error ensuring visits file:", error)
  }
}

async function loadVisits() {
  try {
    await ensureVisitsFile()
    const data = await fs.readFile(VISITS_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.error("❌ Error loading visits:", error)
    return { totalVisits: 0, visits: [] }
  }
}

async function saveVisits(data: any) {
  try {
    await ensureVisitsFile()
    await fs.writeFile(VISITS_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error("❌ Error saving visits:", error)
  }
}

export async function GET() {
  try {
    const data = await loadVisits()
    return NextResponse.json({
      success: true,
      totalVisits: data.totalVisits || 0,
      visits: data.visits || [],
    })
  } catch (error) {
    console.error("❌ GET /api/data/page-visits - Error:", error)
    return NextResponse.json({ success: false, error: "Failed to load page visits" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await loadVisits()

    const newVisit = {
      timestamp: new Date().toISOString(),
      page: "/",
    }

    const updatedData = {
      totalVisits: (data.totalVisits || 0) + 1,
      visits: [...(data.visits || []), newVisit].slice(-100), // Keep last 100 visits
    }

    await saveVisits(updatedData)

    return NextResponse.json({
      success: true,
      totalVisits: updatedData.totalVisits,
    })
  } catch (error) {
    console.error("❌ POST /api/data/page-visits - Error:", error)
    return NextResponse.json({ success: false, error: "Failed to record page visit" }, { status: 500 })
  }
}
