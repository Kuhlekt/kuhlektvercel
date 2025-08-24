import type { KnowledgeBaseData } from "@/types/knowledge-base"

// In-memory database for production (since Vercel serverless doesn't support file system persistence)
let globalDatabase: KnowledgeBaseData | null = null

// Default data structure
const getDefaultData = (): KnowledgeBaseData => ({
  categories: [
    {
      id: "cat-1",
      name: "Getting Started",
      description: "Basic information and setup guides",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat-2",
      name: "Documentation",
      description: "Technical documentation and guides",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat-3",
      name: "FAQ",
      description: "Frequently asked questions and answers",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  articles: [
    {
      id: "art-1",
      title: "Welcome to Kuhlekt Knowledge Base",
      content: `# Welcome to Kuhlekt Knowledge Base

This is your comprehensive knowledge management system. Here you can:

- 📖 Browse articles organized by categories
- 🔍 Search through documentation
- ✏️ Create and edit articles (with proper permissions)
- 👥 Manage users and access levels
- 📊 View analytics and audit logs

## Demo Accounts

Try these accounts to explore different features:

**Administrator Account:**
- Username: admin
- Password: admin123
- Full access to all features

**Editor Account:**
- Username: editor  
- Password: editor123
- Can create and edit articles

**Viewer Account:**
- Username: viewer
- Password: viewer123
- Read-only access

## Getting Started

1. Click the "Login" button in the top navigation
2. Use one of the demo accounts above
3. Explore the knowledge base features
4. Create your own articles and categories

The system is designed to be intuitive and easy to use. Enjoy exploring!`,
      categoryId: "cat-1",
      author: "System",
      tags: ["welcome", "getting-started", "demo"],
      isPublished: true,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "art-2",
      title: "How to Create Articles",
      content: `# How to Create Articles

Creating articles in the knowledge base is simple and straightforward.

## Requirements

To create articles, you need:
- An account with **Editor** or **Administrator** role
- Access to the "Add Article" feature

## Steps to Create an Article

1. **Login** with your editor or admin account
2. Click **"Add Article"** in the navigation menu
3. Fill in the article details:
   - **Title**: Clear, descriptive title
   - **Category**: Choose appropriate category
   - **Content**: Write your article content
   - **Tags**: Add relevant tags for searchability

4. **Preview** your article before publishing
5. Click **"Save Article"** to publish

## Content Guidelines

- Use clear, concise language
- Structure content with headings
- Add relevant tags for better discoverability
- Choose the most appropriate category

## Best Practices

- Keep titles descriptive and searchable
- Use consistent formatting
- Include examples where helpful
- Update content regularly to keep it current

Happy writing! ✍️`,
      categoryId: "cat-2",
      author: "System",
      tags: ["tutorial", "article-creation", "documentation"],
      isPublished: true,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  users: [
    {
      id: "user-1",
      username: "admin",
      password: "admin123",
      email: "admin@kuhlekt.com",
      role: "admin",
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "user-2",
      username: "editor",
      password: "editor123",
      email: "editor@kuhlekt.com",
      role: "editor",
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "user-3",
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
      id: "audit-1",
      action: "system_initialized",
      performedBy: "System",
      timestamp: new Date().toISOString(),
      details: "Knowledge base system initialized with default data",
    },
  ],
  pageVisits: 0,
  settings: {
    siteName: "Kuhlekt Knowledge Base",
    description: "Comprehensive knowledge management system",
    version: "1.0.0",
  },
  stats: {
    totalUsers: 3,
    totalArticles: 2,
    totalCategories: 3,
    totalViews: 0,
    lastUpdated: new Date().toISOString(),
  },
})

// Initialize database
export function initializeDatabase(): KnowledgeBaseData {
  if (!globalDatabase) {
    console.log("🗄️ Initializing in-memory database...")
    globalDatabase = getDefaultData()
    console.log("✅ Database initialized with default data")
  }
  return globalDatabase
}

// Get current database
export function getDatabase(): KnowledgeBaseData {
  if (!globalDatabase) {
    return initializeDatabase()
  }
  return globalDatabase
}

// Update database
export function updateDatabase(data: Partial<KnowledgeBaseData>): KnowledgeBaseData {
  if (!globalDatabase) {
    globalDatabase = getDefaultData()
  }

  // Update stats
  const updatedData = {
    ...globalDatabase,
    ...data,
    stats: {
      totalUsers: data.users?.length || globalDatabase.users.length,
      totalArticles: data.articles?.length || globalDatabase.articles.length,
      totalCategories: data.categories?.length || globalDatabase.categories.length,
      totalViews:
        data.articles?.reduce((sum, article) => sum + article.views, 0) ||
        globalDatabase.articles.reduce((sum, article) => sum + article.views, 0),
      lastUpdated: new Date().toISOString(),
    },
  }

  globalDatabase = updatedData
  console.log("📝 Database updated successfully")
  return globalDatabase
}

// Reset database (for testing)
export function resetDatabase(): KnowledgeBaseData {
  console.log("🔄 Resetting database to default state...")
  globalDatabase = getDefaultData()
  return globalDatabase
}
