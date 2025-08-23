import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { KnowledgeBaseData } from "@/types/knowledge-base"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

async function loadData(): Promise<KnowledgeBaseData | null> {
  try {
    const fileContent = await fs.readFile(DATA_FILE, "utf-8")
    return JSON.parse(fileContent)
  } catch {
    return null
  }
}

async function saveData(data: KnowledgeBaseData): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

export async function POST() {
  try {
    const data = await loadData()

    if (!data) {
      return NextResponse.json({ success: false, error: "Data not found" }, { status: 404 })
    }

    data.pageVisits = (data.pageVisits || 0) + 1
    await saveData(data)

    return NextResponse.json({
      success: true,
      pageVisits: data.pageVisits,
    })
  } catch (error) {
    console.error("Error incrementing page visits:", error)
    return NextResponse.json({ success: false, error: "Failed to increment page visits" }, { status: 500 })
  }
}
