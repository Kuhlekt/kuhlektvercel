import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const VISITS_FILE_PATH = path.join(process.cwd(), "data", "page-visits.json")

interface PageVisitsData {
  count: number
  lastVisit: string
}

async function ensureDataDirectory() {
  const dataDir = path.dirname(VISITS_FILE_PATH)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function loadVisits(): Promise<PageVisitsData> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(VISITS_FILE_PATH, "utf-8")
    return JSON.parse(data)
  } catch {
    return { count: 0, lastVisit: new Date().toISOString() }
  }
}

async function saveVisits(data: PageVisitsData): Promise<void> {
  await ensureDataDirectory()
  await fs.writeFile(VISITS_FILE_PATH, JSON.stringify(data, null, 2), "utf-8")
}

export async function GET() {
  try {
    const visits = await loadVisits()
    return NextResponse.json(visits)
  } catch (error) {
    console.error("Error loading page visits:", error)
    return NextResponse.json({ error: "Failed to load page visits" }, { status: 500 })
  }
}

export async function POST() {
  try {
    const visits = await loadVisits()
    const updatedVisits = {
      count: visits.count + 1,
      lastVisit: new Date().toISOString(),
    }
    await saveVisits(updatedVisits)
    return NextResponse.json(updatedVisits)
  } catch (error) {
    console.error("Error incrementing page visits:", error)
    return NextResponse.json({ error: "Failed to increment page visits" }, { status: 500 })
  }
}
