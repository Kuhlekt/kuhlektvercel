import type { User, Category, Article, AuditLog } from "../types/knowledge-base"
import { initialUsers } from "../data/initial-users"
import { initialCategories, initialArticles } from "../data/initial-data"

const STORAGE_KEYS = {
  USERS: "kb_users",
  CATEGORIES: "kb_categories",
  ARTICLES: "kb_articles",
  AUDIT_LOG: "kb_audit_log",
  CURRENT_USER: "kb_current_user",
}

export const storage = {
  getUsers(): User[] {
    if (typeof window === "undefined") return initialUsers
    const stored = localStorage.getItem(STORAGE_KEYS.USERS)
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers))
      return initialUsers
    }
    return JSON.parse(stored)
  },

  saveUsers(users: User[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  },

  getCategories(): Category[] {
    if (typeof window === "undefined") return initialCategories
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories))
      return initialCategories
    }
    return JSON.parse(stored)
  },

  saveCategories(categories: Category[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
  },

  getArticles(): Article[] {
    if (typeof window === "undefined") return initialArticles
    const stored = localStorage.getItem(STORAGE_KEYS.ARTICLES)
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(initialArticles))
      return initialArticles
    }
    return JSON.parse(stored)
  },

  saveArticles(articles: Article[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles))
  },

  getAuditLog(): AuditLog[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOG)
    return stored ? JSON.parse(stored) : []
  },

  saveAuditLog(log: AuditLog[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(log))
  },

  addAuditEntry(entry: Omit<AuditLog, "id" | "timestamp">): void {
    const log = this.getAuditLog()
    const newEntry: AuditLog = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }
    log.push(newEntry)
    this.saveAuditLog(log)
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return stored ? JSON.parse(stored) : null
  },

  setCurrentUser(user: User | null): void {
    if (typeof window === "undefined") return
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    }
  },
}
