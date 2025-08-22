import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const FILES = {
  CATEGORIES: path.join(DATA_DIR, "categories.json"),
  USERS: path.join(DATA_DIR, "users.json"),
  AUDIT_LOG: path.join(DATA_DIR, "audit-log.json"),
  PAGE_VISITS: path.join(DATA_DIR, "page-visits.json"),
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Initialize files with default data if they don't exist
async function initializeFiles() {
  await ensureDataDir()

  // Default users with demo accounts
  const defaultUsers = [
    {
      id: "1",
      username: "admin",
      password: "admin123",
      email: "admin@kuhlekt.com",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      username: "editor",
      password: "editor123",
      email: "editor@kuhlekt.com",
      role: "editor",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      username: "viewer",
      password: "viewer123",
      email: "viewer@kuhlekt.com",
      role: "viewer",
      createdAt: new Date().toISOString(),
    },
  ]

  const defaultCategories = [
    {
      id: "1",
      name: "Getting Started",
      description: "Essential information for new users",
      articles: [
        {
          id: "1",
          title: "Welcome to Kuhlekt Knowledge Base",
          content:
            "# Welcome to Kuhlekt Knowledge Base\n\nThis is your central hub for all company knowledge and documentation.\n\n## Demo Accounts\n\n- **Admin**: admin / admin123\n- **Editor**: editor / editor123  \n- **Viewer**: viewer / viewer123\n\n## Features\n\n- Create and organize articles\n- Manage categories and subcategories\n- User role management\n- Audit logging\n- Data export/import\n\nStart exploring by browsing categories or creating new content!",
          categoryId: "1",
          tags: ["welcome", "getting-started"],
          createdBy: "admin",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          editCount: 0,
        },
      ],
      subcategories: [],
    },
  ]

  const defaultAuditLog = [
    {
      id: "1",
      action: "article_created",
      articleId: "1",
      articleTitle: "Welcome to Kuhlekt Knowledge Base",
      categoryId: "1",
      categoryName: "Getting Started",
      performedBy: "admin",
      timestamp: new Date().toISOString(),
      details: "Initial welcome article created",
    },
  ]

  const defaultPageVisits = { visits: 0 }

  // Initialize files if they don't exist
  for (const [key, filePath] of Object.entries(FILES)) {
    try {
      await fs.access(filePath)
    } catch {
      let defaultData
      switch (key) {
        case "CATEGORIES":
          defaultData = defaultCategories
          break
        case "USERS":
          defaultData = defaultUsers
          break
        case "AUDIT_LOG":
          defaultData = defaultAuditLog
          break
        case "PAGE_VISITS":
          defaultData = defaultPageVisits
          break
        default:
          defaultData = []
      }
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2))
    }
  }
}

export async function GET() {
  try {
    await initializeFiles()

    const [categories, users, auditLog, pageVisitsData] = await Promise.all([
      fs.readFile(FILES.CATEGORIES, "utf-8").then(JSON.parse),
      fs.readFile(FILES.USERS, "utf-8").then(JSON.parse),
      fs.readFile(FILES.AUDIT_LOG, "utf-8").then(JSON.parse),
      fs.readFile(FILES.PAGE_VISITS, "utf-8").then(JSON.parse),
    ])

    return NextResponse.json({
      categories,
      users,
      auditLog,
      pageVisits: pageVisitsData.visits || 0,
    })
  } catch (error) {
    console.error("Error reading data:", error)
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeFiles()
    const data = await request.json()

    // Write data to files
    if (data.categories) {
      await fs.writeFile(FILES.CATEGORIES, JSON.stringify(data.categories, null, 2))
    }
    if (data.users) {
      await fs.writeFile(FILES.USERS, JSON.stringify(data.users, null, 2))
    }
    if (data.auditLog) {
      await fs.writeFile(FILES.AUDIT_LOG, JSON.stringify(data.auditLog, null, 2))
    }
    if (data.pageVisits !== undefined) {
      await fs.writeFile(FILES.PAGE_VISITS, JSON.stringify({ visits: data.pageVisits }, null, 2))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error writing data:", error)
    return NextResponse.json({ error: "Failed to write data" }, { status: 500 })
  }
}
