import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

export async function POST() {
  try {
    console.log("📈 API: Incrementing page visits...")

    // Read current data
    const fileContent = await fs.readFile(DATA_FILE, "utf-8")
    const data = JSON.parse(fileContent)

    // Increment page visits
    const currentVisits = typeof data.pageVisits === "number" ? data.pageVisits : 0
    const newVisits = currentVisits + 1

    // Update data
    const updatedData = {
      ...data,
      pageVisits: newVisits,
    }

    // Write back to file
    await fs.writeFile(DATA_FILE, JSON.stringify(updatedData, null, 2))

    console.log(`✅ API: Page visits incremented to ${newVisits}`)

    return NextResponse.json({
      success: true,
      pageVisits: newVisits,
    })
  } catch (error) {
    console.error("❌ API: Error incrementing page visits:", error)
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
