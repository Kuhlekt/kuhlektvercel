import type { Category, User, Article, AuditLogEntry } from "@/types/knowledge-base"

// Helper function to convert database dates to Date objects
const parseDate = (dateString: string): Date => new Date(dateString)

// Helper function to convert database user to app user
const convertDatabaseUser = (dbUser: any): User => ({
  id: dbUser.id,
  username: dbUser.username,
  password: dbUser.password,
  email: dbUser.email || "",
  role: dbUser.role,
  createdAt: parseDate(dbUser.created_at),
  lastLogin: dbUser.last_login ? parseDate(dbUser.last_login) : undefined,
})

// Helper function to convert database article to app article
const convertDatabaseArticle = (dbArticle: any): Article => ({
  id: dbArticle.id,
  title: dbArticle.title,
  content: dbArticle.content,
  categoryId: dbArticle.category_id,
  subcategoryId: dbArticle.subcategory_id,
  tags: dbArticle.tags || [],
  createdBy: dbArticle.created_by,
  lastEditedBy: dbArticle.last_edited_by,
  editCount: dbArticle.edit_count || 0,
  createdAt: parseDate(dbArticle.created_at),
  updatedAt: parseDate(dbArticle.updated_at),
})

// Helper function to convert database audit log to app audit log
const convertDatabaseAuditLog = (dbAudit: any): AuditLogEntry => ({
  id: dbAudit.id,
  action: dbAudit.action as any,
  articleId: dbAudit.article_id,
  articleTitle: dbAudit.article_title,
  categoryId: dbAudit.category_id,
  categoryName: dbAudit.category_name,
  subcategoryName: dbAudit.subcategory_name,
  userId: dbAudit.user_id,
  username: dbAudit.username,
  performedBy: dbAudit.performed_by,
  timestamp: parseDate(dbAudit.timestamp),
  details: dbAudit.details,
})

