import type { User, Category, AuditLogEntry } from "@/types/knowledge-base"

interface DatabaseData {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  pageVisits: number
}

// Global in-memory database
let globalDatabase: DatabaseData | null = null

// Initialize with default data
function initializeDatabase(): DatabaseData {
  const now = new Date().toISOString()

  const defaultUsers: User[] = [
    {
      id: "1",
      username: "admin",
      email: "admin@kuhlekt.com",
      password: "admin123",
      role: "admin",
      createdAt: now,
      lastLogin: now,
      isActive: true,
    },
    {
      id: "2",
      username: "editor",
      email: "editor@kuhlekt.com",
      password: "editor123",
      role: "editor",
      createdAt: now,
      isActive: true,
    },
    {
      id: "3",
      username: "viewer",
      email: "viewer@kuhlekt.com",
      password: "viewer123",
      role: "viewer",
      createdAt: now,
      isActive: true,
    },
  ]

  const defaultCategories: Category[] = [
    {
      id: "1",
      name: "Getting Started",
      description: "Essential information for new users",
      createdAt: now,
      updatedAt: now,
      isActive: true,
      articles: [
        {
          id: "1",
          title: "Welcome to Kuhlekt Knowledge Base",
          content: `# Welcome to Kuhlekt Knowledge Base

This is your comprehensive knowledge management system. Here you can:

## Features
- **Organize Information**: Create categories and subcategories
- **Rich Content**: Write articles with full formatting support
- **User Management**: Control access with role-based permissions
- **Search**: Find information quickly with our search system
- **Audit Trail**: Track all changes and activities

## Getting Started
1. **Browse Categories**: Explore the different sections
2. **Search**: Use the search bar to find specific information
3. **Create Content**: Add new articles and categories (if you have permissions)
4. **Manage Users**: Admin users can manage user accounts

## User Roles
- **Admin**: Full access to all features
- **Editor**: Can create and edit content
- **Viewer**: Read-only access

Start exploring and make the most of your knowledge base!`,
          author: "System",
          createdAt: now,
          updatedAt: now,
          tags: ["welcome", "getting-started", "guide"],
          isPublished: true,
          views: 0,
        },
      ],
    },
    {
      id: "2",
      name: "User Guide",
      description: "How to use the knowledge base effectively",
      createdAt: now,
      updatedAt: now,
      isActive: true,
      articles: [
        {
          id: "2",
          title: "How to Search for Information",
          content: `# How to Search for Information

Our search system helps you find information quickly and efficiently.

## Search Features
- **Full-text search**: Search through article titles and content
- **Category filtering**: Filter results by category
- **Tag-based search**: Find articles by tags
- **Real-time results**: See results as you type

## Search Tips
1. **Use specific keywords**: More specific terms yield better results
2. **Try different variations**: Use synonyms if you don't find what you're looking for
3. **Use quotes**: Search for exact phrases using quotation marks
4. **Filter by category**: Narrow down results using category filters

## Advanced Search
- Use the category tree to browse by topic
- Check article tags for related content
- Use the "Recent Articles" section for latest updates

Happy searching!`,
          author: "System",
          createdAt: now,
          updatedAt: now,
          tags: ["search", "guide", "tips"],
          isPublished: true,
          views: 0,
        },
      ],
    },
  ]

  const defaultAuditLog: AuditLogEntry[] = [
    {
      id: "1",
      timestamp: now,
      userId: "system",
      username: "System",
      action: "system_init",
      details: "Knowledge base initialized with default data",
      ipAddress: "127.0.0.1",
    },
  ]

  return {
    categories: defaultCategories,
    users: defaultUsers,
    auditLog: defaultAuditLog,
    pageVisits: 0,
  }
}

export function getDatabase(): DatabaseData {
  if (!globalDatabase) {
    console.log("🔄 Initializing in-memory database...")
    globalDatabase = initializeDatabase()
    console.log("✅ Database initialized with default data")
  }
  return globalDatabase
}

export function updateDatabase(data: Partial<DatabaseData>): void {
  const db = getDatabase()

  if (data.categories !== undefined) db.categories = data.categories
  if (data.users !== undefined) db.users = data.users
  if (data.auditLog !== undefined) db.auditLog = data.auditLog
  if (data.pageVisits !== undefined) db.pageVisits = data.pageVisits

  console.log("💾 Database updated in memory")
}

export function resetDatabase(): void {
  console.log("🔄 Resetting database...")
  globalDatabase = initializeDatabase()
  console.log("✅ Database reset complete")
}
