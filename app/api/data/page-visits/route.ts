import { NextResponse } from "next/server"
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
    // Return default structure if file doesn't exist
    return {
      categories: [],
      users: [],
      auditLog: [],
      pageVisits: 0,
    }
  }
}

async function saveData(data: any) {
  try {
    await ensureDataDirectory()
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error("Error saving data:", error)
    throw new Error("Failed to save data")
  }
}

export async function GET() {
  try {
    const data = await loadData()
    return NextResponse.json({
      success: true,
      pageVisits: data.pageVisits || 0,
    })
  } catch (error) {
    console.error("Error getting page visits:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get page visits",
        pageVisits: 0,
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    const data = await loadData()
    const newPageVisits = (data.pageVisits || 0) + 1

    const updatedData = {
      ...data,
      pageVisits: newPageVisits,
    }

    await saveData(updatedData)

    return NextResponse.json({
      success: true,
      pageVisits: newPageVisits,
    })
  } catch (error) {
    console.error("Error incrementing page visits:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to increment page visits",
        pageVisits: 0,
      },
      { status: 500 },
    )
  }
}
