import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const VISITS_FILE = path.join(DATA_DIR, "page-visits.json")

async function ensureVisitsFile() {
  try {
    // Ensure data directory exists
    try {
      await fs.access(DATA_DIR)
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true })
    }

    // Check if visits file exists
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
    console.error("Error ensuring visits file:", error)
  }
}

export async function GET() {
  try {
    await ensureVisitsFile()
    const data = await fs.readFile(VISITS_FILE, "utf-8")
    const visitsData = JSON.parse(data)

    return NextResponse.json({
      totalVisits: visitsData.totalVisits || 0,
      visits: visitsData.visits || [],
    })
  } catch (error) {
    console.error("Error reading visits file:", error)
    return NextResponse.json({ totalVisits: 0, visits: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureVisitsFile()

    let visitsData
    try {
      const data = await fs.readFile(VISITS_FILE, "utf-8")
      visitsData = JSON.parse(data)
    } catch {
      visitsData = { totalVisits: 0, visits: [] }
    }

    const newVisit = {
      timestamp: new Date().toISOString(),
      page: "/",
    }

    const updatedData = {
      totalVisits: (visitsData.totalVisits || 0) + 1,
      visits: [...(visitsData.visits || []), newVisit].slice(-100), // Keep last 100 visits
    }

    await fs.writeFile(VISITS_FILE, JSON.stringify(updatedData, null, 2))

    return NextResponse.json({
      success: true,
      totalVisits: updatedData.totalVisits,
    })
  } catch (error) {
    console.error("Error updating visits:", error)
    return NextResponse.json({ error: "Failed to record visit" }, { status: 500 })
  }
}
