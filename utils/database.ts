import { storage } from "./storage"
import type { Category, User, AuditLogEntry, Article } from "@/types/knowledge-base"

// Helper function to ensure dates are properly handled
const ensureDate = (date: any): Date => {
  if (date instanceof Date) return date
  if (typeof date === "string") return new Date(date)
  return new Date()
}

// Mock database for local storage
class Database {
  private isClient = typeof window !== "undefined"

  // Initialize database with default data
  async initialize(): Promise<void> {
    if (!this.isClient) return

    console.log("🔧 Initializing database...")

    try {
      // Initialize storage with defaults
      storage.initializeDefaults()

      // Add initial audit log entry
      const auditLog = storage.getAuditLog()
      if (auditLog.length === 0) {
        await this.addAuditEntry({
          action: "System Initialized",
          performedBy: "System",
          details: "Knowledge base initialized with default data",
        })
      }

      console.log("✅ Database initialized successfully")
    } catch (error) {
      console.error("❌ Error initializing database:", error)
    }
  }

  // Load data from localStorage
  loadData() {
    if (!this.isClient)
      return {
        categories: [],
        users: [],
        auditLog: [],
        pageVisits: 0,
      }
    try {
      const categories = JSON.parse(localStorage.getItem("kb_categories") || "[]")
      const users = JSON.parse(localStorage.getItem("kb_users") || "[]")
      const auditLog = JSON.parse(localStorage.getItem("kb_auditLog") || "[]")
      const pageVisits = Number.parseInt(localStorage.getItem("kb_pageVisits") || "0", 10)

      // Convert date strings back to Date objects with proper error handling
      const processedCategories = categories.map((cat: any) => ({
        ...cat,
        articles:
          cat.articles?.map((article: any) => ({
            ...article,
            createdAt: ensureDate(article.createdAt),
            updatedAt: ensureDate(article.updatedAt),
          })) || [],
        subcategories:
          cat.subcategories?.map((sub: any) => ({
            ...sub,
            articles:
              sub.articles?.map((article: any) => ({
                ...article,
                createdAt: ensureDate(article.createdAt),
                updatedAt: ensureDate(article.updatedAt),
              })) || [],
          })) || [],
      }))

      const processedUsers = users.map((user: any) => ({
        ...user,
        createdAt: ensureDate(user.createdAt),
        lastLogin: user.lastLogin ? ensureDate(user.lastLogin) : undefined,
      }))

      const processedAuditLog = auditLog.map((entry: any) => ({
        ...entry,
        timestamp: ensureDate(entry.timestamp),
      }))

      return {
        categories: processedCategories,
        users: processedUsers,
        auditLog: processedAuditLog,
        pageVisits,
      }
    } catch (error) {
      console.error("Error loading data:", error)
      return {
        categories: [],
        users: [],
        auditLog: [],
        pageVisits: 0,
      }
    }
  }

  // Save data to localStorage
  saveData(data: {
    categories?: Category[]
    users?: User[]
    auditLog?: AuditLogEntry[]
    pageVisits?: number
  }) {
    if (!this.isClient) throw new Error("Not available on server")
    try {
      if (data.categories) {
        localStorage.setItem("kb_categories", JSON.stringify(data.categories))
      }
      if (data.users) {
        localStorage.setItem("kb_users", JSON.stringify(data.users))
      }
      if (data.auditLog) {
        localStorage.setItem("kb_auditLog", JSON.stringify(data.auditLog))
      }
      if (data.pageVisits !== undefined) {
        localStorage.setItem("kb_pageVisits", data.pageVisits.toString())
      }
    } catch (error) {
      console.error("Error saving data:", error)
      throw new Error("Failed to save data")
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    if (!this.isClient) return []
    return storage.getCategories()
  }

  async saveCategory(name: string, description: string): Promise<string> {
    if (!this.isClient) throw new Error("Not available on server")

    const categories = storage.getCategories()
    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      name,
      description,
      articles: [],
      subcategories: [],
      createdAt: new Date(),
    }

    categories.push(newCategory)
    storage.saveCategories(categories)

    await this.addAuditEntry({
      action: "Category Created",
      categoryId: newCategory.id,
      categoryName: name,
      performedBy: "System",
      details: `Created category: ${name}`,
    })

    return newCategory.id
  }

