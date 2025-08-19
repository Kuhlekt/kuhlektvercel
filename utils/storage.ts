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

    if (!localStorage.getItem(this.USERS_KEY)) {
      console.log("👥 No users found, initializing with default users")
      localStorage.setItem(this.USERS_KEY, JSON.stringify(initialUsers))
    }

    if (!localStorage.getItem(this.CATEGORIES_KEY)) {
      console.log("📁 No categories found, initializing with default categories")
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(initialCategories))
    }

    if (!localStorage.getItem(this.ARTICLES_KEY)) {
      console.log("📄 No articles found, initializing with default articles")
      localStorage.setItem(this.ARTICLES_KEY, JSON.stringify(initialArticles))
    }

    if (!localStorage.getItem(this.AUDIT_LOG_KEY)) {
      console.log("📋 No audit log found, initializing empty audit log")
      localStorage.setItem(this.AUDIT_LOG_KEY, JSON.stringify([]))
    }

    console.log("✅ Storage initialization complete")
  }

  getUsers(): User[] {
    if (typeof window === "undefined") return initialUsers
    const users = localStorage.getItem(this.USERS_KEY)
    return users ? JSON.parse(users) : initialUsers
  }

  saveUsers(users: User[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
  }

  authenticateUser(username: string, password: string): User | null {
    console.log("🔐 Authenticating user:", username)
    const users = this.getUsers()
    console.log(
      "👥 Available users:",
      users.map((u) => ({ username: u.username, role: u.role })),
    )

    const user = users.find((u) => u.username === username && u.password === password)

    if (user) {
      console.log("✅ Authentication successful for:", user.username)
      const updatedUser = { ...user, lastLogin: new Date() }
      const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
      this.saveUsers(updatedUsers)
      this.addAuditEntry({
        userId: user.id,
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
    const parsedUser = user ? JSON.parse(user) : null
    console.log("👤 Current user from storage:", parsedUser)
    return parsedUser
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
    return categories ? JSON.parse(categories) : initialCategories
  }

  saveCategories(categories: Category[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories))
  }

  getArticles(): Article[] {
    if (typeof window === "undefined") return initialArticles
    const articles = localStorage.getItem(this.ARTICLES_KEY)
    const parsedArticles = articles ? JSON.parse(articles) : initialArticles

    return parsedArticles.map((article: any) => ({
      ...article,
      createdAt: new Date(article.createdAt),
      updatedAt: new Date(article.updatedAt),
    }))
  }

  saveArticles(articles: Article[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(this.ARTICLES_KEY, JSON.stringify(articles))
  }

  getAuditLog(): AuditLog[] {
    if (typeof window === "undefined") return []
    const log = localStorage.getItem(this.AUDIT_LOG_KEY)
    return log ? JSON.parse(log) : []
  }

  addAuditEntry(entry: Omit<AuditLog, "id" | "timestamp">) {
    if (typeof window === "undefined") return
    const log = this.getAuditLog()
    const newEntry: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...entry,
    }
    log.unshift(newEntry)
    localStorage.setItem(this.AUDIT_LOG_KEY, JSON.stringify(log))
  }

  clearAll() {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.USERS_KEY)
    localStorage.removeItem(this.CATEGORIES_KEY)
    localStorage.removeItem(this.ARTICLES_KEY)
    localStorage.removeItem(this.CURRENT_USER_KEY)
    localStorage.removeItem(this.AUDIT_LOG_KEY)
  }
}

export const storage = new Storage()
