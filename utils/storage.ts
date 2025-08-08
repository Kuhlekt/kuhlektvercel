import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

const STORAGE_KEYS = {
  CATEGORIES: "kb_categories",
  USERS: "kb_users", 
  AUDIT_LOG: "kb_audit_log",
  PAGE_VISITS: "kb_page_visits"
}

// Helper function to safely parse dates
const parseDate = (dateValue: any): Date => {
  if (dateValue instanceof Date) return dateValue
  if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    const parsed = new Date(dateValue)
    return isNaN(parsed.getTime()) ? new Date() : parsed
  }
  return new Date()
}

export const storage = {
  // Categories
  getCategories: (): Category[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
      if (!stored) return []
      
      const categories = JSON.parse(stored)
      return categories.map((category: any) => ({
        ...category,
        articles: (category.articles || []).map((article: any) => ({
          ...article,
          createdAt: parseDate(article.createdAt),
          updatedAt: parseDate(article.updatedAt)
        })),
        subcategories: (category.subcategories || []).map((subcategory: any) => ({
          ...subcategory,
          articles: (subcategory.articles || []).map((article: any) => ({
            ...article,
            createdAt: parseDate(article.createdAt),
            updatedAt: parseDate(article.updatedAt)
          }))
        }))
      }))
    } catch (error) {
      console.error("Error loading categories:", error)
      return []
    }
  },

  saveCategories: (categories: Category[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
    } catch (error) {
      console.error("Error saving categories:", error)
    }
  },

  // Users
  getUsers: (): User[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS)
      if (!stored) return []
      
      const users = JSON.parse(stored)
      return users.map((user: any) => ({
        ...user,
        createdAt: parseDate(user.createdAt),
        lastLogin: user.lastLogin ? parseDate(user.lastLogin) : undefined
      }))
    } catch (error) {
      console.error("Error loading users:", error)
      return []
    }
  },

  saveUsers: (users: User[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
    } catch (error) {
      console.error("Error saving users:", error)
    }
  },

  // Audit Log
  getAuditLog: (): AuditLogEntry[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOG)
      if (!stored) return []
      
      const entries = JSON.parse(stored)
      return entries.map((entry: any) => ({
        ...entry,
        timestamp: parseDate(entry.timestamp)
      }))
    } catch (error) {
      console.error("Error loading audit log:", error)
      return []
    }
  },

  saveAuditLog: (auditLog: AuditLogEntry[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(auditLog))
    } catch (error) {
      console.error("Error saving audit log:", error)
    }
  },

  addAuditEntry: (entry: Omit<AuditLogEntry, "id" | "timestamp">): void => {
    try {
      const currentLog = storage.getAuditLog()
      const newEntry: AuditLogEntry = {
        ...entry,
        id: Date.now().toString(),
        timestamp: new Date()
      }
      currentLog.unshift(newEntry)
      
      // Keep only last 1000 entries
      if (currentLog.length > 1000) {
        currentLog.splice(1000)
      }
      
      storage.saveAuditLog(currentLog)
    } catch (error) {
      console.error("Error adding audit entry:", error)
    }
  },

  // Page Visits
  getPageVisits: (): number => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PAGE_VISITS)
      return stored ? parseInt(stored, 10) : 0
    } catch (error) {
      console.error("Error loading page visits:", error)
      return 0
    }
  },

  incrementPageVisits: (): number => {
    try {
      const current = storage.getPageVisits()
      const newCount = current + 1
      localStorage.setItem(STORAGE_KEYS.PAGE_VISITS, newCount.toString())
      return newCount
    } catch (error) {
      console.error("Error incrementing page visits:", error)
      return 0
    }
  },

  // Clear all data
  clearAll: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error("Error clearing data:", error)
    }
  }
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
        version: '1.0'
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `knowledge-base-backup-${new Date().toISOString().split('T')[0]}.json`
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
  importData: (file: File): Promise<{ categories: Category[], users: User[], auditLog: AuditLogEntry[], pageVisits?: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          
          // Validate data structure
          if (!data.categories || !Array.isArray(data.categories)) {
            throw new Error('Invalid backup file: missing or invalid categories')
          }
          if (!data.users || !Array.isArray(data.users)) {
            throw new Error('Invalid backup file: missing or invalid users')
          }
          if (!data.auditLog || !Array.isArray(data.auditLog)) {
            throw new Error('Invalid backup file: missing or invalid audit log')
          }

          // Convert date strings back to Date objects with safe parsing
          const categories = data.categories.map((cat: any) => ({
            ...cat,
            articles: (cat.articles || []).map((article: any) => ({
              ...article,
              createdAt: parseDate(article.createdAt),
              updatedAt: parseDate(article.updatedAt)
            })),
            subcategories: (cat.subcategories || []).map((sub: any) => ({
              ...sub,
              articles: (sub.articles || []).map((article: any) => ({
                ...article,
                createdAt: parseDate(article.createdAt),
                updatedAt: parseDate(article.updatedAt)
              }))
            }))
          }))

          const users = data.users.map((user: any) => ({
            ...user,
            createdAt: parseDate(user.createdAt),
            lastLogin: user.lastLogin ? parseDate(user.lastLogin) : undefined
          }))

          const auditLog = data.auditLog.map((entry: any) => ({
            ...entry,
            timestamp: parseDate(entry.timestamp)
          }))

          resolve({ 
            categories, 
            users, 
            auditLog, 
            pageVisits: data.pageVisits || 0 
          })
        } catch (error) {
          console.error("Error parsing backup file:", error)
          reject(new Error(`Failed to parse backup file: ${error instanceof Error ? error.message : 'Unknown error'}`))
        }
      }

      reader.onerror = () => {
        console.error("Error reading file")
        reject(new Error('Failed to read file'))
      }
      
      reader.readAsText(file)
    })
  }
}