  async saveSubcategory(categoryId: string, name: string, description: string): Promise<string> {
    if (!this.isClient) throw new Error("Not available on server")

    const categories = storage.getCategories()
    const category = categories.find((c) => c.id === categoryId)

    if (!category) {
      throw new Error("Category not found")
    }

    const newSubcategory = {
      id: `sub_${Date.now()}`,
      name,
      description,
      articles: [],
      createdAt: new Date(),
    }

    category.subcategories.push(newSubcategory)
    category.updatedAt = new Date()
    storage.saveCategories(categories)

    await this.addAuditEntry({
      action: "Subcategory Created",
      categoryId,
      categoryName: category.name,
      subcategoryName: name,
      performedBy: "System",
      details: `Created subcategory: ${name} in ${category.name}`,
    })

    return newSubcategory.id
  }

  // Articles
  async saveArticle(articleData: {
    title: string
    content: string
    categoryId: string
    subcategoryId?: string
    tags: string[]
    createdBy: string
    lastEditedBy: string
    editCount: number
  }): Promise<string> {
    if (!this.isClient) throw new Error("Not available on server")

    const categories = storage.getCategories()
    const category = categories.find((c) => c.id === articleData.categoryId)

    if (!category) {
      throw new Error("Category not found")
    }

    const newArticle: Article = {
      id: `art_${Date.now()}`,
      title: articleData.title,
      content: articleData.content,
      categoryId: articleData.categoryId,
      subcategoryId: articleData.subcategoryId,
      tags: articleData.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: articleData.createdBy,
      lastEditedBy: articleData.lastEditedBy,
      editCount: articleData.editCount,
      isPublished: true,
      views: 0,
    }

    if (articleData.subcategoryId) {
      const subcategory = category.subcategories.find((s) => s.id === articleData.subcategoryId)
      if (!subcategory) {
        throw new Error("Subcategory not found")
      }
      subcategory.articles.push(newArticle)
    } else {
      category.articles.push(newArticle)
    }

    category.updatedAt = new Date()
    storage.saveCategories(categories)

    await this.addAuditEntry({
      action: "Article Created",
      articleId: newArticle.id,
      articleTitle: newArticle.title,
      categoryId: articleData.categoryId,
      categoryName: category.name,
      subcategoryName: articleData.subcategoryId
        ? category.subcategories.find((s) => s.id === articleData.subcategoryId)?.name
        : undefined,
      performedBy: articleData.createdBy,
      details: `Created article: ${newArticle.title}`,
    })

    return newArticle.id
  }

  async updateArticle(articleId: string, updates: Partial<Article>): Promise<void> {
    if (!this.isClient) throw new Error("Not available on server")

    const categories = storage.getCategories()
    let found = false

    for (const category of categories) {
      // Check category articles
      const articleIndex = category.articles.findIndex((a) => a.id === articleId)
      if (articleIndex !== -1) {
        category.articles[articleIndex] = {
          ...category.articles[articleIndex],
          ...updates,
          updatedAt: new Date(),
        }
        found = true
        break
      }

      // Check subcategory articles
      for (const subcategory of category.subcategories) {
        const subArticleIndex = subcategory.articles.findIndex((a) => a.id === articleId)
        if (subArticleIndex !== -1) {
          subcategory.articles[subArticleIndex] = {
            ...subcategory.articles[subArticleIndex],
            ...updates,
            updatedAt: new Date(),
          }
          found = true
          break
        }
      }
      if (found) break
    }

    if (!found) {
      throw new Error("Article not found")
    }

    storage.saveCategories(categories)

    await this.addAuditEntry({
      action: "Article Updated",
      articleId,
      articleTitle: updates.title || "Unknown",
      performedBy: updates.lastEditedBy || "System",
      details: `Updated article: ${updates.title || articleId}`,
    })
  }

