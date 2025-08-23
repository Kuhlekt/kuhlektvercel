import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "knowledge-base.json")

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Load data from file
async function loadData() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(DATA_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error loading data for page visits:", error)
    return { pageVisits: 0 }
  }
}

// Save data to file
async function saveData(data: any) {
  try {
    await ensureDataDirectory()
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error("Error saving data for page visits:", error)
    throw error
  }
}

export async function POST() {
  try {
    console.log("📈 Incrementing page visits...")

    const data = await loadData()
    const updatedData = {
      ...data,
      pageVisits: (data.pageVisits || 0) + 1,
    }

    await saveData(updatedData)

    console.log(`✅ Page visits incremented to: ${updatedData.pageVisits}`)

    return NextResponse.json({ pageVisits: updatedData.pageVisits })
  } catch (error) {
    console.error("❌ Error incrementing page visits:", error)
    return NextResponse.json({ error: "Failed to increment page visits" }, { status: 500 })
  }
}
