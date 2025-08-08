import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

const STORAGE_KEYS = {
  CATEGORIES: 'kb_categories',
  USERS: 'kb_users', 
  AUDIT_LOG: 'kb_audit_log',
  LAST_BACKUP: 'kb_last_backup',
  PAGE_VISITS: 'kb_page_visits'
}

// Storage utilities
export const storage = {
  // Save data to localStorage
  saveCategories: (categories: Category[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
      localStorage.setItem(STORAGE_KEYS.LAST_BACKUP, new Date().toISOString())
    } catch (error) {
      console.error('Failed to save categories:', error)
    }
  },

  saveUsers: (users: User[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
    } catch (error) {
      console.error('Failed to save users:', error)
    }
  },

  saveAuditLog: (auditLog: AuditLogEntry[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(auditLog))
    } catch (error) {
      console.error('Failed to save audit log:', error)
    }
  },

  // Page visit counter
  incrementPageVisits: (): number => {
    try {
      const currentVisits = parseInt(localStorage.getItem(STORAGE_KEYS.PAGE_VISITS) || '0', 10)
      const newVisits = currentVisits + 1
      localStorage.setItem(STORAGE_KEYS.PAGE_VISITS, newVisits.toString())
      return newVisits
    } catch (error) {
      console.error('Failed to increment page visits:', error)
      return 1
    }
  },

  getPageVisits: (): number => {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEYS.PAGE_VISITS) || '0', 10)
    } catch (error) {
      console.error('Failed to get page visits:', error)
      return 0
    }
  },

  resetPageVisits: () => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAGE_VISITS, '0')
    } catch (error) {
      console.error('Failed to reset page visits:', error)
    }
  },

  // Load data from localStorage
  loadCategories: (): Category[] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
      if (data) {
        const categories = JSON.parse(data)
        // Convert date strings back to Date objects
        return categories.map((cat: any) => ({
          ...cat,
          articles: cat.articles.map((article: any) => ({
            ...article,
            createdAt: new Date(article.createdAt),
            updatedAt: new Date(article.updatedAt)
          })),
          subcategories: cat.subcategories.map((sub: any) => ({
            ...sub,
            articles: sub.articles.map((article: any) => ({
              ...article,
              createdAt: new Date(article.createdAt),
              updatedAt: new Date(article.updatedAt)
            }))
          }))
        }))
      }
      return null
    } catch (error) {
      console.error('Failed to load categories:', error)
      return null
    }
  },

  loadUsers: (): User[] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS)
      if (data) {
        const users = JSON.parse(data)
        return users.map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined
        }))
      }
      return null
    } catch (error) {
      console.error('Failed to load users:', error)
      return null
    }
  },

  loadAuditLog: (): AuditLogEntry[] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOG)
      if (data) {
        const auditLog = JSON.parse(data)
        return auditLog.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }))
      }
      return null
    } catch (error) {
      console.error('Failed to load audit log:', error)
      return null
    }
  },

  // Get last backup time
  getLastBackupTime: (): Date | null => {
    try {
      const timestamp = localStorage.getItem(STORAGE_KEYS.LAST_BACKUP)
      return timestamp ? new Date(timestamp) : null
    } catch (error) {
      return null
    }
  },

  // Clear all data
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  },

  // Check if data exists
  hasStoredData: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.CATEGORIES) !== null
  }
}

// Export/Import utilities
export const dataManager = {
  // Export all data as JSON
  exportData: () => {
    const data = {
      categories: storage.loadCategories(),
      users: storage.loadUsers(),
      auditLog: storage.loadAuditLog(),
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
  },

  // Import data from JSON file
  importData: (file: File): Promise<{ categories: Category[], users: User[], auditLog: AuditLogEntry[], pageVisits?: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          
          // Validate data structure
          if (!data.categories || !data.users || !data.auditLog) {
            throw new Error('Invalid backup file format')
          }

          // Convert date strings back to Date objects
          const categories = data.categories.map((cat: any) => ({
            ...cat,
            articles: cat.articles.map((article: any) => ({
              ...article,
              createdAt: new Date(article.createdAt),
              updatedAt: new Date(article.updatedAt)
            })),
            subcategories: cat.subcategories.map((sub: any) => ({
              ...sub,
              articles: sub.articles.map((article: any) => ({
                ...article,
                createdAt: new Date(article.createdAt),
                updatedAt: new Date(article.updatedAt)
              }))
            }))
          }))

          const users = data.users.map((user: any) => ({
            ...user,
            createdAt: new Date(user.createdAt),
            lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined
          }))

          const auditLog = data.auditLog.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
          }))

          resolve({ 
            categories, 
            users, 
            auditLog, 
            pageVisits: data.pageVisits || 0 
          })
        } catch (error) {
          reject(new Error('Failed to parse backup file: ' + error))
        }
      }

      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }
}
