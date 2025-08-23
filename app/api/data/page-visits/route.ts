import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "knowledge-base.json")

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json()

    if (!articleId) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 })
    }

    // Read current data
    const fileContent = await fs.readFile(DATA_FILE, "utf-8")
    const data = JSON.parse(fileContent)

    // Find and update article
    const article = data.articles.find((a: any) => a.id === articleId)
    if (article) {
      article.views = (article.views || 0) + 1
      article.lastViewedAt = new Date().toISOString()
    }

    // Update stats
    data.stats.totalViews = data.articles.reduce((sum: number, article: any) => sum + (article.views || 0), 0)
    data.stats.lastUpdated = new Date().toISOString()

    // Save updated data
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))

    return NextResponse.json({
      success: true,
      views: article?.views || 0,
    })
  } catch (error) {
    console.error("POST /api/data/page-visits error:", error)
    return NextResponse.json({ error: "Failed to update page visits" }, { status: 500 })
  }
}
