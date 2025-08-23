import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

async function loadData() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    return { pageVisits: 0 }
  }
}

async function saveData(data: any) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error("Error saving page visits:", error)
    return false
  }
}

export async function POST() {
  try {
    const data = await loadData()
    data.pageVisits = (data.pageVisits || 0) + 1

    const saved = await saveData(data)
    if (saved) {
      return NextResponse.json({ pageVisits: data.pageVisits })
    } else {
      // Return success even if save fails to not block the app
      return NextResponse.json({ pageVisits: data.pageVisits - 1 })
    }
  } catch (error) {
    console.error("Error incrementing page visits:", error)
    // Return success to not block the app
    return NextResponse.json({ pageVisits: 0 })
  }
}
