import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "knowledge-base.json")

// Load data from file
async function loadData() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("❌ Error loading data for page visits:", error)
    // Return minimal structure if file doesn't exist
    return {
      categories: [],
      users: [],
      auditLog: [],
      pageVisits: 0,
    }
  }
}

// Save data to file
async function saveData(data: any) {
  try {
    const dataDir = path.dirname(DATA_FILE)
    await fs.mkdir(dataDir, { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error("❌ Error saving data for page visits:", error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("📈 API POST /api/data/page-visits - Incrementing page visits...")

    // Load current data
    const currentData = await loadData()

    // Increment page visits
    const updatedData = {
      ...currentData,
      pageVisits: (currentData.pageVisits || 0) + 1,
    }

    // Save updated data
    await saveData(updatedData)

    console.log(`✅ Page visits incremented to: ${updatedData.pageVisits}`)

    return NextResponse.json({
      success: true,
      pageVisits: updatedData.pageVisits,
    })
  } catch (error) {
    console.error("❌ API POST /api/data/page-visits - Error:", error)

    // Return success with 0 to prevent blocking the app
    return NextResponse.json(
      {
        success: false,
        pageVisits: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 },
    ) // Return 200 to prevent blocking
  }
}
