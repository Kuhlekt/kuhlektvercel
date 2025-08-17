import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

const STORAGE_KEYS = {
  CATEGORIES: "kb_categories",
  USERS: "kb_users",
  AUDIT_LOG: "kb_audit_log",
  PAGE_VISITS: "kb_page_visits",
  INITIALIZED: "kb_initialized",
  DATA_VERSION: "kb_data_version", // Track data schema version
}

const CURRENT_DATA_VERSION = "1.1" // Increment when making breaking changes

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

// Helper function to check localStorage availability and quota
const checkStorageAvailability = (): { available: boolean; quota?: number; used?: number } => {
  try {
    // Test if localStorage is available
    const testKey = "__storage_test__"
    localStorage.setItem(testKey, "test")
    localStorage.removeItem(testKey)

    // Try to estimate storage usage
    let used = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length
      }
    }

    return { available: true, used }
  } catch (error) {
    console.error("localStorage not available:", error)
    return { available: false }
  }
}

export const storage = {
  // Check storage health and availability
  checkHealth(): { healthy: boolean; issues: string[] } {
    const issues: string[] = []
    const storageCheck = checkStorageAvailability()

    if (!storageCheck.available) {
      issues.push("localStorage is not available")
      return { healthy: false, issues }
    }

    // Check if we can read/write
    try {
      const testData = { test: "data", timestamp: new Date().toISOString() }
      localStorage.setItem("__health_check__", JSON.stringify(testData))
      const retrieved = JSON.parse(localStorage.getItem("__health_check__") || "{}")
      localStorage.removeItem("__health_check__")

      if (retrieved.test !== "data") {
        issues.push("Data integrity check failed")
      }
    } catch (error) {
      issues.push(`Storage read/write error: ${error}`)
    }

    // Check data version compatibility
    const storedVersion = localStorage.getItem(STORAGE_KEYS.DATA_VERSION)
    if (storedVersion && storedVersion !== CURRENT_DATA_VERSION) {
      issues.push(`Data version mismatch: stored ${storedVersion}, expected ${CURRENT_DATA_VERSION}`)
    }

    return { healthy: issues.length === 0, issues }
  },

  // Check if any data exists (to determine if this is first-time setup)
  hasAnyData(): boolean {
    try {
      const healthCheck = this.checkHealth()
      if (!healthCheck.healthy) {
        console.warn("Storage health issues:", healthCheck.issues)
      }

      const hasInitFlag = localStorage.getItem(STORAGE_KEYS.INITIALIZED) === "true"
      const categoriesData = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
      const usersData = localStorage.getItem(STORAGE_KEYS.USERS)
      const auditLogData = localStorage.getItem(STORAGE_KEYS.AUDIT_LOG)
      const pageVisitsData = localStorage.getItem(STORAGE_KEYS.PAGE_VISITS)

      // Check if categories data actually contains articles
      let hasRealCategoriesData = false
      if (categoriesData) {
        try {
          const categories = JSON.parse(categoriesData)
          if (Array.isArray(categories) && categories.length > 0) {
            // Check if any category has articles
            const totalArticles = categories.reduce((total, cat) => {
              const catArticles = Array.isArray(cat.articles) ? cat.articles.length : 0
              const subArticles = Array.isArray(cat.subcategories)
                ? cat.subcategories.reduce(
                    (subTotal, sub) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
                    0,
                  )
                : 0
              return total + catArticles + subArticles
            }, 0)
            hasRealCategoriesData = totalArticles > 0
            console.log("hasAnyData check - found", totalArticles, "articles in storage")
          }
        } catch (e) {
          console.warn("Error parsing categories data in hasAnyData:", e)
        }
      }

      const result = hasInitFlag || hasRealCategoriesData || !!usersData || !!auditLogData || !!pageVisitsData

      console.log("Data existence check:", {
        hasInitFlag,
        hasRealCategoriesData,
        hasUsersData: !!usersData,
        hasAuditLogData: !!auditLogData,
        hasPageVisitsData: !!pageVisitsData,
        finalResult: result,
      })

      return result
    } catch (error) {
      console.error("Error checking data existence:", error)
      return false
    }
  },

  // Mark the app as initialized with version tracking
  markAsInitialized(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true")
      localStorage.setItem(STORAGE_KEYS.DATA_VERSION, CURRENT_DATA_VERSION)
      console.log("Marked as initialized with version", CURRENT_DATA_VERSION)
    } catch (error) {
      console.error("Error marking as initialized:", error)
    }
  },

  // Categories with enhanced error handling and data validation
  getCategories(): Category[] {
    try {
      const healthCheck = this.checkHealth()
      if (!healthCheck.healthy) {
        console.error("Storage health check failed:", healthCheck.issues)
        // Continue anyway but log the issues
      }

      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
      console.log("Raw stored categories data length:", stored ? stored.length : 0)

      if (!stored) {
        console.log("No categories data found in localStorage")
        return []
      }

      let categories
      try {
        categories = JSON.parse(stored)
        console.log("Successfully parsed categories JSON")
      } catch (parseError) {
        console.error("Failed to parse categories JSON:", parseError)
        return []
      }

      if (!Array.isArray(categories)) {
        console.warn("Categories data is not an array:", typeof categories)
        return []
      }

      console.log("Raw categories array length:", categories.length)

      // Enhanced data validation and processing
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

        console.log(`Category "${category.name}": ${articles.length} articles, ${subcategories.length} subcategories`)

        const processedCategory = {
          ...category,
          articles: articles.map((article: any) => {
            if (!article || typeof article !== "object") {
              console.warn("Invalid article in category:", category.name, article)
              return {
                id: `invalid-${Date.now()}`,
                title: "Invalid Article",
                content: "",
                categoryId: category.id || "",
                tags: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: "system",
                editCount: 0,
              }
            }
            return {
              ...article,
              createdAt: parseDate(article.createdAt),
              updatedAt: parseDate(article.updatedAt),
              editCount: article.editCount || 0,
              tags: Array.isArray(article.tags) ? article.tags : [],
            }
          }),
          subcategories: subcategories.map((subcategory: any) => {
            if (!subcategory || typeof subcategory !== "object") {
              console.warn("Invalid subcategory in category:", category.name, subcategory)
              return {
                id: `invalid-sub-${Date.now()}`,
                name: "Invalid Subcategory",
                articles: [],
              }
            }

            const subArticles = Array.isArray(subcategory.articles) ? subcategory.articles : []
            console.log(`  Subcategory "${subcategory.name}": ${subArticles.length} articles`)

            return {
              ...subcategory,
              articles: subArticles.map((article: any) => {
                if (!article || typeof article !== "object") {
                  console.warn("Invalid subcategory article:", subcategory.name, article)
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
                    editCount: 0,
                  }
                }
                return {
                  ...article,
                  createdAt: parseDate(article.createdAt),
                  updatedAt: parseDate(article.updatedAt),
                  editCount: article.editCount || 0,
                  tags: Array.isArray(article.tags) ? article.tags : [],
                }
              }),
            }
          }),
        }

        // Count articles in this processed category
        const categoryArticleCount = processedCategory.articles.length
        const subcategoryArticleCount = processedCategory.subcategories.reduce(
          (total, sub) => total + sub.articles.length,
          0,
        )
        console.log(
          `Processed category "${category.name}": ${categoryArticleCount} + ${subcategoryArticleCount} = ${categoryArticleCount + subcategoryArticleCount} total articles`,
        )

        return processedCategory
      })

      // Final count verification
      const totalArticles = processedCategories.reduce((total, category) => {
        const categoryArticles = category.articles.length
        const subcategoryArticles = category.subcategories.reduce((subTotal, sub) => subTotal + sub.articles.length, 0)
        return total + categoryArticles + subcategoryArticles
      }, 0)

      console.log("FINAL RESULT - Categories loaded:", processedCategories.length, "Total articles:", totalArticles)

      // Log each category's contribution
      processedCategories.forEach((cat) => {
        const catArticles = cat.articles.length
        const subArticles = cat.subcategories.reduce((total, sub) => total + sub.articles.length, 0)
        console.log(
          `  ${cat.name}: ${catArticles} direct + ${subArticles} in subcategories = ${catArticles + subArticles}`,
        )
      })

      return processedCategories
    } catch (error) {
      console.error("Error in getCategories:", error)
      console.error("Stack trace:", error.stack)
      throw error
    }
  },

  saveCategories(categories: Category[]): void {
    try {
      const healthCheck = this.checkHealth()
      if (!healthCheck.healthy) {
        console.error("Cannot save - storage health check failed:", healthCheck.issues)
        throw new Error("Storage system is unhealthy")
      }

      // Validate input data
      if (!Array.isArray(categories)) {
        throw new Error("Categories must be an array")
      }

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

      const dataString = JSON.stringify(sanitizedCategories)

      // Check if data is too large (rough estimate)
      if (dataString.length > 5 * 1024 * 1024) {
        // 5MB limit
        console.warn("Data size is very large:", dataString.length, "characters")
      }

      localStorage.setItem(STORAGE_KEYS.CATEGORIES, dataString)

      // Mark as initialized when we save data
      this.markAsInitialized()

      // Log the save operation
      const totalArticles = sanitizedCategories.reduce((total, category) => {
        const categoryArticles = category.articles.length
        const subcategoryArticles = category.subcategories.reduce((subTotal, sub) => subTotal + sub.articles.length, 0)
        return total + categoryArticles + subcategoryArticles
      }, 0)

      console.log("Successfully saved:", sanitizedCategories.length, "categories with", totalArticles, "total articles")
    } catch (error) {
      console.error("Error saving categories:", error)
      throw new Error(`Failed to save categories to storage: ${error}`)
    }
  },

  // Users with enhanced error handling
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
      if (!Array.isArray(users)) {
        throw new Error("Users must be an array")
      }

      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
      this.markAsInitialized()
      console.log("Successfully saved", users.length, "users")
    } catch (error) {
      console.error("Error saving users:", error)
      throw new Error(`Failed to save users: ${error}`)
    }
  },

  // Audit Log with enhanced error handling
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
      if (!Array.isArray(auditLog)) {
        throw new Error("Audit log must be an array")
      }

      localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(auditLog))
      this.markAsInitialized()
    } catch (error) {
      console.error("Error saving audit log:", error)
      throw new Error(`Failed to save audit log: ${error}`)
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

      // Keep only the last 1000 entries to prevent storage bloat
      if (updatedLog.length > 1000) {
        updatedLog.splice(1000)
      }

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

  // Clear all data (for development/testing) - with confirmation
  clearAll(confirm = false): void {
    if (!confirm) {
      console.warn("clearAll() called without confirmation. Pass true to confirm.")
      return
    }

    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
      console.log("All storage data cleared")
    } catch (error) {
      console.error("Error clearing all data:", error)
    }
  },

  // Get comprehensive storage info for debugging
  getStorageInfo(): object {
    try {
      const healthCheck = this.checkHealth()
      const storageCheck = checkStorageAvailability()

      const info = {
        healthy: healthCheck.healthy,
        issues: healthCheck.issues,
        hasInitialized: localStorage.getItem(STORAGE_KEYS.INITIALIZED) === "true",
        dataVersion: localStorage.getItem(STORAGE_KEYS.DATA_VERSION),
        currentVersion: CURRENT_DATA_VERSION,
        categoriesSize: localStorage.getItem(STORAGE_KEYS.CATEGORIES)?.length || 0,
        usersSize: localStorage.getItem(STORAGE_KEYS.USERS)?.length || 0,
        auditLogSize: localStorage.getItem(STORAGE_KEYS.AUDIT_LOG)?.length || 0,
        pageVisits: this.getPageVisits(),
        totalStorageUsed: storageCheck.used || 0,
        storageAvailable: storageCheck.available,
        timestamp: new Date().toISOString(),
      }

      console.log("Storage info:", info)
      return info
    } catch (error) {
      console.error("Error getting storage info:", error)
      return { error: error.toString() }
    }
  },

  // Force data persistence (useful for critical saves)
  forcePersist(): boolean {
    try {
      // Try to force localStorage to persist by triggering a sync
      const testKey = "__persist_test__"
      const testData = { timestamp: Date.now(), random: Math.random() }

      localStorage.setItem(testKey, JSON.stringify(testData))
      const retrieved = JSON.parse(localStorage.getItem(testKey) || "{}")
      localStorage.removeItem(testKey)

      return retrieved.timestamp === testData.timestamp
    } catch (error) {
      console.error("Force persist failed:", error)
      return false
    }
  },
}

// Export/Import utilities for file operations
export const dataManager = {
  // Export all data as JSON file
  exportData: () => {
    try {
      const storageInfo = storage.getStorageInfo()
      const data = {
        categories: storage.getCategories(),
        users: storage.getUsers(),
        auditLog: storage.getAuditLog(),
        pageVisits: storage.getPageVisits(),
        exportedAt: new Date().toISOString(),
        version: "1.1",
        storageInfo,
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

      console.log("Data exported successfully")
    } catch (error) {
      console.error("Error exporting data:", error)
      throw new Error("Failed to export data")
    }
  },

  // Import data from JSON file with validation
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
              editCount: article.editCount || 0,
              tags: Array.isArray(article.tags) ? article.tags : [],
            })),
            subcategories: (cat.subcategories || []).map((sub: any) => ({
              ...sub,
              articles: (sub.articles || []).map((article: any) => ({
                ...article,
                createdAt: parseDate(article.createdAt),
                updatedAt: parseDate(article.updatedAt),
                editCount: article.editCount || 0,
                tags: Array.isArray(article.tags) ? article.tags : [],
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

          console.log("Data import successful:", {
            categories: categories.length,
            users: users.length,
            auditLog: auditLog.length,
          })

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
