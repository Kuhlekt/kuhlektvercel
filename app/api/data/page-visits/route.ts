import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const PAGE_VISITS_FILE = path.join(DATA_DIR, "page-visits.json")

async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function getPageVisits(): Promise<number> {
  try {
    const data = await fs.readFile(PAGE_VISITS_FILE, "utf-8")
    const parsed = JSON.parse(data)
    return parsed.visits || 0
  } catch {
    // File doesn't exist, create it with 0 visits
    await fs.writeFile(PAGE_VISITS_FILE, JSON.stringify({ visits: 0 }, null, 2))
    return 0
  }
}

async function setPageVisits(visits: number): Promise<void> {
  await fs.writeFile(PAGE_VISITS_FILE, JSON.stringify({ visits }, null, 2))
}

export async function GET() {
  try {
    await ensureDataDirectory()
    const visits = await getPageVisits()
    return NextResponse.json({ visits })
  } catch (error) {
    console.error("Error getting page visits:", error)
    return NextResponse.json({ error: "Failed to get page visits" }, { status: 500 })
  }
}

export async function POST() {
  try {
    await ensureDataDirectory()
    const currentVisits = await getPageVisits()
    const newVisits = currentVisits + 1
    await setPageVisits(newVisits)
    return NextResponse.json({ visits: newVisits })
  } catch (error) {
    console.error("Error incrementing page visits:", error)
    return NextResponse.json({ error: "Failed to increment page visits" }, { status: 500 })
  }
}
