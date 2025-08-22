import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const VISITS_FILE = path.join(process.cwd(), "data", "page-visits.json")

async function ensureDataDirectory() {
  const dataDir = path.dirname(VISITS_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function loadVisits() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(VISITS_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, start with 0
    const defaultData = { visits: 0 }
    await saveVisits(defaultData)
    return defaultData
  }
}

async function saveVisits(data: any) {
  await ensureDataDirectory()
  await fs.writeFile(VISITS_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    const data = await loadVisits()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error loading visits:", error)
    return NextResponse.json({ error: "Failed to load visits" }, { status: 500 })
  }
}

export async function POST() {
  try {
    const data = await loadVisits()
    const newData = { visits: data.visits + 1 }
    await saveVisits(newData)
    return NextResponse.json(newData)
  } catch (error) {
    console.error("Error incrementing visits:", error)
    return NextResponse.json({ error: "Failed to increment visits" }, { status: 500 })
  }
}
