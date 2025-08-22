import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "knowledge-base.json")

export async function POST() {
  try {
    console.log("📈 API POST /api/data/page-visits - Incrementing page visits...")

    // Read current data
    const data = await fs.readFile(DATA_FILE, "utf8")
    const parsed = JSON.parse(data)

    // Increment page visits
    const newPageVisits = (parsed.pageVisits || 0) + 1
    parsed.pageVisits = newPageVisits

    // Save updated data
    await fs.writeFile(DATA_FILE, JSON.stringify(parsed, null, 2))

    console.log(`✅ Page visits incremented to: ${newPageVisits}`)

    return NextResponse.json({ pageVisits: newPageVisits })
  } catch (error) {
    console.error("❌ Error incrementing page visits:", error)
    return NextResponse.json({ pageVisits: 0 })
  }
}
