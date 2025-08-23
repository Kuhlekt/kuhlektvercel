import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { KnowledgeBaseData } from "@/types/knowledge-base"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "knowledge-base.json")

// Ensure data directory exists
async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
    console.log("✅ Created data directory:", DATA_DIR)
  }
}

// Default data structure for production
const getDefaultData = (): KnowledgeBaseData => ({
  categories: [
    {
      id: "cat-getting-started",
      name: "Getting Started",
      description: "Essential information for new users",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat-user-guide",
      name: "User Guide",
      description: "How to use the system effectively",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat-admin",
      name: "Administration",
      description: "Admin tools and settings",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  articles: [
    {
      id: "art-welcome",
      title: "Welcome to the Knowledge Base",
      content: `# Welcome to the Knowledge Base

This is your comprehensive knowledge base system. Here you can find articles, guides, and documentation organized by categories.

## Features

- 📚 Browse articles by category
- 🔍 Search through content
- 👥 User management with different roles
- 📝 Create and edit articles
- 📊 Admin dashboard with analytics

## Getting Started

1. **Browse Articles**: Use the category tree on the left to navigate
2. **Search**: Use the search bar to find specific content
3. **Login**: Click the login button to access editing features
4. **Admin Panel**: Admins can manage users and view analytics

## Demo Accounts

- **admin** / admin123 - Full administrative access
- **editor** / editor123 - Can create and edit articles
- **viewer** / viewer123 - Read-only access

Enjoy exploring the knowledge base!`,
      categoryId: "cat-getting-started",
      author: "System",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ["welcome", "introduction", "getting-started"],
      views: 0,
    },
    {
      id: "art-search",
      title: "How to Search Articles",
      content: `# How to Search Articles

The knowledge base provides powerful search functionality to help you find the information you need quickly.

## Search Methods

### 1. Quick Search
Use the search bar at the top of the page to search across all articles:
- Search by **title**
- Search by **content**
- Search by **tags**

### 2. Category Browsing
Navigate using the category tree on the left sidebar:
- Click on categories to filter articles
- Expand subcategories for more specific content
- View article counts for each category

### 3. Advanced Filtering
- Filter by author
- Sort by date created or updated
- Filter by tags

## Search Tips

- Use specific keywords for better results
- Try different variations of your search terms
- Use tags to find related content
- Browse categories if you're not sure what to search for

Happy searching! 🔍`,
      categoryId: "cat-user-guide",
      author: "System",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ["search", "navigation", "help"],
      views: 0,
    },
    {
      id: "art-user-management",
      title: "Managing Users",
      content: `# Managing Users

Administrators can create, edit, and manage user accounts with different permission levels.

## User Roles

### 👑 Admin
- Full system access
- Manage users and categories
- View analytics and audit logs
- Create, edit, and delete articles

### ✏️ Editor
- Create and edit articles
- Manage their own content
- View published articles

### 👁️ Viewer
- Read-only access
- Browse and search articles
- No editing permissions

## User Management Tasks

### Creating Users
1. Go to Admin Dashboard
2. Click "User Management" tab
3. Click "Add New User"
4. Fill in user details and assign role
5. Save the user

### Editing Users
1. Find user in the user list
2. Click "Edit" button
3. Update user information
4. Save changes

### Deactivating Users
- Toggle the "Active" switch to disable user access
- Deactivated users cannot log in

## Security Best Practices

- Use strong passwords
- Regularly review user access
- Remove unused accounts
- Monitor audit logs for suspicious activity

## Audit Trail

All user actions are logged in the audit trail for security and compliance purposes.`,
      categoryId: "cat-admin",
      author: "System",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ["admin", "users", "security", "management"],
      views: 0,
    },
  ],
  users: [
    {
      id: "user-admin",
      username: "admin",
      password: "admin123",
      email: "admin@kuhlekt.com",
      role: "admin",
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "user-editor",
      username: "editor",
      password: "editor123",
      email: "editor@kuhlekt.com",
      role: "editor",
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "user-viewer",
      username: "viewer",
      password: "viewer123",
      email: "viewer@kuhlekt.com",
      role: "viewer",
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
  ],
  auditLog: [
    {
      id: "audit-init",
      action: "system_initialized",
      performedBy: "System",
      timestamp: new Date().toISOString(),
      details: "Knowledge base system initialized with default data",
    },
  ],
  pageVisits: 0,
  lastUpdated: new Date().toISOString(),
})

// Load data from file system
async function loadData(): Promise<KnowledgeBaseData> {
  try {
    await ensureDataDirectory()

    console.log("📖 Loading data from:", DATA_FILE)
    const data = await fs.readFile(DATA_FILE, "utf8")
    const parsedData = JSON.parse(data)

    console.log("✅ Data loaded successfully:", {
      categories: parsedData.categories?.length || 0,
      articles: parsedData.articles?.length || 0,
      users: parsedData.users?.length || 0,
      auditLog: parsedData.auditLog?.length || 0,
    })

    return parsedData
  } catch (error) {
    console.log("📝 No existing data file, creating default data")
    const defaultData = getDefaultData()
    await saveData(defaultData)
    return defaultData
  }
}

// Save data to file system
async function saveData(data: KnowledgeBaseData): Promise<void> {
  try {
    await ensureDataDirectory()

    // Create backup of existing data
    try {
      await fs.access(DATA_FILE)
      const backupFile = path.join(DATA_DIR, `backup-${Date.now()}.json`)
      await fs.copyFile(DATA_FILE, backupFile)
      console.log("📋 Created backup:", backupFile)
    } catch {
      // No existing file to backup
    }

    // Add metadata
    const dataWithMetadata = {
      ...data,
      lastUpdated: new Date().toISOString(),
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(dataWithMetadata, null, 2))
    console.log("✅ Data saved successfully")
  } catch (error) {
    console.error("❌ Error saving data:", error)
    throw new Error("Failed to save data to file system")
  }
}

// GET endpoint - Load data
export async function GET() {
  try {
    console.log("🔄 GET /api/data - Loading data...")
    const data = await loadData()

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ GET /api/data error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load data",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// POST endpoint - Save data
export async function POST(request: NextRequest) {
  try {
    console.log("💾 POST /api/data - Processing save request...")

    const body = await request.json()
    console.log("📦 Request body structure:", {
      hasData: !!body.data,
      hasCategories: !!body.categories,
      hasUsers: !!body.users,
      hasArticles: !!body.articles,
      hasAuditLog: !!body.auditLog,
      keys: Object.keys(body),
    })

    // Handle different data structures
    let dataToSave: KnowledgeBaseData

    if (body.data && typeof body.data === "object") {
      // Data wrapped in 'data' property
      dataToSave = body.data
      console.log("📦 Using wrapped data structure")
    } else if (body.categories || body.users || body.articles || body.auditLog) {
      // Data properties at root level
      dataToSave = body as KnowledgeBaseData
      console.log("📦 Using direct data structure")
    } else {
      console.error("❌ Invalid data structure received")
      return NextResponse.json(
        {
          success: false,
          error: "Invalid data structure - no valid data found",
          received: Object.keys(body),
        },
        { status: 400 },
      )
    }

    // Validate required fields
    if (!dataToSave.categories && !dataToSave.users && !dataToSave.articles && !dataToSave.auditLog) {
      console.error("❌ No valid data fields found")
      return NextResponse.json(
        {
          success: false,
          error: "No valid data fields found",
          received: Object.keys(dataToSave),
        },
        { status: 400 },
      )
    }

    // Load existing data and merge
    let existingData: KnowledgeBaseData
    try {
      existingData = await loadData()
    } catch {
      existingData = getDefaultData()
    }

    // Merge with existing data, preserving what's not provided
    const mergedData: KnowledgeBaseData = {
      categories: dataToSave.categories || existingData.categories,
      articles: dataToSave.articles || existingData.articles,
      users: dataToSave.users || existingData.users,
      auditLog: dataToSave.auditLog || existingData.auditLog,
      pageVisits: dataToSave.pageVisits !== undefined ? dataToSave.pageVisits : existingData.pageVisits,
      lastUpdated: new Date().toISOString(),
    }

    console.log("💾 Saving merged data:", {
      categories: mergedData.categories?.length || 0,
      articles: mergedData.articles?.length || 0,
      users: mergedData.users?.length || 0,
      auditLog: mergedData.auditLog?.length || 0,
      pageVisits: mergedData.pageVisits,
    })

    await saveData(mergedData)

    return NextResponse.json({
      success: true,
      message: "Data saved successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ POST /api/data error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save data",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
