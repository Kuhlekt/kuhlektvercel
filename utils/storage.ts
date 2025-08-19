import type { User, Category, Article, AuditLog } from "../types/knowledge-base"
import { initialUsers, userPasswords } from "../data/initial-users"
import { initialCategories, initialArticles } from "../data/initial-data"

const STORAGE_KEYS = {
  USERS: "kb_users",
  CATEGORIES: "kb_categories",
  ARTICLES: "kb_articles",
  AUDIT_LOG: "kb_audit_log",
  CURRENT_USER: "kb_current_user",
}

class Storage {
  private readonly USERS_KEY = STORAGE_KEYS.USERS
  private readonly CATEGORIES_KEY = STORAGE_KEYS.CATEGORIES
  private readonly ARTICLES_KEY = STORAGE_KEYS.ARTICLES
  private readonly AUDIT_LOG_KEY = STORAGE_KEYS.AUDIT_LOG
  private readonly CURRENT_USER_KEY = STORAGE_KEYS.CURRENT_USER

  constructor() {
    this.initializeData()
  }

  // Initialize data if not exists
  private initializeData() {
    if (typeof window === "undefined") return

    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(initialUsers))
    }
    if (!localStorage.getItem(this.CATEGORIES_KEY)) {
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(initialCategories))
    }
    if (!localStorage.getItem(this.ARTICLES_KEY)) {
      localStorage.setItem(this.ARTICLES_KEY, JSON.stringify(initialArticles))
    }
    if (!localStorage.getItem(this.AUDIT_LOG_KEY)) {
      localStorage.setItem(this.AUDIT_LOG_KEY, JSON.stringify([]))
    }
  }

  // Users
  getUsers(): User[] {
    this.initializeData()
    if (typeof window === "undefined") return initialUsers
    const users = localStorage.getItem(this.USERS_KEY)
    return users ? JSON.parse(users) : initialUsers
  }

  saveUsers(users: User[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
  }

  // Authentication
  authenticateUser(username: string, password: string): User | null {
    console.log("Authenticating user:", username)
    const users = this.getUsers()
    const user = users.find((u) => u.username === username)

    if (!user) {
      console.log("User not found:", username)
      return null
    }

    if (userPasswords[username] !== password) {
      console.log("Invalid password for user:", username)
      return null
    }

    // Update last login
    const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u))
    this.saveUsers(updatedUsers)

    // Add audit log entry
    this.addAuditEntry({
      userId: user.id,
      action: "LOGIN",
      details: `User ${username} logged in`,
    })

    console.log("User authenticated successfully:", user)
    return { ...user, lastLogin: new Date().toISOString() }
  }

  // Categories
  getCategories(): Category[] {
    this.initializeData()
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
    this.initializeData()
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
    this.initializeData()
    if (typeof window === "undefined") return []
    const log = localStorage.getItem(this.AUDIT_LOG_KEY)
    return log ? JSON.parse(log) : []
  }

  addAuditEntry(entry: Omit<AuditLog, "id" | "timestamp">): void {
    if (typeof window === "undefined") return
    const log = this.getAuditLog()
    const newEntry: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...entry,
    }
    log.unshift(newEntry) // Add to beginning
    localStorage.setItem(this.AUDIT_LOG_KEY, JSON.stringify(log))
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
      console.log("Set current user:", user)
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY)
      console.log("Cleared current user")
    }
  }

  // Clear all data (for testing)
  clearAll(): void {
    if (typeof window === "undefined") return
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  }
}

export const storage = new Storage()
