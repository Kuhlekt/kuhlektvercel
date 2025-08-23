import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const VISITS_FILE = path.join(DATA_DIR, "page-visits.json")

async function ensureVisitsFile() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }

  try {
    await fs.access(VISITS_FILE)
  } catch {
    await fs.writeFile(VISITS_FILE, JSON.stringify({ totalVisits: 0, dailyVisits: {} }, null, 2))
  }
}

export async function GET() {
  try {
    await ensureVisitsFile()
    const data = await fs.readFile(VISITS_FILE, "utf8")
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    console.error("Error reading visits file:", error)
    return NextResponse.json({ totalVisits: 0, dailyVisits: {} })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureVisitsFile()
    const { increment = 1 } = await request.json()

    let visitsData
    try {
      const data = await fs.readFile(VISITS_FILE, "utf8")
      visitsData = JSON.parse(data)
    } catch {
      visitsData = { totalVisits: 0, dailyVisits: {} }
    }

    const today = new Date().toISOString().split("T")[0]
    visitsData.totalVisits = (visitsData.totalVisits || 0) + increment
    visitsData.dailyVisits = visitsData.dailyVisits || {}
    visitsData.dailyVisits[today] = (visitsData.dailyVisits[today] || 0) + increment

    await fs.writeFile(VISITS_FILE, JSON.stringify(visitsData, null, 2))
    return NextResponse.json({ success: true, totalVisits: visitsData.totalVisits })
  } catch (error) {
    console.error("Error updating visits:", error)
    return NextResponse.json({ error: "Failed to update visits" }, { status: 500 })
  }
}
