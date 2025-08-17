import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

const STORAGE_KEYS = {
  CATEGORIES: "kb_categories",
  USERS: "kb_users",
  AUDIT_LOG: "kb_audit_log",
  PAGE_VISITS: "kb_page_visits",
  INITIALIZED: "kb_initialized",
} as const

class KnowledgeBaseStorage {
  private isClient = typeof window !== "undefined"

  // Health check method
  checkHealth() {
    const issues: string[] = []
    let healthy = true

    if (!this.isClient) {
      issues.push("Not running in client environment")
      healthy = false
      return { healthy, issues }
    }

    try {
      // Test localStorage availability
      const testKey = "kb_health_test"
      localStorage.setItem(testKey, "test")
      localStorage.removeItem(testKey)
    } catch (error) {
      issues.push("localStorage not available")
      healthy = false
    }

    // Check for data corruption
    try {
      const categories = this.getCategories()
      if (!Array.isArray(categories)) {
        issues.push("Categories data is not an array")
        healthy = false
      }
    } catch (error) {
      issues.push(`Categories data corrupted: ${error.message}`)
      healthy = false
    }

    try {
      const users = this.getUsers()
      if (!Array.isArray(users)) {
        issues.push("Users data is not an array")
        healthy = false
      }
    } catch (error) {
      issues.push(`Users data corrupted: ${error.message}`)
      healthy = false
    }

    return { healthy, issues }
  }

  // Get storage information
  getStorageInfo() {
    if (!this.isClient) return { available: false }

    const info = {
      available: true,
      keys: Object.keys(localStorage).filter((key) => key.startsWith("kb_")),
      totalSize: 0,
      keyDetails: {} as Record<string, number>,
    }

    info.keys.forEach((key) => {
      const value = localStorage.getItem(key)
      const size = value ? value.length : 0
      info.keyDetails[key] = size
      info.totalSize += size
    })

    return info
  }

  // Check if any data exists
  hasAnyData(): boolean {
    if (!this.isClient) return false

    try {
      const categories = this.getCategories()
      if (!Array.isArray(categories) || categories.length === 0) {
        console.log("hasAnyData: No categories found")
        return false
      }

      // Check if categories actually have articles
      const totalArticles = categories.reduce((total, category) => {
        const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
        const subcategoryArticles = Array.isArray(category.subcategories)
          ? category.subcategories.reduce(
              (subTotal, sub) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
              0,
            )
          : 0
        return total + categoryArticles + subcategoryArticles
      }, 0)

      console.log("hasAnyData: Total articles found:", totalArticles)
      return totalArticles > 0
    } catch (error) {
      console.error("hasAnyData error:", error)
      return false
    }
  }

  // Categories
  getCategories(): Category[] {
    if (!this.isClient) return []

    try {
      console.log("getCategories: Starting to load categories...")
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
      console.log("getCategories: Raw stored data:", stored ? "Data found" : "No data")

      if (!stored) {
        console.log("getCategories: No stored categories found")
        return []
      }

      const parsed = JSON.parse(stored)
      console.log("getCategories: Parsed categories count:", parsed?.length || 0)

      if (!Array.isArray(parsed)) {
        console.error("getCategories: Stored data is not an array")
        return []
      }

      // Convert date strings back to Date objects and validate structure
      const processedCategories = parsed.map((category: any) => {
        const processedCategory = {
          ...category,
          articles: Array.isArray(category.articles)
            ? category.articles.map((article: any) => ({
                ...article,
                createdAt: new Date(article.createdAt),
                updatedAt: new Date(article.updatedAt),
              }))
            : [],
          subcategories: Array.isArray(category.subcategories)
            ? category.subcategories.map((subcategory: any) => ({
                ...subcategory,
                articles: Array.isArray(subcategory.articles)
                  ? subcategory.articles.map((article: any) => ({
                      ...article,
                      createdAt: new Date(article.createdAt),
                      updatedAt: new Date(article.updatedAt),
                    }))
                  : [],
              }))
            : [],
        }

        return processedCategory
      })

      // Count total articles for verification
      const totalArticles = processedCategories.reduce((total, category) => {
        const categoryArticles = category.articles.length
        const subcategoryArticles = category.subcategories.reduce(
          (subTotal: number, sub: any) => subTotal + sub.articles.length,
          0,
        )
        return total + categoryArticles + subcategoryArticles
      }, 0)

      console.log(
        "getCategories: Final processed categories:",
        processedCategories.length,
        "categories with",
        totalArticles,
        "total articles",
      )

      return processedCategories
    } catch (error) {
      console.error("getCategories: Error loading categories:", error)
      return []
    }
  }

