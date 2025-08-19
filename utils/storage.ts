import type { User, Category, Article, AuditLog } from "../types/knowledge-base"
import { initialUsers } from "../data/initial-users"
import { initialCategories, initialArticles } from "../data/initial-data"

class Storage {
  private readonly USERS_KEY = "kb_users"
  private readonly CATEGORIES_KEY = "kb_categories"
  private readonly ARTICLES_KEY = "kb_articles"
  private readonly CURRENT_USER_KEY = "kb_current_user"
  private readonly AUDIT_LOG_KEY = "kb_audit_log"

  init() {
    if (typeof window === "undefined") return

    console.log("🔧 Initializing storage...")

    // Initialize users - always ensure admin user exists
    const existingUsers = localStorage.getItem(this.USERS_KEY)
    if (!existingUsers) {
      console.log("👥 No users found, initializing with admin user")
      localStorage.setItem(this.USERS_KEY, JSON.stringify(initialUsers))
    } else {
      // Ensure admin user exists
      const users = JSON.parse(existingUsers)
      const hasAdmin = users.some((user: User) => user.username === "admin")
      if (!hasAdmin) {
        console.log("👥 Adding admin user to existing users")
        const updatedUsers = [...users, ...initialUsers]
        localStorage.setItem(this.USERS_KEY, JSON.stringify(updatedUsers))
      }
    }

    // Initialize categories (empty by default)
    if (!localStorage.getItem(this.CATEGORIES_KEY)) {
      console.log("📁 Initializing empty categories")
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(initialCategories))
    }

    // Initialize articles (empty by default)
    if (!localStorage.getItem(this.ARTICLES_KEY)) {
      console.log("📄 Initializing empty articles")
      localStorage.setItem(this.ARTICLES_KEY, JSON.stringify(initialArticles))
    }

    // Initialize audit log
    if (!localStorage.getItem(this.AUDIT_LOG_KEY)) {
      console.log("📋 Initializing empty audit log")
      localStorage.setItem(this.AUDIT_LOG_KEY, JSON.stringify([]))
    }

