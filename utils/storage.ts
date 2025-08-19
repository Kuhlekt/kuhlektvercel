import type { User, Category, Article, AuditLog } from "../types/knowledge-base"
import { initialUsers } from "../data/initial-users"
import { initialCategories, initialArticles } from "../data/initial-data"

class Storage {
  private readonly USERS_KEY = "kb_users"
  private readonly CATEGORIES_KEY = "kb_categories"
  private readonly ARTICLES_KEY = "kb_articles"
  private readonly AUDIT_LOG_KEY = "kb_audit_log"
  private readonly CURRENT_USER_KEY = "kb_current_user"

  constructor() {
    this.initializeData()
  }

  private initializeData() {
    if (typeof window === "undefined") return

    // Initialize users if not exists
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(initialUsers))
    }

    // Initialize categories if not exists
    if (!localStorage.getItem(this.CATEGORIES_KEY)) {
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(initialCategories))
    }

    // Initialize articles if not exists
    if (!localStorage.getItem(this.ARTICLES_KEY)) {
      localStorage.setItem(this.ARTICLES_KEY, JSON.stringify(initialArticles))
    }

    // Initialize audit log if not exists
    if (!localStorage.getItem(this.AUDIT_LOG_KEY)) {
      localStorage.setItem(this.AUDIT_LOG_KEY, JSON.stringify([]))
    }
  }

  // Users
  getUsers(): User[] {
    if (typeof window === "undefined") return initialUsers
    const users = localStorage.getItem(this.USERS_KEY)
    return users ? JSON.parse(users) : initialUsers
  }

  saveUsers(users: User[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
  }

  // Categories
  getCategories(): Category[] {
    if (typeof window === "undefined") return initialCategories
    const categories = localStorage.getItem(this.CATEGORIES_KEY)
    return categories ? JSON.parse(categories) : initialCategories
  }

  saveCategories(categories: Category[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories))
  }

  // Articles
  getArticles(): Article[] {
    if (typeof window === "undefined") return initialArticles
    const articles = localStorage.getItem(this.ARTICLES_KEY)
    return articles ? JSON.parse(articles) : initialArticles
  }

  saveArticles(articles: Article[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.ARTICLES_KEY, JSON.stringify(articles))
  }

  // Audit Log
  getAuditLog(): AuditLog[] {
    if (typeof window === "undefined") return []
    const auditLog = localStorage.getItem(this.AUDIT_LOG_KEY)
    return auditLog ? JSON.parse(auditLog) : []
  }

  saveAuditLog(auditLog: AuditLog[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.AUDIT_LOG_KEY, JSON.stringify(auditLog))
  }

  addAuditEntry(entry: { userId: string; action: string; details: string }): void {
    const auditLog = this.getAuditLog()
    const newEntry: AuditLog = {
      id: Date.now().toString(),
      ...entry,
      timestamp: new Date().toISOString(),
    }
    auditLog.unshift(newEntry)
    this.saveAuditLog(auditLog)
  }

  // Current User
  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem(this.CURRENT_USER_KEY)
    return user ? JSON.parse(user) : null
  }

  setCurrentUser(user: User | null): void {
    if (typeof window === "undefined") return
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY)
    }
  }

  // Clear all data
  clearAll(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.USERS_KEY)
    localStorage.removeItem(this.CATEGORIES_KEY)
    localStorage.removeItem(this.ARTICLES_KEY)
    localStorage.removeItem(this.AUDIT_LOG_KEY)
    localStorage.removeItem(this.CURRENT_USER_KEY)
    this.initializeData()
  }
}

export const storage = new Storage()
