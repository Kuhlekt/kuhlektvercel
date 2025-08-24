import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Check if we're in a real Supabase environment
export const isMockMode = supabaseUrl === "https://placeholder.supabase.co" || supabaseAnonKey === "placeholder-key"

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock database for preview mode
export const mockDatabase = {
  categories: [
    {
      id: "1",
      name: "Getting Started",
      description: "Basic information and setup guides",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Documentation",
      description: "Technical documentation and guides",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "FAQ",
      description: "Frequently asked questions",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  articles: [
    {
      id: "1",
      title: "Welcome to the Knowledge Base",
      content: `# Welcome to the Knowledge Base

This is your comprehensive knowledge management system. Here you can find articles, guides, and documentation organized by categories.

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
      categoryId: "1",
      author: "System",
      tags: ["welcome", "introduction", "getting-started"],
      isPublished: true,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
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
      categoryId: "2",
      author: "System",
      tags: ["search", "navigation", "help"],
      isPublished: true,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  users: [
    {
      id: "1",
      username: "admin",
      password: "admin123",
      email: "admin@kuhlekt.com",
      role: "admin" as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "2",
      username: "editor",
      password: "editor123",
      email: "editor@kuhlekt.com",
      role: "editor" as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
    {
      id: "3",
      username: "viewer",
      password: "viewer123",
      email: "viewer@kuhlekt.com",
      role: "viewer" as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    },
  ],
  auditLog: [
    {
      id: "1",
      action: "system_init",
      performedBy: "System",
      timestamp: new Date().toISOString(),
      details: "Knowledge base initialized with default data",
    },
  ],
  pageVisits: 0,
}
