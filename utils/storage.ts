import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface StorageHealth {
  isAvailable: boolean
  hasData: boolean
  lastError: string | null
  dataIntegrity: boolean
}

interface StorageInfo {
  totalSize: number
  categoriesSize: number
  usersSize: number
  auditLogSize: number
  pageVisitsSize: number
  availableSpace: number
}

class StorageManager {
  private readonly STORAGE_KEYS = {
    CATEGORIES: "kuhlekt_kb_categories",
    USERS: "kuhlekt_kb_users",
    AUDIT_LOG: "kuhlekt_kb_audit_log",
    PAGE_VISITS: "kuhlekt_kb_page_visits",
    LAST_BACKUP: "kuhlekt_kb_last_backup",
  }

  private lastError: string | null = null

  // Health check method
  checkHealth(): StorageHealth {
    try {
      const testKey = "kuhlekt_kb_health_test"
      const testValue = "test"

      localStorage.setItem(testKey, testValue)
      const retrieved = localStorage.getItem(testKey)
      localStorage.removeItem(testKey)

      const hasData = this.hasAnyData()
      const dataIntegrity = this.validateDataIntegrity()

      return {
        isAvailable: retrieved === testValue,
        hasData,
        lastError: this.lastError,
        dataIntegrity,
      }
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : "Unknown error"
      return {
        isAvailable: false,
        hasData: false,
        lastError: this.lastError,
        dataIntegrity: false,
      }
    }
  }

  // Get storage information
  getStorageInfo(): StorageInfo {
    try {
      const categories = localStorage.getItem(this.STORAGE_KEYS.CATEGORIES) || ""
      const users = localStorage.getItem(this.STORAGE_KEYS.USERS) || ""
      const auditLog = localStorage.getItem(this.STORAGE_KEYS.AUDIT_LOG) || ""
      const pageVisits = localStorage.getItem(this.STORAGE_KEYS.PAGE_VISITS) || ""

      const categoriesSize = new Blob([categories]).size
      const usersSize = new Blob([users]).size
      const auditLogSize = new Blob([auditLog]).size
      const pageVisitsSize = new Blob([pageVisits]).size
      const totalSize = categoriesSize + usersSize + auditLogSize + pageVisitsSize

      // Estimate available space (localStorage typically has 5-10MB limit)
      const estimatedLimit = 5 * 1024 * 1024 // 5MB
      const availableSpace = Math.max(0, estimatedLimit - totalSize)

      return {
        totalSize,
        categoriesSize,
        usersSize,
        auditLogSize,
        pageVisitsSize,
        availableSpace,
      }
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : "Unknown error"
      return {
        totalSize: 0,
        categoriesSize: 0,
        usersSize: 0,
        auditLogSize: 0,
        pageVisitsSize: 0,
        availableSpace: 0,
      }
    }
  }

  // Check if any data exists
  hasAnyData(): boolean {
    try {
      return Object.values(this.STORAGE_KEYS).some((key) => localStorage.getItem(key) !== null)
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : "Unknown error"
      return false
    }
  }

  // Validate data integrity
  private validateDataIntegrity(): boolean {
    try {
      const categoriesData = localStorage.getItem(this.STORAGE_KEYS.CATEGORIES)
      const usersData = localStorage.getItem(this.STORAGE_KEYS.USERS)
      const auditLogData = localStorage.getItem(this.STORAGE_KEYS.AUDIT_LOG)

      if (categoriesData) {
        JSON.parse(categoriesData)
      }
      if (usersData) {
        JSON.parse(usersData)
      }
      if (auditLogData) {
        JSON.parse(auditLogData)
      }

      return true
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : "Data integrity check failed"
      return false
    }
  }