  async deleteArticle(articleId: string): Promise<void> {
    if (!this.isClient) throw new Error("Not available on server")

    const categories = storage.getCategories()
    let found = false
    let articleTitle = ""

    for (const category of categories) {
      // Check category articles
      const articleIndex = category.articles.findIndex((a) => a.id === articleId)
      if (articleIndex !== -1) {
        articleTitle = category.articles[articleIndex].title
        category.articles.splice(articleIndex, 1)
        found = true
        break
      }

      // Check subcategory articles
      for (const subcategory of category.subcategories) {
        const subArticleIndex = subcategory.articles.findIndex((a) => a.id === articleId)
        if (subArticleIndex !== -1) {
          articleTitle = subcategory.articles[subArticleIndex].title
          subcategory.articles.splice(subArticleIndex, 1)
          found = true
          break
        }
      }
      if (found) break
    }

    if (!found) {
      throw new Error("Article not found")
    }

    storage.saveCategories(categories)

    await this.addAuditEntry({
      action: "Article Deleted",
      articleId,
      articleTitle,
      performedBy: "System",
      details: `Deleted article: ${articleTitle}`,
    })
  }

  // Users
  async getUsers(): Promise<User[]> {
    if (!this.isClient) return []
    return storage.getUsers()
  }

  async saveUser(userData: {
    username: string
    password: string
    email: string
    role: "admin" | "editor" | "viewer"
    lastLogin: Date | null
  }): Promise<string> {
    if (!this.isClient) throw new Error("Not available on server")

    const users = storage.getUsers()

    // Check if username already exists
    if (users.some((u) => u.username === userData.username)) {
      throw new Error("Username already exists")
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      username: userData.username,
      password: userData.password,
      email: userData.email,
      role: userData.role,
      isActive: true,
      createdAt: new Date(),
      lastLogin: userData.lastLogin,
    }

    users.push(newUser)
    storage.saveUsers(users)

    await this.addAuditEntry({
      action: "User Created",
      userId: newUser.id,
      username: newUser.username,
      performedBy: "System",
      details: `Created user: ${newUser.username} with role: ${newUser.role}`,
    })

    return newUser.id
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    if (!this.isClient) throw new Error("Not available on server")

    const users = storage.getUsers()
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    users[userIndex] = { ...users[userIndex], ...updates }
    storage.saveUsers(users)

    await this.addAuditEntry({
      action: "User Updated",
      userId,
      username: users[userIndex].username,
      performedBy: "System",
      details: `Updated user: ${users[userIndex].username}`,
    })
  }

  async deleteUser(userId: string): Promise<void> {
    if (!this.isClient) throw new Error("Not available on server")

    const users = storage.getUsers()
    const user = users.find((u) => u.id === userId)

    if (!user) {
      throw new Error("User not found")
    }

    const filteredUsers = users.filter((u) => u.id !== userId)
    storage.saveUsers(filteredUsers)

    await this.addAuditEntry({
      action: "User Deleted",
      userId,
      username: user.username,
      performedBy: "System",
      details: `Deleted user: ${user.username}`,
    })
  }

  // Audit Log
  async getAuditLog(): Promise<AuditLogEntry[]> {
    if (!this.isClient) return []
    return storage.getAuditLog()
  }

  async addAuditEntry(entry: {
    action: string
    articleId?: string
    articleTitle?: string
    categoryId?: string
    categoryName?: string
    subcategoryName?: string
    userId?: string
    username?: string
    performedBy: string
    details: string
  }): Promise<void> {
    if (!this.isClient) return

    const auditLog = storage.getAuditLog()

    const newEntry: AuditLogEntry = {
      id: `audit_${Date.now()}`,
      timestamp: new Date(),
      ...entry,
    }

    auditLog.unshift(newEntry) // Add to beginning

    // Keep only last 1000 entries
    if (auditLog.length > 1000) {
      auditLog.splice(1000)
    }

    storage.saveAuditLog(auditLog)
  }

  // Authentication
  async authenticateUser(username: string, password: string): Promise<User | null> {
    if (!this.isClient) return null

    const users = storage.getUsers()
    const user = users.find((u) => u.username === username && u.password === password && u.isActive)

    if (user) {
      // Update last login
      await this.updateUser(user.id, { lastLogin: new Date() })

      // Set current user
      storage.setCurrentUser(user)

      await this.addAuditEntry({
        action: "User Login",
        userId: user.id,
        username: user.username,
        performedBy: user.username,
        details: `User ${user.username} logged in`,
      })
    }

    return user
  }

