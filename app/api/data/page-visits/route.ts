import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { KnowledgeBaseData } from "@/types/knowledge-base"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

// Ensure data directory exists
async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Load current data
async function loadCurrentData(): Promise<KnowledgeBaseData> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(DATA_FILE, "utf8")
    return JSON.parse(data)
  } catch {
    // Return minimal structure if file doesn't exist
    return {
      categories: [],
      articles: [],
      users: [],
      auditLog: [],
      pageVisits: 0,
      lastUpdated: new Date().toISOString(),
    }
  }
}

// Save updated data
async function saveData(data: KnowledgeBaseData): Promise<void> {
  try {
    await ensureDataDirectory()
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error("Error saving page visits:", error)
    throw new Error("Failed to save page visits")
  }
}

// POST endpoint - Increment page visits
export async function POST() {
  try {
    console.log("📈 POST /api/data/page-visits - Incrementing page visits...")

    const currentData = await loadCurrentData()

    // Increment page visits
    currentData.pageVisits = (currentData.pageVisits || 0) + 1
    currentData.lastUpdated = new Date().toISOString()

    await saveData(currentData)

    console.log("✅ Page visits incremented to:", currentData.pageVisits)

    return NextResponse.json({
      success: true,
      pageVisits: currentData.pageVisits,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error incrementing page visits:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to increment page visits",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// GET endpoint - Get current page visits
export async function GET() {
  try {
    console.log("📊 GET /api/data/page-visits - Getting page visits...")

    const currentData = await loadCurrentData()

    return NextResponse.json({
      success: true,
      pageVisits: currentData.pageVisits || 0,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error getting page visits:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get page visits",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
