import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

const STORAGE_KEYS = {
  CATEGORIES: "kb_categories",
  USERS: "kb_users",
  AUDIT_LOG: "kb_audit_log",
  PAGE_VISITS: "kb_page_visits",
} as const

export const storage = {
  getCategories: (): Category[] => {
    try {
      if (typeof window === "undefined") return []
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error loading categories:", error)
      return []
    }
  },

  saveCategories: (categories: Category[]): void => {
    try {
      if (typeof window === "undefined") return
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
    } catch (error) {
      console.error("Error saving categories:", error)
    }
  },

  getUsers: (): User[] => {
    try {
      if (typeof window === "undefined") return []
      const data = localStorage.getItem(STORAGE_KEYS.USERS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error loading users:", error)
      return []
    }
  },

  saveUsers: (users: User[]): void => {
    try {
      if (typeof window === "undefined") return
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
    } catch (error) {
      console.error("Error saving users:", error)
    }
  },

  getAuditLog: (): AuditLogEntry[] => {
    try {
      if (typeof window === "undefined") return []
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOG)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error loading audit log:", error)
      return []
    }
  },

  saveAuditLog: (auditLog: AuditLogEntry[]): void => {
    try {
      if (typeof window === "undefined") return
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(auditLog))
    } catch (error) {
      console.error("Error saving audit log:", error)
    }
  },

  getPageVisits: (): number => {
    try {
      if (typeof window === "undefined") return 0
      const data = localStorage.getItem(STORAGE_KEYS.PAGE_VISITS)
      return data ? Number.parseInt(data, 10) : 0
    } catch (error) {
      console.error("Error loading page visits:", error)
      return 0
    }
  },

  savePageVisits: (visits: number): void => {
    try {
      if (typeof window === "undefined") return
      localStorage.setItem(STORAGE_KEYS.PAGE_VISITS, visits.toString())
    } catch (error) {
      console.error("Error saving page visits:", error)
    }
  },

  clearAll: (): void => {
    try {
      if (typeof window === "undefined") return
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error("Error clearing storage:", error)
    }
  },
}
