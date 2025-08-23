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
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }

  try {
    await fs.access(VISITS_FILE)
  } catch {
    const initialData: VisitsData = {
      count: 0,
      lastVisit: new Date().toISOString(),
    }
    await fs.writeFile(VISITS_FILE, JSON.stringify(initialData, null, 2))
  }
}

async function loadVisits(): Promise<VisitsData> {
  await ensureVisitsFile()
  try {
    const fileContent = await fs.readFile(VISITS_FILE, "utf-8")
    return JSON.parse(fileContent)
  } catch (error) {
    console.error("Error loading visits data:", error)
    return { count: 0, lastVisit: new Date().toISOString() }
  }
}

async function saveVisits(data: VisitsData): Promise<void> {
  await ensureVisitsFile()
  await fs.writeFile(VISITS_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    const data = await loadVisits()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/data/page-visits:", error)
    return NextResponse.json({ count: 0, lastVisit: new Date().toISOString() })
  }
}

export async function POST() {
  try {
    const data = await loadVisits()
    data.count += 1
    data.lastVisit = new Date().toISOString()
    await saveVisits(data)
    return NextResponse.json({ success: true, totalVisits: data.count })
  } catch (error) {
    console.error("Error in POST /api/data/page-visits:", error)
    return NextResponse.json({ success: false, error: "Failed to increment visits" }, { status: 500 })
  }
}
