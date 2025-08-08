import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

// Safe localStorage wrapper to prevent SSR issues
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, value)
    } catch {
      // Silently fail if localStorage is not available
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch {
      // Silently fail if localStorage is not available
    }
  }
}

// Date revival function for JSON parsing
function reviveDates(key: string, value: any): any {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return new Date(value)
  }
  return value
}

export const storage = {
  // Categories
  getCategories: (): Category[] => {
    const data = safeLocalStorage.getItem('kb_categories')
    if (!data) return []
    try {
      return JSON.parse(data, reviveDates)
    } catch {
      return []
    }
  },

  saveCategories: (categories: Category[]): void => {
    safeLocalStorage.setItem('kb_categories', JSON.stringify(categories))
  },

  // Users
  getUsers: (): User[] => {
    const data = safeLocalStorage.getItem('kb_users')
    if (!data) return []
    try {
      return JSON.parse(data, reviveDates)
    } catch {
      return []
    }
  },

  saveUsers: (users: User[]): void => {
    safeLocalStorage.setItem('kb_users', JSON.stringify(users))
  },

  // Audit Log
  getAuditLog: (): AuditLogEntry[] => {
    const data = safeLocalStorage.getItem('kb_audit_log')
    if (!data) return []
    try {
      return JSON.parse(data, reviveDates)
    } catch {
      return []
    }
  },

  saveAuditLog: (auditLog: AuditLogEntry[]): void => {
    safeLocalStorage.setItem('kb_audit_log', JSON.stringify(auditLog))
  },

  addAuditEntry: (entry: Omit<AuditLogEntry, 'id'>): void => {
    const auditLog = storage.getAuditLog()
    const newEntry: AuditLogEntry = {
      ...entry,
      id: Date.now().toString()
    }
    auditLog.unshift(newEntry)
    storage.saveAuditLog(auditLog)
  },

  // Page Visits
  getPageVisits: (): number => {
    const data = safeLocalStorage.getItem('kb_page_visits')
    return data ? parseInt(data, 10) || 0 : 0
  },

  incrementPageVisits: (): number => {
    const current = storage.getPageVisits()
    const newCount = current + 1
    safeLocalStorage.setItem('kb_page_visits', newCount.toString())
    return newCount
  },

  // Export all data
  exportData: () => {
    return {
      categories: storage.getCategories(),
      users: storage.getUsers(),
      auditLog: storage.getAuditLog(),
      pageVisits: storage.getPageVisits(),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
  },

  // Import data
  importData: (data: any): boolean => {
    try {
      if (data.categories) storage.saveCategories(data.categories)
      if (data.users) storage.saveUsers(data.users)
      if (data.auditLog) storage.saveAuditLog(data.auditLog)
      if (data.pageVisits) safeLocalStorage.setItem('kb_page_visits', data.pageVisits.toString())
      return true
    } catch {
      return false
    }
  },

  // Clear all data
  clearAll: (): void => {
    safeLocalStorage.removeItem('kb_categories')
    safeLocalStorage.removeItem('kb_users')
    safeLocalStorage.removeItem('kb_audit_log')
    safeLocalStorage.removeItem('kb_page_visits')
  }
}

// Data manager for file operations
export const dataManager = {
  exportData: async (): Promise<void> => {
    const data = storage.exportData()
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

  importData: async (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          resolve(data)
        } catch (error) {
          reject(new Error('Invalid JSON file'))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }
}