  saveCategories(categories: Category[]): void {
    if (!this.isClient) return

    try {
      console.log("saveCategories: Saving", categories.length, "categories...")

      // Count articles before saving
      const totalArticles = categories.reduce((total, category) => {
        const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
        const subcategoryArticles = Array.isArray(category.subcategories)
          ? category.subcategories.reduce(
              (subTotal, sub) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
              0,
            )
          : 0
        return total + categoryArticles + subcategoryArticles
      }, 0)

      console.log("saveCategories:", categories.length, "categories with", totalArticles, "total articles")

      const serialized = JSON.stringify(categories)
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, serialized)
      console.log("saveCategories: Successfully saved to localStorage")
    } catch (error) {
      console.error("saveCategories: Error saving categories:", error)
      throw error
    }
  }

  // Users
  getUsers(): User[] {
    if (!this.isClient) return []

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS)
      if (!stored) return []

      const parsed = JSON.parse(stored)
      if (!Array.isArray(parsed)) return []

      return parsed.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
      }))
    } catch (error) {
      console.error("Error loading users:", error)
      return []
    }
  }

  saveUsers(users: User[]): void {
    if (!this.isClient) return

    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
    } catch (error) {
      console.error("Error saving users:", error)
      throw error
    }
  }

  // Audit Log
  getAuditLog(): AuditLogEntry[] {
    if (!this.isClient) return []

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOG)
      if (!stored) return []

      const parsed = JSON.parse(stored)
      if (!Array.isArray(parsed)) return []

      return parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }))
    } catch (error) {
      console.error("Error loading audit log:", error)
      return []
    }
  }

  saveAuditLog(auditLog: AuditLogEntry[]): void {
    if (!this.isClient) return

    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(auditLog))
    } catch (error) {
      console.error("Error saving audit log:", error)
      throw error
    }
  }

  addAuditEntry(entry: Omit<AuditLogEntry, "id">): void {
    if (!this.isClient) return

    try {
      const auditLog = this.getAuditLog()
      const newEntry: AuditLogEntry = {
        ...entry,
        id: Date.now().toString(),
      }
      auditLog.unshift(newEntry)

      // Keep only the last 1000 entries
      if (auditLog.length > 1000) {
        auditLog.splice(1000)
      }

      this.saveAuditLog(auditLog)
    } catch (error) {
      console.error("Error adding audit entry:", error)
    }
  }

  // Page Visits
  getPageVisits(): number {
    if (!this.isClient) return 0

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PAGE_VISITS)
      return stored ? Number.parseInt(stored, 10) : 0
    } catch (error) {
      console.error("Error loading page visits:", error)
      return 0
    }
  }

  incrementPageVisits(): number {
    if (!this.isClient) return 0

    try {
      const current = this.getPageVisits()
      const newCount = current + 1
      localStorage.setItem(STORAGE_KEYS.PAGE_VISITS, newCount.toString())
      return newCount
    } catch (error) {
      console.error("Error incrementing page visits:", error)
      return 0
    }
  }

  // Data persistence with error handling
  forcePersist(): boolean {
    if (!this.isClient) return false

    try {
      // Force a write to test localStorage
      const testData = { timestamp: Date.now() }
      localStorage.setItem("kb_persist_test", JSON.stringify(testData))
      localStorage.removeItem("kb_persist_test")
      return true
    } catch (error) {
      console.error("Force persist failed:", error)
      return false
    }
  }

  // Clear all data
  clearAll(): void {
    if (!this.isClient) return

    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
      console.log("All knowledge base data cleared")
    } catch (error) {
      console.error("Error clearing data:", error)
    }
  }

  // Export data
  exportData() {
    if (!this.isClient) return null

    try {
      return {
        categories: this.getCategories(),
        users: this.getUsers(),
        auditLog: this.getAuditLog(),
        pageVisits: this.getPageVisits(),
        exportedAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Error exporting data:", error)
      return null
    }
  }

  // Import data
  importData(data: any): boolean {
    if (!this.isClient) return false

    try {
      if (data.categories) this.saveCategories(data.categories)
      if (data.users) this.saveUsers(data.users)
      if (data.auditLog) this.saveAuditLog(data.auditLog)
      if (data.pageVisits) {
        localStorage.setItem(STORAGE_KEYS.PAGE_VISITS, data.pageVisits.toString())
      }
      return true
    } catch (error) {
      console.error("Error importing data:", error)
      return false
    }
  }
}

export const storage = new KnowledgeBaseStorage()
