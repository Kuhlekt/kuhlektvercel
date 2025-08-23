import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

async function loadData() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("❌ Error loading data for page visits:", error)
    return { pageVisits: [] }
  }
}

async function saveData(data: any) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error("❌ Error saving page visit data:", error)
    throw error
  }
}

export async function GET() {
  try {
    const data = await loadData()
    return NextResponse.json({ pageVisits: data.pageVisits || [] })
  } catch (error) {
    console.error("❌ GET /api/data/page-visits - Error:", error)
    return NextResponse.json({ error: "Failed to load page visits" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { page, timestamp, userAgent, ipAddress } = await request.json()

    const data = await loadData()

    if (!data.pageVisits) {
      data.pageVisits = []
    }

    const visit = {
      id: Date.now().toString(),
      page,
      timestamp: timestamp || new Date().toISOString(),
      userAgent: userAgent || request.headers.get("user-agent") || "Unknown",
      ipAddress: ipAddress || request.ip || request.headers.get("x-forwarded-for") || "Unknown",
    }

    data.pageVisits.push(visit)

    // Keep only last 1000 visits to prevent file from growing too large
    if (data.pageVisits.length > 1000) {
      data.pageVisits = data.pageVisits.slice(-1000)
    }

    await saveData(data)

    return NextResponse.json({ success: true, visit })
  } catch (error) {
    console.error("❌ POST /api/data/page-visits - Error:", error)
    return NextResponse.json({ error: "Failed to record page visit" }, { status: 500 })
  }
}