// Mock data for preview mode
const mockData = {
  categories: [
    {
      id: "1",
      name: "Getting Started",
      description: "Basic setup and introduction",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      articles: [],
      subcategories: [],
    },
    {
      id: "2",
      name: "Advanced Topics",
      description: "Complex configurations and features",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      articles: [],
      subcategories: [],
    },
  ],
  subcategories: [
    {
      id: "1",
      name: "Installation",
      description: "How to install",
      category_id: "1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Configuration",
      description: "How to configure",
      category_id: "1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  articles: [
    {
      id: "1",
      title: "Welcome to Kuhlekt KB",
      content: "This is your knowledge base...",
      category_id: "1",
      subcategory_id: "1",
      tags: ["welcome", "intro"],
      created_by: "admin",
      last_edited_by: "admin",
      edit_count: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  users: [
    {
      id: "1",
      username: "admin",
      password: "hashed_password",
      email: "admin@kuhlekt.com",
      role: "admin" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  auditLogs: [
    {
      id: "1",
      action: "CREATE_ARTICLE",
      article_id: "1",
      article_title: "Welcome to Kuhlekt KB",
      performed_by: "admin",
      details: "Initial article creation",
      timestamp: new Date().toISOString(),
    },
  ],
}

// Mock database for local storage
class Database {
  private getStorageKey(key: string): string {
    return `kb_${key}`
  }

  // Load data from localStorage
  loadData() {
    try {
      const categories = JSON.parse(localStorage.getItem(this.getStorageKey("categories")) || "[]")
      const users = JSON.parse(localStorage.getItem(this.getStorageKey("users")) || "[]")
      const auditLog = JSON.parse(localStorage.getItem(this.getStorageKey("auditLog")) || "[]")
      const pageVisits = Number.parseInt(localStorage.getItem(this.getStorageKey("pageVisits")) || "0", 10)

      // Convert date strings back to Date objects
      const processedCategories = categories.map((cat: any) => ({
        ...cat,
        articles:
          cat.articles?.map((article: any) => ({
            ...article,
            createdAt: new Date(article.createdAt),
            updatedAt: new Date(article.updatedAt),
          })) || [],
        subcategories:
          cat.subcategories?.map((sub: any) => ({
            ...sub,
            articles:
              sub.articles?.map((article: any) => ({
                ...article,
                createdAt: new Date(article.createdAt),
                updatedAt: new Date(article.updatedAt),
              })) || [],
          })) || [],
      }))

      const processedUsers = users.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
      }))

      const processedAuditLog = auditLog.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }))

      return {
        categories: processedCategories,
        users: processedUsers,
        auditLog: processedAuditLog,
        pageVisits,
      }
    } catch (error) {
      console.error("Error loading data:", error)
      return {
        categories: [],
        users: [],
        auditLog: [],
        pageVisits: 0,
      }
    }
  }

  // Save data to localStorage
  saveData(data: {
    categories?: Category[]
    users?: User[]
    auditLog?: AuditLogEntry[]
    pageVisits?: number
  }) {
    try {
      if (data.categories) {
        localStorage.setItem(this.getStorageKey("categories"), JSON.stringify(data.categories))
      }
      if (data.users) {
        localStorage.setItem(this.getStorageKey("users"), JSON.stringify(data.users))
      }
      if (data.auditLog) {
        localStorage.setItem(this.getStorageKey("auditLog"), JSON.stringify(data.auditLog))
      }
      if (data.pageVisits !== undefined) {
        localStorage.setItem(this.getStorageKey("pageVisits"), data.pageVisits.toString())
      }
    } catch (error) {
      console.error("Error saving data:", error)
      throw new Error("Failed to save data")
    }
  }

  // Export all data
  async exportData() {
    const data = this.loadData()
    return {
      version: "1.0",
      exportDate: new Date().toISOString(),
      categories: data.categories,
      users: data.users,
      auditLog: data.auditLog,
      settings: {
        pageVisits: data.pageVisits,
      },
    }
  }

  // Import data from backup
  async importData(backupData: any) {
    try {
      // Validate backup structure
      if (!backupData.categories || !backupData.users || !backupData.auditLog) {
        throw new Error("Invalid backup file structure")
      }

      // Clear existing data
      await this.clearAllData()

      // Import new data
      this.saveData({
        categories: backupData.categories,
        users: backupData.users,
        auditLog: backupData.auditLog,
        pageVisits: backupData.settings?.pageVisits || 0,
      })

      return true
    } catch (error) {
      console.error("Error importing data:", error)
      throw new Error("Failed to import data")
    }
  }

  // Clear all data
  async clearAllData() {
    try {
      localStorage.removeItem(this.getStorageKey("categories"))
      localStorage.removeItem(this.getStorageKey("users"))
      localStorage.removeItem(this.getStorageKey("auditLog"))
      localStorage.removeItem(this.getStorageKey("pageVisits"))
      return true
    } catch (error) {
      console.error("Error clearing data:", error)
      throw new Error("Failed to clear data")
    }
  }

  // Add category
  addCategory(categories: Category[], categoryData: Omit<Category, "id">) {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      articles: [],
      subcategories: [],
    }

    const updatedCategories = [...categories, newCategory]
    this.saveData({ categories: updatedCategories })
    return updatedCategories
  }

  // Update category
  updateCategory(categories: Category[], categoryId: string, updates: Partial<Category>) {
    const updatedCategories = categories.map((cat) => (cat.id === categoryId ? { ...cat, ...updates } : cat))
    this.saveData({ categories: updatedCategories })
    return updatedCategories
  }

  // Delete category
  deleteCategory(categories: Category[], categoryId: string) {
    const updatedCategories = categories.filter((cat) => cat.id !== categoryId)
    this.saveData({ categories: updatedCategories })
    return updatedCategories
  }

  // Add user
  addUser(users: User[], userData: Omit<User, "id" | "createdAt">) {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }

    const updatedUsers = [...users, newUser]
    this.saveData({ users: updatedUsers })
    return updatedUsers
  }

  // Update user
  updateUser(users: User[], userId: string, updates: Partial<User>) {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, ...updates } : user))
    this.saveData({ users: updatedUsers })
    return updatedUsers
  }

  // Delete user
  deleteUser(users: User[], userId: string) {
    const updatedUsers = users.filter((user) => user.id !== userId)
    this.saveData({ users: updatedUsers })
    return updatedUsers
  }

  // Add audit log entry
  addAuditEntry(auditLog: AuditLogEntry[], entryData: Omit<AuditLogEntry, "id" | "timestamp">) {
    const newEntry: AuditLogEntry = {
      ...entryData,
      id: Date.now().toString(),
      timestamp: new Date(),
    }

    const updatedAuditLog = [newEntry, ...auditLog]
    this.saveData({ auditLog: updatedAuditLog })
    return updatedAuditLog
  }

  // Increment page visits
  incrementPageVisits() {
    const data = this.loadData()
    const newPageVisits = data.pageVisits + 1
    this.saveData({ pageVisits: newPageVisits })
    return newPageVisits
  }
}

export const database = new Database()
