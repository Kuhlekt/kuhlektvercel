import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { KnowledgeBaseData } from "@/types/knowledge-base"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

// Default data structure
const DEFAULT_DATA: KnowledgeBaseData = {
  categories: [
    {
      id: "cat-1",
      name: "Getting Started",
      description: "Basic information and setup guides",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articles: [
        {
          id: "art-1",
          title: "Welcome to the Knowledge Base",
          content: "This is your first article. You can edit or delete it.",
          categoryId: "cat-1",
          authorId: "user-1",
          tags: ["welcome", "introduction"],
          isPublished: true,
          viewCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: "cat-2",
      name: "Documentation",
      description: "Technical documentation and guides",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articles: [],
    },
    {
      id: "cat-3",
      name: "FAQ",
      description: "Frequently asked questions",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articles: [],
    },
  ],
  articles: [
    {
      id: "art-1",
      title: "Welcome to the Knowledge Base",
      content: "This is your first article. You can edit or delete it.",
      categoryId: "cat-1",
      authorId: "user-1",
      tags: ["welcome", "introduction"],
      isPublished: true,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  users: [
    {
      id: "user-1",
      username: "admin",
      password: "admin123",
      email: "admin@example.com",
      role: "admin",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-2",
      username: "editor",
      password: "editor123",
      email: "editor@example.com",
      role: "editor",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-3",
      username: "viewer",
      password: "viewer123",
      email: "viewer@example.com",
      role: "viewer",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ],
  auditLog: [],
  pageVisits: 0,
}

async function ensureDataFile(): Promise<void> {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }

  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2))
  }
}

async function loadData(): Promise<KnowledgeBaseData> {
  await ensureDataFile()
  try {
    const fileContent = await fs.readFile(DATA_FILE, "utf-8")
    return JSON.parse(fileContent)
  } catch (error) {
    console.error("Error loading data, using defaults:", error)
    return DEFAULT_DATA
  }
}

async function saveData(data: KnowledgeBaseData): Promise<void> {
  await ensureDataFile()
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    const data = await loadData()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/data:", error)
    return NextResponse.json(DEFAULT_DATA)
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    await saveData(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in POST /api/data:", error)
    return NextResponse.json({ success: false, error: "Failed to save data" }, { status: 500 })
  }
}
