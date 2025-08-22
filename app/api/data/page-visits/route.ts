import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "knowledge-base.json")

export async function POST() {
  try {
    console.log("📈 API POST /api/data/page-visits - Incrementing page visits...")

    // Load current data
    let data
    try {
      const fileContent = await fs.readFile(DATA_FILE, "utf8")
      data = JSON.parse(fileContent)
    } catch {
      data = { pageVisits: 0 }
    }

    // Increment page visits
    data.pageVisits = (data.pageVisits || 0) + 1

    // Save back to file
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))

    console.log(`✅ Page visits incremented to: ${data.pageVisits}`)

    return NextResponse.json({ pageVisits: data.pageVisits })
  } catch (error) {
    console.error("❌ Error incrementing page visits:", error)
    return NextResponse.json({ pageVisits: 0 })
  }
}