  async logoutUser(): Promise<void> {
    if (!this.isClient) return

    const currentUser = storage.getCurrentUser()
    if (currentUser) {
      await this.addAuditEntry({
        action: "User Logout",
        userId: currentUser.id,
        username: currentUser.username,
        performedBy: currentUser.username,
        details: `User ${currentUser.username} logged out`,
      })
    }

    storage.setCurrentUser(null)
  }

  getCurrentUser(): User | null {
    if (!this.isClient) return null
    return storage.getCurrentUser()
  }

  // Data Management
  async exportData(): Promise<any> {
    if (!this.isClient) return {}

    const [categories, users, auditLog] = await Promise.all([this.getCategories(), this.getUsers(), this.getAuditLog()])

    const pageVisits = storage.getPageVisits()

    return {
      categories,
      users,
      auditLog,
      settings: {
        pageVisits,
        exportedAt: new Date().toISOString(),
        version: "1.0",
      },
    }
  }

  async importData(data: any): Promise<void> {
    if (!this.isClient) throw new Error("Not available on server")

    // Process categories with proper article structure
    if (data.categories) {
      const processedCategories = data.categories.map((cat: any) => ({
        ...cat,
        articles: (cat.articles || []).map((article: any) => ({
          ...article,
          id: article.id || `art_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: ensureDate(article.createdAt),
          updatedAt: ensureDate(article.updatedAt),
          // Ensure required fields
          title: article.title || "Untitled",
          content: article.content || "",
          tags: Array.isArray(article.tags) ? article.tags : [],
          createdBy: article.createdBy || "imported",
          lastEditedBy: article.lastEditedBy || article.createdBy || "imported",
          editCount: article.editCount || 0,
        })),
        subcategories: (cat.subcategories || []).map((sub: any) => ({
          ...sub,
          articles: (sub.articles || []).map((article: any) => ({
            ...article,
            id: article.id || `art_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: ensureDate(article.createdAt),
            updatedAt: ensureDate(article.updatedAt),
            // Ensure required fields
            title: article.title || "Untitled",
            content: article.content || "",
            tags: Array.isArray(article.tags) ? article.tags : [],
            createdBy: article.createdBy || "imported",
            lastEditedBy: article.lastEditedBy || article.createdBy || "imported",
            editCount: article.editCount || 0,
          })),
        })),
      }))

      storage.saveCategories(processedCategories)
    }

    // Process users with proper structure
    if (data.users) {
      const processedUsers = data.users.map((user: any) => ({
        ...user,
        id: user.id || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: ensureDate(user.createdAt),
        lastLogin: user.lastLogin ? ensureDate(user.lastLogin) : null,
        // Ensure required fields
        username: user.username || "unknown",
        password: user.password || "temp123",
        email: user.email || "unknown@example.com",
        role: user.role || "viewer",
        isActive: user.isActive !== false,
      }))

      storage.saveUsers(processedUsers)
    }

    // Process audit log with proper structure
    if (data.auditLog) {
      const processedAuditLog = data.auditLog.map((entry: any) => ({
        ...entry,
        id: entry.id || `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: ensureDate(entry.timestamp),
        // Ensure required fields
        action: entry.action || "unknown_action",
        performedBy: entry.performedBy || "system",
      }))

      storage.saveAuditLog(processedAuditLog)
    }

    if (data.settings?.pageVisits) {
      if (typeof window !== "undefined") {
        localStorage.setItem("kb_pageVisits", data.settings.pageVisits.toString())
      }
    } else if (data.pageVisits) {
      // Handle direct pageVisits field
      if (typeof window !== "undefined") {
        localStorage.setItem("kb_pageVisits", data.pageVisits.toString())
      }
    }

    await this.addAuditEntry({
      action: "Data Imported",
      performedBy: "System",
      details: `Imported ${data.categories?.length || 0} categories, ${data.users?.length || 0} users, ${data.auditLog?.length || 0} audit entries`,
    })
  }

  async clearAllData(): Promise<void> {
    if (!this.isClient) throw new Error("Not available on server")

    storage.clearAll()

    // Reinitialize with defaults
    await this.initialize()

    // Keep a record of the clear action
    await this.addAuditEntry({
      action: "All Data Cleared",
      performedBy: "System",
      details: "All data was cleared from the system",
    })
  }
}

export const database = new Database()
