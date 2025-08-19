import type { User, Category, Article, AuditLog } from "../types/knowledge-base"
import { initialUsers } from "../data/initial-users"
import { initialCategories, initialArticles } from "../data/initial-data"

class Storage {
  private readonly USERS_KEY = "kuhlekt_kb_users"
  private readonly CATEGORIES_KEY = "kuhlekt_kb_categories"
  private readonly ARTICLES_KEY = "kuhlekt_kb_articles"
  private readonly CURRENT_USER_KEY = "kuhlekt_kb_current_user"
  private readonly AUDIT_LOG_KEY = "kuhlekt_kb_audit_log"
  private readonly PAGE_VISITS_KEY = "kuhlekt_kb_page_visits"

  init() {
    if (typeof window === "undefined") return

    console.log("🔧 Initializing storage...")

    // Initialize users - always ensure admin user exists
    const existingUsers = localStorage.getItem(this.USERS_KEY)
    if (!existingUsers) {
      console.log("👥 No users found, initializing with admin user")
      localStorage.setItem(this.USERS_KEY, JSON.stringify(initialUsers))
    } else {
      // Parse existing users and ensure admin exists
      try {
        const users = JSON.parse(existingUsers)
        const hasAdmin = users.some((user: User) => user.username === "admin")
        if (!hasAdmin) {
          console.log("👥 Adding admin user to existing users")
          const updatedUsers = [...users, ...initialUsers]
          localStorage.setItem(this.USERS_KEY, JSON.stringify(updatedUsers))
        }
      } catch (error) {
        console.error("Error parsing users, reinitializing:", error)
        localStorage.setItem(this.USERS_KEY, JSON.stringify(initialUsers))
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

    // Initialize page visits
    if (!localStorage.getItem(this.PAGE_VISITS_KEY)) {
      localStorage.setItem(this.PAGE_VISITS_KEY, "0")
    }

    // Increment page visits
    const visits = Number.parseInt(localStorage.getItem(this.PAGE_VISITS_KEY) || "0") + 1
    localStorage.setItem(this.PAGE_VISITS_KEY, visits.toString())

    console.log("✅ Storage initialization complete")

    // Debug: Log current users
    const currentUsers = this.getUsers()
    console.log(
      "👥 Current users in storage:",
      currentUsers.map((u) => ({ username: u.username, password: u.password })),
    )
  }

  getUsers(): User[] {
    if (typeof window === "undefined") return initialUsers
    const users = localStorage.getItem(this.USERS_KEY)
    if (users) {
      try {
        const parsed = JSON.parse(users)
        return parsed.map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
        }))
      } catch (error) {
        console.error("Error parsing users:", error)
        return initialUsers
      }
    }
    return initialUsers
  }

  saveUsers(users: User[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
    console.log("💾 Users saved:", users.length)
  }

  authenticateUser(username: string, password: string): User | null {
    console.log("🔐 Authenticating user:", username, "with password:", password)
    const users = this.getUsers()
    console.log(
      "👥 Available users:",
      users.map((u) => ({
        username: u.username,
        password: u.password,
        role: u.role,
      })),
    )

    const user = users.find((u) => {
      const usernameMatch = u.username.toLowerCase() === username.toLowerCase()
      const passwordMatch = u.password === password
      console.log(`Checking user ${u.username}: username match=${usernameMatch}, password match=${passwordMatch}`)
      return usernameMatch && passwordMatch
    })

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
      try {
        const parsed = JSON.parse(categories)
        return parsed.map((cat: any) => ({
          ...cat,
          createdAt: new Date(cat.createdAt),
        }))
      } catch (error) {
        console.error("Error parsing categories:", error)
        return initialCategories
      }
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
      try {
        const parsed = JSON.parse(articles)
        return parsed.map((article: any) => ({
          ...article,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt),
        }))
      } catch (error) {
        console.error("Error parsing articles:", error)
        return initialArticles
      }
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
      try {
        const parsed = JSON.parse(log)
        return parsed.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }))
      } catch (error) {
        console.error("Error parsing audit log:", error)
        return []
      }
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

  getPageVisits(): number {
    if (typeof window === "undefined") return 0
    return Number.parseInt(localStorage.getItem(this.PAGE_VISITS_KEY) || "0")
  }

  // Health check and diagnostics
  checkHealth() {
    if (typeof window === "undefined") {
      return {
        isAvailable: false,
        hasData: false,
        dataIntegrity: false,
        lastError: "Window not available (SSR)",
      }
    }

    try {
      const users = this.getUsers()
      const categories = this.getCategories()
      const articles = this.getArticles()
      const auditLog = this.getAuditLog()

      return {
        isAvailable: true,
        hasData: users.length > 0 || categories.length > 0 || articles.length > 0,
        dataIntegrity:
          Array.isArray(users) && Array.isArray(categories) && Array.isArray(articles) && Array.isArray(auditLog),
        lastError: null,
      }
    } catch (error) {
      return {
        isAvailable: true,
        hasData: false,
        dataIntegrity: false,
        lastError: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  getStorageInfo() {
    if (typeof window === "undefined") {
      return {
        totalSize: 0,
        availableSpace: 0,
        usersSize: 0,
        categoriesSize: 0,
        articlesSize: 0,
        auditLogSize: 0,
        pageVisitsSize: 0,
      }
    }

    const getItemSize = (key: string) => {
      const item = localStorage.getItem(key)
      return item ? new Blob([item]).size : 0
    }

    const usersSize = getItemSize(this.USERS_KEY)
    const categoriesSize = getItemSize(this.CATEGORIES_KEY)
    const articlesSize = getItemSize(this.ARTICLES_KEY)
    const auditLogSize = getItemSize(this.AUDIT_LOG_KEY)
    const pageVisitsSize = getItemSize(this.PAGE_VISITS_KEY)

    const totalSize = usersSize + categoriesSize + articlesSize + auditLogSize + pageVisitsSize

    // Estimate available space (localStorage typically has 5-10MB limit)
    const estimatedLimit = 5 * 1024 * 1024 // 5MB
    const availableSpace = Math.max(0, estimatedLimit - totalSize)

    return {
      totalSize,
      availableSpace,
      usersSize,
      categoriesSize,
      articlesSize,
      auditLogSize,
      pageVisitsSize,
    }
  }

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

  importData(data: any) {
    if (data.users) {
      this.saveUsers(data.users)
      console.log("📥 Users imported")
    }
    if (data.categories) {
      this.saveCategories(data.categories)
      console.log("📥 Categories imported")
    }
    if (data.articles) {
      this.saveArticles(data.articles)
      console.log("📥 Articles imported")
    }
    if (data.auditLog) {
      localStorage.setItem(this.AUDIT_LOG_KEY, JSON.stringify(data.auditLog))
      console.log("📥 Audit log imported")
    }
    if (data.pageVisits) {
      localStorage.setItem(this.PAGE_VISITS_KEY, data.pageVisits.toString())
      console.log("📥 Page visits imported")
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
    localStorage.removeItem(this.PAGE_VISITS_KEY)
    console.log("🗑️ All data cleared")
  }

  resetToDefaults() {
    this.clearAll()
    this.init()
    console.log("🔄 Reset to defaults complete")
  }
}

export const storage = new Storage()
