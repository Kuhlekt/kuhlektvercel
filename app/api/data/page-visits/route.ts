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
async function loadPageVisits(): Promise<number> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(VISITS_FILE, "utf-8")
    const parsed = JSON.parse(data)
    return parsed.visits || 0
  } catch {
    return 0
  }
}

// Save page visits
async function savePageVisits(visits: number): Promise<void> {
  try {
    await ensureDataDir()
    await fs.writeFile(VISITS_FILE, JSON.stringify({ visits, lastUpdated: new Date() }, null, 2))
    console.log("✅ Page visits saved:", visits)
  } catch (error) {
    console.error("Error saving page visits:", error)
    throw new Error("Failed to save page visits")
  }
}

export async function GET() {
  try {
    console.log("📊 GET /api/data/page-visits - Loading visits...")
    const visits = await loadPageVisits()
    return NextResponse.json({ success: true, visits })
  } catch (error) {
    console.error("GET /api/data/page-visits error:", error)
    return NextResponse.json({ success: false, error: "Failed to load page visits" }, { status: 500 })
  }
}

export async function POST() {
  try {
    console.log("📊 POST /api/data/page-visits - Incrementing visits...")
    const currentVisits = await loadPageVisits()
    const newVisits = currentVisits + 1
    await savePageVisits(newVisits)
    return NextResponse.json({ success: true, visits: newVisits })
  } catch (error) {
    console.error("POST /api/data/page-visits error:", error)
    return NextResponse.json({ success: false, error: "Failed to increment page visits" }, { status: 500 })
  }
}
