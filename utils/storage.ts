import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

const STORAGE_KEYS = {
  CATEGORIES: 'kb_categories',
  USERS: 'kb_users',
  AUDIT_LOG: 'kb_audit_log',
  PAGE_VISITS: 'kb_page_visits'
}

// Helper function to safely parse dates
const parseDate = (dateValue: any): Date => {
  if (dateValue instanceof Date) return dateValue
  if (typeof dateValue === 'string') return new Date(dateValue)
  if (typeof dateValue === 'number') return new Date(dateValue)
  return new Date()
}

// Helper function to safely parse JSON
const safeJSONParse = (value: string | null, fallback: any = []) => {
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export const storage = {
  // Categories
  getCategories(): Category[] {
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    const categories = safeJSONParse(stored, [])
    
    // Convert date strings back to Date objects
    return categories.map((category: any) => ({
      ...category,
      articles: category.articles.map((article: any) => ({
        ...article,
        createdAt: parseDate(article.createdAt),
        updatedAt: parseDate(article.updatedAt)
      })),
      subcategories: category.subcategories.map((subcategory: any) => ({
        ...subcategory,
        articles: subcategory.articles.map((article: any) => ({
          ...article,
          createdAt: parseDate(article.createdAt),
          updatedAt: parseDate(article.updatedAt)
        }))
      }))
    }))
  },

  saveCategories(categories: Category[]): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
  },

  // Users
  getUsers(): User[] {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS)
    const users = safeJSONParse(stored, [])
    
    // Convert date strings back to Date objects
    return users.map((user: any) => ({
      ...user,
      createdAt: parseDate(user.createdAt),
      lastLogin: user.lastLogin ? parseDate(user.lastLogin) : undefined
    }))
  },

  saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  },

  // Audit Log
  getAuditLog(): AuditLogEntry[] {
    const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOG)
    const auditLog = safeJSONParse(stored, [])
    
    // Convert date strings back to Date objects
    return auditLog.map((entry: any) => ({
      ...entry,
      timestamp: parseDate(entry.timestamp)
    }))
  },

  saveAuditLog(auditLog: AuditLogEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(auditLog))
  },

  addAuditEntry(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const currentLog = this.getAuditLog()
    const newEntry: AuditLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...entry
    }
    const updatedLog = [newEntry, ...currentLog]
    this.saveAuditLog(updatedLog)
  },

  // Page Visits - Fixed function names
  getPageVisits(): number {
    const stored = localStorage.getItem(STORAGE_KEYS.PAGE_VISITS)
    return stored ? parseInt(stored, 10) : 0
  },

  incrementPageVisits(): number {
    const current = this.getPageVisits()
    const newCount = current + 1
    localStorage.setItem(STORAGE_KEYS.PAGE_VISITS, newCount.toString())
    return newCount
  },

  resetPageVisits(): void {
    localStorage.setItem(STORAGE_KEYS.PAGE_VISITS, '0')
  },

  // Clear all data
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
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