    console.log("✅ Storage initialization complete")
  }

  getUsers(): User[] {
    if (typeof window === "undefined") return initialUsers
    const users = localStorage.getItem(this.USERS_KEY)
    if (users) {
      const parsed = JSON.parse(users)
      return parsed.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
      }))
    }
    return initialUsers
  }

  saveUsers(users: User[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
    console.log("💾 Users saved:", users.length)
  }

  authenticateUser(username: string, password: string): User | null {
    console.log("🔐 Authenticating user:", username)
    const users = this.getUsers()
    console.log(
      "👥 Available users:",
      users.map((u) => ({ username: u.username, role: u.role })),
    )

    const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password)

    if (user) {
      console.log("✅ Authentication successful for:", user.username)
      const updatedUser = { ...user, lastLogin: new Date() }
      const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
      this.saveUsers(updatedUsers)
      this.setCurrentUser(updatedUser)
      this.addAuditEntry({
        performedBy: user.id,
        action: "LOGIN",
        details: `User ${user.username} logged in`,
      })
      return updatedUser
    }

    console.log("❌ Authentication failed for:", username)
    return null
  }

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem(this.CURRENT_USER_KEY)
    if (user) {
      try {
        const parsed = JSON.parse(user)
        return {
          ...parsed,
          createdAt: new Date(parsed.createdAt),
          lastLogin: parsed.lastLogin ? new Date(parsed.lastLogin) : undefined,
        }
      } catch (error) {
        console.error("Error parsing current user:", error)
        localStorage.removeItem(this.CURRENT_USER_KEY)
        return null
      }
    }
    return null
  }

  setCurrentUser(user: User | null) {
    if (typeof window === "undefined") return
    if (user) {
      console.log("💾 Setting current user:", user.username)
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user))
    } else {
      console.log("🗑️ Clearing current user")
      localStorage.removeItem(this.CURRENT_USER_KEY)
    }
  }

  getCategories(): Category[] {
    if (typeof window === "undefined") return initialCategories
    const categories = localStorage.getItem(this.CATEGORIES_KEY)
    if (categories) {
      const parsed = JSON.parse(categories)
      return parsed.map((cat: any) => ({
        ...cat,
        createdAt: new Date(cat.createdAt),
      }))
    }
    return initialCategories
  }

  saveCategories(categories: Category[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories))
    console.log("💾 Categories saved:", categories.length)
  }

  getArticles(): Article[] {
    if (typeof window === "undefined") return initialArticles
    const articles = localStorage.getItem(this.ARTICLES_KEY)
    if (articles) {
      const parsed = JSON.parse(articles)
      return parsed.map((article: any) => ({
        ...article,
        createdAt: new Date(article.createdAt),
        updatedAt: new Date(article.updatedAt),
      }))
    }
    return initialArticles
  }

  saveArticles(articles: Article[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(this.ARTICLES_KEY, JSON.stringify(articles))
    console.log("💾 Articles saved:", articles.length)
  }

  getAuditLog(): AuditLog[] {
    if (typeof window === "undefined") return []
    const log = localStorage.getItem(this.AUDIT_LOG_KEY)
    if (log) {
      const parsed = JSON.parse(log)
      return parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }))
    }
    return []
  }

  addAuditEntry(entry: { performedBy: string; action: string; details: string }) {
    if (typeof window === "undefined") return
    const log = this.getAuditLog()
    const newEntry: AuditLog = {
      id: Date.now().toString(),
      ...entry,
      timestamp: new Date(),
    }
    log.push(newEntry)
    localStorage.setItem(this.AUDIT_LOG_KEY, JSON.stringify(log))
    console.log("📋 Audit entry added:", newEntry.action)
  }

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
    if (data.users) {
      // Ensure proper date parsing for users
      const parsedUsers = data.users.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
      }))
      this.saveUsers(parsedUsers)
      console.log("📥 Users imported:", parsedUsers.length)
    }

    if (data.categories) {
      // Ensure proper date parsing for categories
      const parsedCategories = data.categories.map((category: any) => ({
        ...category,
        createdAt: new Date(category.createdAt),
      }))
      this.saveCategories(parsedCategories)
      console.log("📥 Categories imported:", parsedCategories.length)
    }

    if (data.articles) {
      // Ensure proper date parsing for articles
      const parsedArticles = data.articles.map((article: any) => ({
        ...article,
        createdAt: new Date(article.createdAt),
        updatedAt: new Date(article.updatedAt),
      }))
      localStorage.setItem(this.ARTICLES_KEY, JSON.stringify(parsedArticles))
      console.log("📥 Articles imported:", parsedArticles.length)
    }

    if (data.auditLog) {
      // Ensure proper date parsing for audit log
      const parsedAuditLog = data.auditLog.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }))
      localStorage.setItem(this.AUDIT_LOG_KEY, JSON.stringify(parsedAuditLog))
      console.log("📥 Audit log imported:", parsedAuditLog.length)
    }
  }

  clearArticlesAndCategories() {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.CATEGORIES_KEY)
    localStorage.removeItem(this.ARTICLES_KEY)

    // Reinitialize with empty data
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify([]))
    localStorage.setItem(this.ARTICLES_KEY, JSON.stringify([]))

    console.log("🗑️ Articles and categories data cleared")
  }

  clearAll() {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.USERS_KEY)
    this.clearArticlesAndCategories()
    localStorage.removeItem(this.CURRENT_USER_KEY)
    localStorage.removeItem(this.AUDIT_LOG_KEY)
    console.log("🗑️ All data cleared")
  }

  resetToDefaults() {
    this.clearAll()
    this.init()
    console.log("🔄 Reset to defaults complete")
  }
}

export const storage = new Storage()
