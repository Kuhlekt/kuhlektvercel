import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function loadData() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(DATA_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    // Return minimal structure if file doesn't exist
    return { pageVisits: 0 }
  }
}

async function saveData(data: any) {
  try {
    await ensureDataDirectory()
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error("Error saving page visits:", error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("📈 API POST /api/data/page-visits - Incrementing page visits...")

    const data = await loadData()
    const currentVisits = typeof data.pageVisits === "number" ? data.pageVisits : 0
    const newVisits = currentVisits + 1

    // Update page visits
    const updatedData = {
      ...data,
      pageVisits: newVisits,
    }

    await saveData(updatedData)

    console.log(`✅ Page visits incremented to: ${newVisits}`)

    return NextResponse.json({
      success: true,
      pageVisits: newVisits,
    })
  } catch (error) {
    console.error("❌ Error incrementing page visits:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to increment page visits",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
