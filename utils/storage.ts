import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

const STORAGE_KEYS = {
  CATEGORIES: "kb_categories",
  USERS: "kb_users",
  AUDIT_LOG: "kb_audit_log",
  PAGE_VISITS: "kb_page_visits",
  INITIALIZED: "kb_initialized", // New key to track if app has been initialized
}

// Helper function to safely parse dates
const parseDate = (dateValue: any): Date => {
  if (dateValue instanceof Date) return dateValue
  if (typeof dateValue === "string") return new Date(dateValue)
  if (typeof dateValue === "number") return new Date(dateValue)
  return new Date()
}

// Helper function to safely parse JSON
const safeJSONParse = (value: string | null, fallback: any = []) => {
  if (!value) return fallback
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

export const storage = {
  // Check if any data exists (to determine if this is first-time setup)
  hasAnyData(): boolean {
    try {
      const hasInitFlag = localStorage.getItem(STORAGE_KEYS.INITIALIZED) === "true"
      const hasCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES) !== null
      const hasUsers = localStorage.getItem(STORAGE_KEYS.USERS) !== null
      const hasAuditLog = localStorage.getItem(STORAGE_KEYS.AUDIT_LOG) !== null
      const hasPageVisits = localStorage.getItem(STORAGE_KEYS.PAGE_VISITS) !== null

      console.log("Data existence check:", {
        hasInitFlag,
        hasCategories,
        hasUsers,
        hasAuditLog,
        hasPageVisits,
      })

      // If we have the init flag OR any substantial data, consider it not first-time
      return hasInitFlag || hasCategories || hasUsers || hasAuditLog || hasPageVisits
    } catch (error) {
      console.error("Error checking data existence:", error)
      return false
    }
  },

  // Mark the app as initialized
  markAsInitialized(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true")
    } catch (error) {
      console.error("Error marking as initialized:", error)
    }
  },

  // Categories
  getCategories(): Category[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
      console.log("Raw stored categories:", stored ? "Data found" : "No data")

      if (!stored) {
        console.log("No categories in storage")
        return []
      }

      const categories = safeJSONParse(stored, [])
      console.log("Parsed categories count:", categories.length)

      if (!Array.isArray(categories)) {
        console.warn("Categories is not an array, returning empty array")
        return []
      }

      // Convert date strings back to Date objects with proper null checks
      const processedCategories = categories.map((category: any, index: number) => {
        if (!category || typeof category !== "object") {
          console.warn(`Category ${index} is invalid:`, category)
          return {
            id: `invalid-${index}`,
            name: `Invalid Category ${index}`,
            articles: [],
            subcategories: [],
            expanded: false,
          }
        }

        const articles = Array.isArray(category.articles) ? category.articles : []
        const subcategories = Array.isArray(category.subcategories) ? category.subcategories : []

        return {
          ...category,
          articles: articles.map((article: any) => {
            if (!article || typeof article !== "object") {
              console.warn("Invalid article:", article)
              return {
                id: `invalid-${Date.now()}`,
                title: "Invalid Article",
                content: "",
                categoryId: category.id || "",
                tags: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: "system",
              }
            }
            return {
              ...article,
              createdAt: parseDate(article.createdAt),
              updatedAt: parseDate(article.updatedAt),
            }
          }),
          subcategories: subcategories.map((subcategory: any) => {
            if (!subcategory || typeof subcategory !== "object") {
              console.warn("Invalid subcategory:", subcategory)
              return {
                id: `invalid-sub-${Date.now()}`,
                name: "Invalid Subcategory",
                articles: [],
              }
            }

            const subArticles = Array.isArray(subcategory.articles) ? subcategory.articles : []

            return {
              ...subcategory,
              articles: subArticles.map((article: any) => {
                if (!article || typeof article !== "object") {
                  console.warn("Invalid subcategory article:", article)
                  return {
                    id: `invalid-${Date.now()}`,
                    title: "Invalid Article",
                    content: "",
                    categoryId: category.id || "",
                    subcategoryId: subcategory.id || "",
                    tags: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    createdBy: "system",
                  }
                }
                return {
                  ...article,
                  createdAt: parseDate(article.createdAt),
                  updatedAt: parseDate(article.updatedAt),
                }
              }),
            }
          }),
        }
      })

      // Count total articles for logging
      const totalArticles = processedCategories.reduce((total, category) => {
        const categoryArticles = category.articles.length
        const subcategoryArticles = category.subcategories.reduce((subTotal, sub) => subTotal + sub.articles.length, 0)
        return total + categoryArticles + subcategoryArticles
      }, 0)

      console.log(
        "Final processed categories:",
        processedCategories.length,
        "categories with",
        totalArticles,
        "total articles",
      )
      return processedCategories
    } catch (error) {
      console.error("Error in getCategories:", error)
      // Don't clear data on error - let the app handle it
      return []
    }
  },

  saveCategories(categories: Category[]): void {
    try {
      // Ensure all categories have the required structure
      const sanitizedCategories = categories.map((category) => ({
        ...category,
        articles: Array.isArray(category.articles) ? category.articles : [],
        subcategories: Array.isArray(category.subcategories)
          ? category.subcategories.map((subcategory) => ({
              ...subcategory,
              articles: Array.isArray(subcategory.articles) ? subcategory.articles : [],
            }))
          : [],
      }))

      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(sanitizedCategories))

      // Mark as initialized when we save data
      this.markAsInitialized()

      // Log the save operation
      const totalArticles = sanitizedCategories.reduce((total, category) => {
        const categoryArticles = category.articles.length
        const subcategoryArticles = category.subcategories.reduce((subTotal, sub) => subTotal + sub.articles.length, 0)
        return total + categoryArticles + subcategoryArticles
      }, 0)

      console.log("Saved categories:", sanitizedCategories.length, "categories with", totalArticles, "total articles")
    } catch (error) {
      console.error("Error saving categories:", error)
      throw new Error("Failed to save categories to storage")
    }
  },

  // Users
  getUsers(): User[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS)
      const users = safeJSONParse(stored, [])

      if (!Array.isArray(users)) {
        return []
      }

      // Convert date strings back to Date objects
      return users.map((user: any) => ({
        ...user,
        createdAt: parseDate(user.createdAt),
        lastLogin: user.lastLogin ? parseDate(user.lastLogin) : undefined,
      }))
    } catch (error) {
      console.error("Error in getUsers:", error)
      return []
    }
  },

  saveUsers(users: User[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
      this.markAsInitialized()
    } catch (error) {
      console.error("Error saving users:", error)
    }
  },

  // Audit Log
  getAuditLog(): AuditLogEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOG)
      const auditLog = safeJSONParse(stored, [])

      if (!Array.isArray(auditLog)) {
        return []
      }

      // Convert date strings back to Date objects
      return auditLog.map((entry: any) => ({
        ...entry,
        timestamp: parseDate(entry.timestamp),
      }))
    } catch (error) {
      console.error("Error in getAuditLog:", error)
      return []
    }
  },

  saveAuditLog(auditLog: AuditLogEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(auditLog))
      this.markAsInitialized()
    } catch (error) {
      console.error("Error saving audit log:", error)
    }
  },

  addAuditEntry(entry: Omit<AuditLogEntry, "id" | "timestamp">): void {
    try {
      const currentLog = this.getAuditLog()
      const newEntry: AuditLogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        ...entry,
      }
      const updatedLog = [newEntry, ...currentLog]
      this.saveAuditLog(updatedLog)
    } catch (error) {
      console.error("Error adding audit entry:", error)
    }
  },

  // Page Visits
  getPageVisits(): number {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PAGE_VISITS)
      return stored ? Number.parseInt(stored, 10) || 0 : 0
    } catch (error) {
      console.error("Error getting page visits:", error)
      return 0
    }
  },

  incrementPageVisits(): number {
    try {
      const current = this.getPageVisits()
      const newCount = current + 1
      localStorage.setItem(STORAGE_KEYS.PAGE_VISITS, newCount.toString())
      this.markAsInitialized()
      return newCount
    } catch (error) {
      console.error("Error incrementing page visits:", error)
      return 0
    }
  },

  resetPageVisits(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PAGE_VISITS, "0")
    } catch (error) {
      console.error("Error resetting page visits:", error)
    }
  },

  // Clear all data (for development/testing)
  clearAll(): void {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
      console.log("All storage data cleared")
    } catch (error) {
      console.error("Error clearing all data:", error)
    }
  },

  // Get storage info for debugging
  getStorageInfo(): object {
    try {
      const info = {
        hasInitialized: localStorage.getItem(STORAGE_KEYS.INITIALIZED) === "true",
        categoriesSize: localStorage.getItem(STORAGE_KEYS.CATEGORIES)?.length || 0,
        usersSize: localStorage.getItem(STORAGE_KEYS.USERS)?.length || 0,
        auditLogSize: localStorage.getItem(STORAGE_KEYS.AUDIT_LOG)?.length || 0,
        pageVisits: this.getPageVisits(),
        totalStorageUsed: Object.values(STORAGE_KEYS).reduce((total, key) => {
          const item = localStorage.getItem(key)
          return total + (item ? item.length : 0)
        }, 0),
      }
      console.log("Storage info:", info)
      return info
    } catch (error) {
      console.error("Error getting storage info:", error)
      return {}
    }
  },
}

