import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const VISITS_FILE = path.join(DATA_DIR, "page-visits.json")

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Load page visits
async function loadPageVisits() {
  try {
    await ensureDataDir()
    const data = await fs.readFile(VISITS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return { visits: 0, lastVisit: null }
  }
}

// Save page visits
async function savePageVisits(data: any) {
  await ensureDataDir()
  await fs.writeFile(VISITS_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    const data = await loadPageVisits()
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ Page Visits API Error (GET):", error)
    return NextResponse.json({ error: "Failed to load page visits" }, { status: 500 })
  }
}

export async function POST() {
  try {
    const data = await loadPageVisits()
    const updatedData = {
      visits: (data.visits || 0) + 1,
      lastVisit: new Date().toISOString(),
    }
    await savePageVisits(updatedData)
    return NextResponse.json(updatedData)
  } catch (error) {
    console.error("❌ Page Visits API Error (POST):", error)
    return NextResponse.json({ error: "Failed to increment page visits" }, { status: 500 })
  }
}
