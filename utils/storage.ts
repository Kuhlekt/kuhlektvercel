import { initialUsers } from "../data/initial-users"
import { initialCategories, initialArticles } from "../data/initial-data"
import type { User, Category, Article, AuditLog } from "../types/knowledge-base"

class Storage {
  private initialized = false

  init() {
    if (this.initialized) return

    console.log("🔧 Initializing storage...")

    // Initialize users if not exists
    if (!localStorage.getItem("kb_users")) {
      localStorage.setItem("kb_users", JSON.stringify(initialUsers))
      console.log("👥 Initialized users")
    }

    // Initialize categories if not exists
    if (!localStorage.getItem("kb_categories")) {
      localStorage.setItem("kb_categories", JSON.stringify(initialCategories))
      console.log("📁 Initialized categories")
    }

    // Initialize articles if not exists
    if (!localStorage.getItem("kb_articles")) {
      const articlesWithDates = initialArticles.map((article) => ({
        ...article,
        createdAt: new Date(article.createdAt),
        updatedAt: new Date(article.updatedAt),
      }))
      localStorage.setItem("kb_articles", JSON.stringify(articlesWithDates))
      console.log("📄 Initialized articles")
    }

    // Initialize audit log if not exists
    if (!localStorage.getItem("kb_audit_log")) {
      localStorage.setItem("kb_audit_log", JSON.stringify([]))
      console.log("📋 Initialized audit log")
    }

    this.initialized = true
    console.log("✅ Storage initialization complete")
  }

  // User management
  getUsers(): User[] {
    const users = localStorage.getItem("kb_users")
    return users ? JSON.parse(users) : []
  }

  saveUsers(users: User[]) {
    localStorage.setItem("kb_users", JSON.stringify(users))
  }

  authenticateUser(username: string, password: string): User | null {
    const users = this.getUsers()
    const user = users.find((u) => u.username === username && u.password === password)

    if (user) {
      this.setCurrentUser(user)
      this.addAuditEntry({
        userId: user.id,
        action: "LOGIN",
        details: `User ${user.username} logged in`,
      })
      console.log("✅ Authentication successful for:", username)
      return user
    }

    console.log("❌ Authentication failed for:", username)
    return null
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem("kb_current_user")
    return user ? JSON.parse(user) : null
  }

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem("kb_current_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("kb_current_user")
    }
  }

  // Category management
  getCategories(): Category[] {
    const categories = localStorage.getItem("kb_categories")
    return categories ? JSON.parse(categories) : []
  }

  saveCategories(categories: Category[]) {
    localStorage.setItem("kb_categories", JSON.stringify(categories))
  }

  // Article management
  getArticles(): Article[] {
    const articles = localStorage.getItem("kb_articles")
    if (!articles) return []

    return JSON.parse(articles).map((article: any) => ({
      ...article,
      createdAt: new Date(article.createdAt),
      updatedAt: new Date(article.updatedAt),
    }))
  }

  saveArticles(articles: Article[]) {
    localStorage.setItem("kb_articles", JSON.stringify(articles))
  }

  // Audit log
  getAuditLog(): AuditLog[] {
    const log = localStorage.getItem("kb_audit_log")
    if (!log) return []

    return JSON.parse(log).map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }))
  }

  addAuditEntry(entry: Omit<AuditLog, "id" | "timestamp">) {
    const auditLog = this.getAuditLog()
    const newEntry: AuditLog = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    auditLog.push(newEntry)
    localStorage.setItem("kb_audit_log", JSON.stringify(auditLog))
  }

  // Data export/import
  exportData() {
    return {
      users: this.getUsers(),
      categories: this.getCategories(),
      articles: this.getArticles(),
      auditLog: this.getAuditLog(),
      exportDate: new Date().toISOString(),
    }
  }

  importData(data: any) {
    try {
      if (data.users) this.saveUsers(data.users)
      if (data.categories) this.saveCategories(data.categories)
      if (data.articles) this.saveArticles(data.articles)

      this.addAuditEntry({
        userId: this.getCurrentUser()?.id || "system",
        action: "DATA_IMPORT",
        details: "Data imported successfully",
      })

      return true
    } catch (error) {
      console.error("Import failed:", error)
      return false
    }
  }

  clearAllData() {
    localStorage.removeItem("kb_users")
    localStorage.removeItem("kb_categories")
    localStorage.removeItem("kb_articles")
    localStorage.removeItem("kb_audit_log")
    localStorage.removeItem("kb_current_user")
    this.initialized = false
  }
}

export const storage = new Storage()