  // Categories management
  getCategories(): Category[] {
    try {
      console.log("Getting categories from storage...")
      const data = localStorage.getItem(this.STORAGE_KEYS.CATEGORIES)
      console.log("Raw categories data:", data ? `${data.length} characters` : "null")

      if (!data) {
        console.log("No categories data found")
        return []
      }

      const parsed = JSON.parse(data)
      console.log("Parsed categories:", parsed.length, "categories")

      // Convert date strings back to Date objects
      const categoriesWithDates = parsed.map((category: any) => ({
        ...category,
        articles: (category.articles || []).map((article: any) => ({
          ...article,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt),
        })),
        subcategories: (category.subcategories || []).map((subcategory: any) => ({
          ...subcategory,
          articles: (subcategory.articles || []).map((article: any) => ({
            ...article,
            createdAt: new Date(article.createdAt),
            updatedAt: new Date(article.updatedAt),
          })),
        })),
      }))

      console.log("Categories with dates processed")
      return categoriesWithDates
    } catch (error) {
      console.error("Error getting categories:", error)
      this.lastError = error instanceof Error ? error.message : "Failed to get categories"
      return []
    }
  }

  saveCategories(categories: Category[]): void {
    try {
      console.log("Saving categories to storage...", categories.length, "categories")
      const data = JSON.stringify(categories)
      console.log("Serialized data size:", data.length, "characters")
      localStorage.setItem(this.STORAGE_KEYS.CATEGORIES, data)
      console.log("Categories saved successfully")
      this.lastError = null
    } catch (error) {
      console.error("Error saving categories:", error)
      this.lastError = error instanceof Error ? error.message : "Failed to save categories"
      throw error
    }
  }

  // Users management
  getUsers(): User[] {
    try {
      console.log("Getting users from storage...")
      const data = localStorage.getItem(this.STORAGE_KEYS.USERS)
      console.log("Raw users data:", data ? `${data.length} characters` : "null")

      if (!data) {
        console.log("No users data found")
        return []
      }

      const parsed = JSON.parse(data)
      console.log("Parsed users:", parsed.length, "users")

      const usersWithDates = parsed.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
      }))

      console.log(
        "Users processed:",
        usersWithDates.map((u) => ({ username: u.username, role: u.role })),
      )
      return usersWithDates
    } catch (error) {
      console.error("Error getting users:", error)
      this.lastError = error instanceof Error ? error.message : "Failed to get users"
      return []
    }
  }

  saveUsers(users: User[]): void {
    try {
      console.log("Saving users to storage...", users.length, "users")
      localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users))
      console.log("Users saved successfully")
      this.lastError = null
    } catch (error) {
      console.error("Error saving users:", error)
      this.lastError = error instanceof Error ? error.message : "Failed to save users"
      throw error
    }
  }

  // Audit log management
  getAuditLog(): AuditLogEntry[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.AUDIT_LOG)
      if (!data) return []

      const parsed = JSON.parse(data)
      return parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }))
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : "Failed to get audit log"
      return []
    }
  }

  saveAuditLog(auditLog: AuditLogEntry[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.AUDIT_LOG, JSON.stringify(auditLog))
      this.lastError = null
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : "Failed to save audit log"
      throw error
    }
  }

  addAuditEntry(entry: Omit<AuditLogEntry, "id">): void {
    try {
      const auditLog = this.getAuditLog()
      const newEntry: AuditLogEntry = {
        ...entry,
        id: Date.now().toString(),
      }
      auditLog.unshift(newEntry)
      this.saveAuditLog(auditLog)
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : "Failed to add audit entry"
      console.error("Failed to add audit entry:", error)
    }
  }

  // Page visits management
  getPageVisits(): number {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.PAGE_VISITS)
      return data ? Number.parseInt(data, 10) : 0
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : "Failed to get page visits"
      return 0
    }
  }

  incrementPageVisits(): number {
    try {
      const current = this.getPageVisits()
      const newCount = current + 1
      localStorage.setItem(this.STORAGE_KEYS.PAGE_VISITS, newCount.toString())
      this.lastError = null
      return newCount
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : "Failed to increment page visits"
      return 0
    }
  }

  // Force persist critical data
  forcePersist(): boolean {
    try {
      // Force a write to ensure data is persisted
      const testKey = "kuhlekt_kb_persist_test"
      const testValue = Date.now().toString()
      localStorage.setItem(testKey, testValue)

      // Verify it was written
      const retrieved = localStorage.getItem(testKey)
      localStorage.removeItem(testKey)

      return retrieved === testValue
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : "Failed to force persist"
      return false
    }
  }

  // Clear all data
  clearAll(): void {
    try {
      Object.values(this.STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
      this.lastError = null
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : "Failed to clear data"
      throw error
    }
  }

  // Export data for backup
  exportData(): string {
    try {
      const data = {
        categories: this.getCategories(),
        users: this.getUsers(),
        auditLog: this.getAuditLog(),
        pageVisits: this.getPageVisits(),
        exportedAt: new Date().toISOString(),
        version: "1.1",
      }
      return JSON.stringify(data, null, 2)
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : "Failed to export data"
      throw error
    }
  }

  // Import data from backup
  importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData)

      if (data.categories) {
        this.saveCategories(data.categories)
      }
      if (data.users) {
        this.saveUsers(data.users)
      }
      if (data.auditLog) {
        this.saveAuditLog(data.auditLog)
      }
      if (data.pageVisits) {
        localStorage.setItem(this.STORAGE_KEYS.PAGE_VISITS, data.pageVisits.toString())
      }

      this.lastError = null
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : "Failed to import data"
      throw error
    }
  }
}

// Create singleton instance
export const storage = new StorageManager()
