import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const PAGE_VISITS_FILE = path.join(DATA_DIR, "page-visits.json")

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function ensurePageVisitsFile() {
  await ensureDataDir()
  try {
    await fs.access(PAGE_VISITS_FILE)
  } catch {
    await fs.writeFile(PAGE_VISITS_FILE, JSON.stringify({ visits: 0 }, null, 2))
  }
}

export async function GET() {
  try {
    await ensurePageVisitsFile()
    const data = await fs.readFile(PAGE_VISITS_FILE, "utf-8")
    const pageVisits = JSON.parse(data)
    return NextResponse.json({ visits: pageVisits.visits || 0 })
  } catch (error) {
    console.error("Error reading page visits:", error)
    return NextResponse.json({ visits: 0 })
  }
}

export async function POST() {
  try {
    await ensurePageVisitsFile()
    const data = await fs.readFile(PAGE_VISITS_FILE, "utf-8")
    const pageVisits = JSON.parse(data)
    const newVisits = (pageVisits.visits || 0) + 1

    await fs.writeFile(PAGE_VISITS_FILE, JSON.stringify({ visits: newVisits }, null, 2))
    return NextResponse.json({ visits: newVisits })
  } catch (error) {
    console.error("Error incrementing page visits:", error)
    return NextResponse.json({ error: "Failed to increment page visits" }, { status: 500 })
  }
}
