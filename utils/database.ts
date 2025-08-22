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
  private getStorageKey(key: string): string {
    return `kb_${key}`
  }

  // Load data from localStorage
  loadData() {
    try {
      const categories = JSON.parse(localStorage.getItem(this.getStorageKey("categories")) || "[]")
      const users = JSON.parse(localStorage.getItem(this.getStorageKey("users")) || "[]")
      const auditLog = JSON.parse(localStorage.getItem(this.getStorageKey("auditLog")) || "[]")
      const pageVisits = Number.parseInt(localStorage.getItem(this.getStorageKey("pageVisits")) || "0", 10)

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
    try {
      if (data.categories) {
        localStorage.setItem(this.getStorageKey("categories"), JSON.stringify(data.categories))
      }
      if (data.users) {
        localStorage.setItem(this.getStorageKey("users"), JSON.stringify(data.users))
      }
      if (data.auditLog) {
        localStorage.setItem(this.getStorageKey("auditLog"), JSON.stringify(data.auditLog))
      }
      if (data.pageVisits !== undefined) {
        localStorage.setItem(this.getStorageKey("pageVisits"), data.pageVisits.toString())
      }
    } catch (error) {
      console.error("Error saving data:", error)
      throw new Error("Failed to save data")
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return storage.getCategories()
  }

  async saveCategory(name: string, description: string): Promise<string> {
    const categories = await this.getCategories()
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      description,
      articles: [],
      subcategories: [],
      createdAt: new Date(),
      updatedAt: new Date(),
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
    const categories = await this.getCategories()
    const category = categories.find((c) => c.id === categoryId)

    if (!category) {
      throw new Error("Category not found")
    }

    const newSubcategory = {
      id: Date.now().toString(),
      name,
      description,
      articles: [],
      createdAt: new Date(),
      updatedAt: new Date(),
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
    const categories = await this.getCategories()
    const category = categories.find((c) => c.id === articleData.categoryId)

    if (!category) {
      throw new Error("Category not found")
    }

    const newArticle: Article = {
      id: Date.now().toString(),
      title: articleData.title,
      content: articleData.content,
      tags: articleData.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: articleData.createdBy,
      lastEditedBy: articleData.lastEditedBy,
      editCount: articleData.editCount,
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

  // Users
  async getUsers(): Promise<User[]> {
    return storage.getUsers()
  }

  async saveUser(userData: {
    username: string
    password: string
    email: string
    role: "admin" | "user"
    lastLogin: Date | null
  }): Promise<string> {
    const users = await this.getUsers()

    // Check if username already exists
    if (users.some((u) => u.username === userData.username)) {
      throw new Error("Username already exists")
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      password: userData.password,
      email: userData.email,
      role: userData.role,
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
    const users = await this.getUsers()
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
    const users = await this.getUsers()
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
    const auditLog = await this.getAuditLog()

    const newEntry: AuditLogEntry = {
      id: Date.now().toString(),
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

  // Data Management
  async exportData(): Promise<any> {
    const [categories, users, auditLog] = await Promise.all([this.getCategories(), this.getUsers(), this.getAuditLog()])

    const pageVisits = Number.parseInt(localStorage.getItem("kb_page_visits") || "0", 10)

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
    // Process categories with proper article structure
    if (data.categories) {
      const processedCategories = data.categories.map((cat: any) => ({
        ...cat,
        articles: (cat.articles || []).map((article: any) => ({
          ...article,
          id: article.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
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
            id: article.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
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
        id: user.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: ensureDate(user.createdAt),
        lastLogin: user.lastLogin ? ensureDate(user.lastLogin) : undefined,
        // Ensure required fields
        username: user.username || "unknown",
        password: user.password || "temp123",
        email: user.email || "unknown@example.com",
        role: user.role || "viewer",
      }))

      storage.saveUsers(processedUsers)
    }

    // Process audit log with proper structure
    if (data.auditLog) {
      const processedAuditLog = data.auditLog.map((entry: any) => ({
        ...entry,
        id: entry.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: ensureDate(entry.timestamp),
        // Ensure required fields
        action: entry.action || "unknown_action",
        performedBy: entry.performedBy || "system",
      }))

      storage.saveAuditLog(processedAuditLog)
    }

    if (data.settings?.pageVisits) {
      localStorage.setItem("kb_page_visits", data.settings.pageVisits.toString())
    } else if (data.pageVisits) {
      // Handle direct pageVisits field
      localStorage.setItem("kb_page_visits", data.pageVisits.toString())
    }

    await this.addAuditEntry({
      action: "Data Imported",
      performedBy: "System",
      details: `Imported ${data.categories?.length || 0} categories, ${data.users?.length || 0} users, ${data.auditLog?.length || 0} audit entries`,
    })
  }

  async clearAllData(): Promise<void> {
    storage.clearAll()

    // Keep a record of the clear action
    await this.addAuditEntry({
      action: "All Data Cleared",
      performedBy: "System",
      details: "All data was cleared from the system",
    })
  }
}

export const database = new Database()
