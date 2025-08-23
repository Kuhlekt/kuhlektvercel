import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const VISITS_FILE = path.join(DATA_DIR, "page-visits.json")

interface PageVisitData {
  pageVisits: number
  lastVisit: string
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Load page visits data
async function loadPageVisits(): Promise<PageVisitData> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(VISITS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    const defaultData: PageVisitData = {
      pageVisits: 0,
      lastVisit: new Date().toISOString(),
    }
    await savePageVisits(defaultData)
    return defaultData
  }
}

// Save page visits data
async function savePageVisits(data: PageVisitData): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(VISITS_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    const data = await loadPageVisits()
    return NextResponse.json({
      success: true,
      pageVisits: data.pageVisits,
      lastVisit: data.lastVisit,
    })
  } catch (error) {
    console.error("❌ GET /api/data/page-visits - Error:", error)
    return NextResponse.json({ success: false, error: "Failed to get page visits" }, { status: 500 })
  }
}

export async function POST() {
  try {
    const data = await loadPageVisits()
    const updatedData: PageVisitData = {
      pageVisits: data.pageVisits + 1,
      lastVisit: new Date().toISOString(),
    }

    await savePageVisits(updatedData)

    console.log(`📈 Page visit recorded: ${updatedData.pageVisits}`)

    return NextResponse.json({
      success: true,
      pageVisits: updatedData.pageVisits,
      lastVisit: updatedData.lastVisit,
    })
  } catch (error) {
    console.error("❌ POST /api/data/page-visits - Error:", error)
    return NextResponse.json({ success: false, error: "Failed to record page visit" }, { status: 500 })
  }
}
