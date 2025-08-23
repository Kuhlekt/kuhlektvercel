import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const VISITS_FILE = path.join(DATA_DIR, "page-visits.json")

interface PageVisitsData {
  count: number
  lastUpdated: string
}

async function getPageVisits(): Promise<PageVisitsData> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })

    try {
      const data = await fs.readFile(VISITS_FILE, "utf8")
      return JSON.parse(data)
    } catch {
      // File doesn't exist, create default
      const defaultData: PageVisitsData = {
        count: 0,
        lastUpdated: new Date().toISOString(),
      }
      await fs.writeFile(VISITS_FILE, JSON.stringify(defaultData, null, 2))
      return defaultData
    }
  } catch (error) {
    console.error("Error getting page visits:", error)
    return { count: 0, lastUpdated: new Date().toISOString() }
  }
}

async function incrementPageVisits(): Promise<PageVisitsData> {
  try {
    const current = await getPageVisits()
    const updated: PageVisitsData = {
      count: current.count + 1,
      lastUpdated: new Date().toISOString(),
    }

    await fs.writeFile(VISITS_FILE, JSON.stringify(updated, null, 2))
    return updated
  } catch (error) {
    console.error("Error incrementing page visits:", error)
    return { count: 0, lastUpdated: new Date().toISOString() }
  }
}

export async function GET() {
  try {
    const data = await getPageVisits()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/data/page-visits:", error)
    return NextResponse.json({ error: "Failed to get page visits" }, { status: 500 })
  }
}

export async function POST() {
  try {
    const data = await incrementPageVisits()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in POST /api/data/page-visits:", error)
    return NextResponse.json({ error: "Failed to increment page visits" }, { status: 500 })
  }
}
