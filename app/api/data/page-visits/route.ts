import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "knowledge-base.json")

export async function POST() {
  try {
    const data = JSON.parse(await fs.readFile(DATA_FILE, "utf-8"))
    data.pageVisits = (data.pageVisits || 0) + 1
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))

    return NextResponse.json({ pageVisits: data.pageVisits })
  } catch (error) {
    console.error("Error incrementing page visits:", error)
    return NextResponse.json({ error: "Failed to increment page visits" }, { status: 500 })
  }
}
