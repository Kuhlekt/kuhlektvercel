import type { User, Category, Article, AuditLog } from "../types/knowledge-base"
import { initialUsers, userPasswords } from "../data/initial-users"
import { initialCategories, initialArticles } from "../data/initial-data"
import { initialAuditLog } from "../data/initial-audit-log"

const STORAGE_KEYS = {
  USERS: "kuhlekt_kb_users",
  CATEGORIES: "kuhlekt_kb_categories",
  ARTICLES: "kuhlekt_kb_articles",
  AUDIT_LOG: "kuhlekt_kb_audit_log",
  CURRENT_USER: "kuhlekt_kb_current_user",
  PAGE_VISITS: "kuhlekt_kb_page_visits",
}

class Storage {
  private isClient = typeof window !== "undefined"

  // User Management
  getUsers(): User[] {
    if (!this.isClient) return initialUsers
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS)
      if (stored) {
        const users = JSON.parse(stored)
        return users.map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
        }))
      }
      this.saveUsers(initialUsers)
      return initialUsers
    } catch {
      return initialUsers
    }
  }

  saveUsers(users: User[]): void {
    if (!this.isClient) return
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
    } catch (error) {
      console.error("Failed to save users:", error)
    }
  }

  authenticateUser(username: string, password: string): User | null {
    const users = this.getUsers()
    const user = users.find((u) => u.username === username && u.isActive)

    if (user && userPasswords[username] === password) {
      // Update last login
      const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, lastLogin: new Date() } : u))
      this.saveUsers(updatedUsers)

      // Log the login
      this.addAuditEntry({
        performedBy: user.id,
        action: "LOGIN",
        details: `User ${user.username} logged in`,
      })

      return { ...user, lastLogin: new Date() }
    }
    return null
  }

  getCurrentUser(): User | null {
    if (!this.isClient) return null
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
      if (stored) {
        const user = JSON.parse(stored)
        return {
          ...user,
          createdAt: new Date(user.createdAt),
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
        }
      }
    } catch {
      return null
    }
    return null
  }

  setCurrentUser(user: User | null): void {
    if (!this.isClient) return
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
      }
    } catch (error) {
      console.error("Failed to set current user:", error)
    }
  }

  // Category Management
  getCategories(): Category[] {
    if (!this.isClient) return initialCategories
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
      if (stored) {
        const categories = JSON.parse(stored)
        return categories.map((cat: any) => ({
          ...cat,
          createdAt: new Date(cat.createdAt),
          subcategories: cat.subcategories || [],
          articles: cat.articles || [],
        }))
      }
      this.saveCategories(initialCategories)
      return initialCategories
    } catch {
      return initialCategories
    }
  }

  saveCategories(categories: Category[]): void {
    if (!this.isClient) return
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
    } catch (error) {
      console.error("Failed to save categories:", error)
    }
  }

  // Article Management
  getArticles(): Article[] {
    if (!this.isClient) return initialArticles
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ARTICLES)
      if (stored) {
        const articles = JSON.parse(stored)
        return articles.map((article: any) => ({
          ...article,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt),
        }))
      }
      this.saveArticles(initialArticles)
      return initialArticles
    } catch {
      return initialArticles
    }
  }

  saveArticles(articles: Article[]): void {
    if (!this.isClient) return
    try {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles))
    } catch (error) {
      console.error("Failed to save articles:", error)
    }
  }

  // Audit Log
  getAuditLog(): AuditLog[] {
    if (!this.isClient) return initialAuditLog
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOG)
      if (stored) {
        const log = JSON.parse(stored)
        return log.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }))
      }
      this.saveAuditLog(initialAuditLog)
      return initialAuditLog
    } catch {
      return initialAuditLog
    }
  }

  saveAuditLog(auditLog: AuditLog[]): void {
    if (!this.isClient) return
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(auditLog))
    } catch (error) {
      console.error("Failed to save audit log:", error)
    }
  }

  addAuditEntry(entry: Omit<AuditLog, "id" | "timestamp">): void {
    const auditLog = this.getAuditLog()
    const newEntry: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...entry,
    }
    auditLog.push(newEntry)
    this.saveAuditLog(auditLog)
  }

  // Page Visits
  getPageVisits(): number {
    if (!this.isClient) return 0
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PAGE_VISITS)
      return stored ? Number.parseInt(stored, 10) : 0
    } catch {
      return 0
    }
  }

  incrementPageVisits(): void {
    if (!this.isClient) return
    try {
      const visits = this.getPageVisits() + 1
      localStorage.setItem(STORAGE_KEYS.PAGE_VISITS, visits.toString())
    } catch (error) {
      console.error("Failed to increment page visits:", error)
    }
  }

  // Data Management
  exportData() {
    return {
      users: this.getUsers(),
      categories: this.getCategories(),
      articles: this.getArticles(),
      auditLog: this.getAuditLog(),
      pageVisits: this.getPageVisits(),
      exportDate: new Date().toISOString(),
    }
  }

  importData(data: any): void {
    if (!this.isClient) return
    try {
      if (data.users) this.saveUsers(data.users)
      if (data.categories) this.saveCategories(data.categories)
      if (data.articles) this.saveArticles(data.articles)
      if (data.auditLog) this.saveAuditLog(data.auditLog)
      if (data.pageVisits) {
        localStorage.setItem(STORAGE_KEYS.PAGE_VISITS, data.pageVisits.toString())
      }
    } catch (error) {
      console.error("Failed to import data:", error)
      throw error
    }
  }

  clearAll(): void {
    if (!this.isClient) return
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error("Failed to clear data:", error)
    }
  }
}

export const storage = new Storage()
