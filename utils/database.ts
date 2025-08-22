import type { Category, User, AuditLogEntry } from "@/types/knowledge-base"

// Helper function to ensure dates are properly handled
const ensureDate = (date: any): Date => {
  if (date instanceof Date) return date
  if (typeof date === "string") return new Date(date)
  return new Date()
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

      // Convert date strings back to Date objects with proper error handling
      const processedCategories = categories.map((cat: any) => ({
        ...cat,
        articles:
          cat.articles?.map((article: any) => ({
            ...article,
            createdAt: ensureDate(article.createdAt),
            updatedAt: ensureDate(article.updatedAt),
          })) || [],
        subcategories:
          cat.subcategories?.map((sub: any) => ({
            ...sub,
            articles:
              sub.articles?.map((article: any) => ({
                ...article,
                createdAt: ensureDate(article.createdAt),
                updatedAt: ensureDate(article.updatedAt),
              })) || [],
          })) || [],
      }))

      const processedUsers = users.map((user: any) => ({
        ...user,
        createdAt: ensureDate(user.createdAt),
        lastLogin: user.lastLogin ? ensureDate(user.lastLogin) : undefined,
      }))

      const processedAuditLog = auditLog.map((entry: any) => ({
        ...entry,
        timestamp: ensureDate(entry.timestamp),
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

      // Process imported data to ensure proper date handling
      const processedCategories = backupData.categories.map((cat: any) => ({
        ...cat,
        articles:
          cat.articles?.map((article: any) => ({
            ...article,
            createdAt: ensureDate(article.createdAt),
            updatedAt: ensureDate(article.updatedAt),
          })) || [],
        subcategories:
          cat.subcategories?.map((sub: any) => ({
            ...sub,
            articles:
              sub.articles?.map((article: any) => ({
                ...article,
                createdAt: ensureDate(article.createdAt),
                updatedAt: ensureDate(article.updatedAt),
              })) || [],
          })) || [],
      }))

      const processedUsers = backupData.users.map((user: any) => ({
        ...user,
        createdAt: ensureDate(user.createdAt),
        lastLogin: user.lastLogin ? ensureDate(user.lastLogin) : undefined,
      }))

      const processedAuditLog = backupData.auditLog.map((entry: any) => ({
        ...entry,
        timestamp: ensureDate(entry.timestamp),
      }))

      // Import new data
      this.saveData({
        categories: processedCategories,
        users: processedUsers,
        auditLog: processedAuditLog,
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