// Export/Import utilities for file operations
export const dataManager = {
  // Export all data as JSON file
  exportData: () => {
    try {
      const data = {
        categories: storage.getCategories(),
        users: storage.getUsers(),
        auditLog: storage.getAuditLog(),
        pageVisits: storage.getPageVisits(),
        exportedAt: new Date().toISOString(),
        version: "1.0",
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `knowledge-base-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting data:", error)
      throw new Error("Failed to export data")
    }
  },

  // Import data from JSON file
  importData: (
    file: File,
  ): Promise<{ categories: Category[]; users: User[]; auditLog: AuditLogEntry[]; pageVisits?: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)

          // Validate data structure
          if (!data.categories || !Array.isArray(data.categories)) {
            throw new Error("Invalid backup file: missing or invalid categories")
          }
          if (!data.users || !Array.isArray(data.users)) {
            throw new Error("Invalid backup file: missing or invalid users")
          }
          if (!data.auditLog || !Array.isArray(data.auditLog)) {
            throw new Error("Invalid backup file: missing or invalid audit log")
          }

          // Convert date strings back to Date objects with safe parsing
          const categories = data.categories.map((cat: any) => ({
            ...cat,
            articles: (cat.articles || []).map((article: any) => ({
              ...article,
              createdAt: parseDate(article.createdAt),
              updatedAt: parseDate(article.updatedAt),
            })),
            subcategories: (cat.subcategories || []).map((sub: any) => ({
              ...sub,
              articles: (sub.articles || []).map((article: any) => ({
                ...article,
                createdAt: parseDate(article.createdAt),
                updatedAt: parseDate(article.updatedAt),
              })),
            })),
          }))

          const users = data.users.map((user: any) => ({
            ...user,
            createdAt: parseDate(user.createdAt),
            lastLogin: user.lastLogin ? parseDate(user.lastLogin) : undefined,
          }))

          const auditLog = data.auditLog.map((entry: any) => ({
            ...entry,
            timestamp: parseDate(entry.timestamp),
          }))

          resolve({
            categories,
            users,
            auditLog,
            pageVisits: data.pageVisits || 0,
          })
        } catch (error) {
          console.error("Error parsing backup file:", error)
          reject(new Error(`Failed to parse backup file: ${error instanceof Error ? error.message : "Unknown error"}`))
        }
      }

      reader.onerror = () => {
        console.error("Error reading file")
        reject(new Error("Failed to read file"))
      }

      reader.readAsText(file)
    })
  },
}
