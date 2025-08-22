import type { Category, User, AuditLogEntry } from "@/types/knowledge-base"

// Local storage keys
const STORAGE_KEYS = {
  CATEGORIES: "kb_categories",
  USERS: "kb_users",
  AUDIT_LOG: "kb_audit_log",
  PAGE_VISITS: "kb_page_visits",
  CURRENT_USER: "kb_current_user",
} as const

// Helper function to safely parse JSON from localStorage
function safeParseJSON<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = localStorage.getItem(key)
    if (!item) return defaultValue

    const parsed = JSON.parse(item)

    // Convert date strings back to Date objects
    const convertDates = (obj: any): any => {
      if (obj === null || obj === undefined) return obj
      if (typeof obj === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
        return new Date(obj)
      }
      if (Array.isArray(obj)) {
        return obj.map(convertDates)
      }
      if (typeof obj === "object") {
        const converted: any = {}
        for (const [key, value] of Object.entries(obj)) {
          converted[key] = convertDates(value)
        }
        return converted
      }
      return obj
    }

    return convertDates(parsed)
  } catch (error) {
    console.error(`Error parsing JSON from localStorage key "${key}":`, error)
    return defaultValue
  }
}

// Helper function to safely stringify and save to localStorage
function safeSaveJSON(key: string, value: any): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error)
  }
}

// Storage utility class
export class Storage {
  // Categories
  getCategories(): Category[] {
    return safeParseJSON(STORAGE_KEYS.CATEGORIES, [])
  }

  saveCategories(categories: Category[]): void {
    safeSaveJSON(STORAGE_KEYS.CATEGORIES, categories)
  }

  // Users
  getUsers(): User[] {
    const defaultUsers: User[] = [
      {
        id: "admin-001",
        username: "admin",
        password: "admin123",
        email: "admin@kuhlekt.com",
        role: "admin",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        lastLogin: null,
      },
      {
        id: "editor-001",
        username: "editor",
        password: "editor123",
        email: "editor@kuhlekt.com",
        role: "editor",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        lastLogin: null,
      },
      {
        id: "viewer-001",
        username: "viewer",
        password: "viewer123",
        email: "viewer@kuhlekt.com",
        role: "viewer",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        lastLogin: null,
      },
    ]

    const users = safeParseJSON(STORAGE_KEYS.USERS, defaultUsers)

    // Ensure default users exist
    if (users.length === 0) {
      this.saveUsers(defaultUsers)
      return defaultUsers
    }

    return users
  }

  saveUsers(users: User[]): void {
    safeSaveJSON(STORAGE_KEYS.USERS, users)
  }

  // Audit Log
  getAuditLog(): AuditLogEntry[] {
    return safeParseJSON(STORAGE_KEYS.AUDIT_LOG, [])
  }

  saveAuditLog(auditLog: AuditLogEntry[]): void {
    safeSaveJSON(STORAGE_KEYS.AUDIT_LOG, auditLog)
  }

  // Page Visits
  getPageVisits(): number {
    if (typeof window === "undefined") return 0
    return Number.parseInt(localStorage.getItem(STORAGE_KEYS.PAGE_VISITS) || "0", 10)
  }

  incrementPageVisits(): number {
    const current = this.getPageVisits()
    const newCount = current + 1
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PAGE_VISITS, newCount.toString())
    }
    return newCount
  }

  // Current User
  getCurrentUser(): User | null {
    return safeParseJSON(STORAGE_KEYS.CURRENT_USER, null)
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      safeSaveJSON(STORAGE_KEYS.CURRENT_USER, user)
    } else {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
      }
    }
  }

  // Clear all data
  clearAll(): void {
    if (typeof window === "undefined") return

    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  }

  // Initialize with default data
  initializeDefaults(): void {
    // Initialize users if empty
    const users = this.getUsers()
    if (users.length === 0) {
      this.getUsers() // This will trigger default user creation
    }

    // Initialize categories if empty
    const categories = this.getCategories()
    if (categories.length === 0) {
      const defaultCategories: Category[] = [
        {
          id: "getting-started",
          name: "Getting Started",
          description: "Essential guides to get you up and running",
          icon: "🚀",
          color: "blue",
          articles: [
            {
              id: "welcome",
              title: "Welcome to the Knowledge Base",
              content: `# Welcome to the Knowledge Base

This is your central hub for documentation, guides, and resources. Here you'll find everything you need to get started and make the most of our platform.

## What you'll find here:

- **Getting Started guides** - Step-by-step instructions for new users
- **Technical Documentation** - Detailed technical information and API references
- **Troubleshooting** - Solutions to common problems and issues
- **Best Practices** - Recommended approaches and methodologies

## How to navigate:

1. Use the category tree on the left to browse topics
2. Use the search bar to find specific information
3. Click on any article to read the full content
4. Use the breadcrumb navigation to keep track of where you are

## Need help?

If you can't find what you're looking for, please contact our support team or use the feedback feature to let us know what additional documentation would be helpful.

Happy learning!`,
              categoryId: "getting-started",
              tags: ["welcome", "introduction", "overview"],
              author: "System",
              createdAt: new Date("2024-01-01"),
              updatedAt: new Date("2024-01-01"),
              isPublished: true,
              views: 0,
            },
          ],
          subcategories: [],
          createdAt: new Date("2024-01-01"),
        },
      ]

      this.saveCategories(defaultCategories)
    }
  }
}

// Export singleton instance
export const storage = new Storage()
