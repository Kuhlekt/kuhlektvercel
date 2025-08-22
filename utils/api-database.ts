import type { Category, User, Article, AuditLogEntry } from "../types/knowledge-base"

// File-based database simulation using localStorage with server sync
export class ApiDatabase {
  private static readonly STORAGE_KEYS = {
    CATEGORIES: "kb_categories",
    USERS: "kb_users",
    AUDIT_LOG: "kb_audit_log",
    PAGE_VISITS: "kb_page_visits",
  }

  private baseUrl = "/api/data"

  // Initialize with default data if empty
  async initialize(): Promise<void> {
    try {
      // Check if we need to initialize from server
      const response = await fetch("/api/data")
      if (response.ok) {
        const serverData = await response.json()

        // Store server data locally
        localStorage.setItem(this.STORAGE_KEYS.CATEGORIES, JSON.stringify(serverData.categories))
        localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(serverData.users))
        localStorage.setItem(this.STORAGE_KEYS.AUDIT_LOG, JSON.stringify(serverData.auditLog))
        localStorage.setItem(this.STORAGE_KEYS.PAGE_VISITS, serverData.pageVisits.toString())
      }
    } catch (error) {
      console.error("Failed to initialize from server:", error)
      // Continue with local data if server fails
    }
  }

  // Sync local changes to server
  private async syncToServer(data: any): Promise<void> {
    try {
      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error("Failed to sync to server:", error)
    }
  }

  async loadData(): Promise<{
    categories: Category[]
    users: User[]
    auditLog: AuditLogEntry[]
  }> {
    const response = await fetch(this.baseUrl)
    if (!response.ok) {
      throw new Error("Failed to load data")
    }
    return response.json()
  }

  async saveData(data: {
    categories: Category[]
    users: User[]
    auditLog: AuditLogEntry[]
  }): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to save data")
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.CATEGORIES)
    if (!stored) return []

    const categories = JSON.parse(stored)
    // Ensure dates are Date objects
    return categories.map((cat: any) => ({
      ...cat,
      articles: cat.articles.map((article: any) => ({
        ...article,
        createdAt: new Date(article.createdAt),
        updatedAt: new Date(article.updatedAt),
      })),
      subcategories: cat.subcategories.map((sub: any) => ({
        ...sub,
        articles: sub.articles.map((article: any) => ({
          ...article,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt),
        })),
      })),
    }))
  }

  async saveCategories(categories: Category[]): Promise<void> {
    localStorage.setItem(this.STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
    await this.syncToServer({ categories })
  }

  async addCategory(categories: Category[], name: string, description?: string): Promise<void> {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      description,
      articles: [],
      subcategories: [],
    }

    const updatedCategories = [...categories, newCategory]
    await this.saveCategories(updatedCategories)
  }

  async addSubcategory(categories: Category[], categoryId: string, name: string, description?: string): Promise<void> {
    const updatedCategories = categories.map((cat) => {
      if (cat.id === categoryId) {
        const newSubcategory = {
          id: Date.now().toString(),
          name,
          description,
          articles: [],
        }
        return {
          ...cat,
          subcategories: [...cat.subcategories, newSubcategory],
        }
      }
      return cat
    })

    await this.saveCategories(updatedCategories)
  }

  async deleteCategory(categories: Category[], categoryId: string): Promise<void> {
    const updatedCategories = categories.filter((cat) => cat.id !== categoryId)
    await this.saveCategories(updatedCategories)
  }

  async deleteSubcategory(categories: Category[], categoryId: string, subcategoryId: string): Promise<void> {
    const updatedCategories = categories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: cat.subcategories.filter((sub) => sub.id !== subcategoryId),
        }
      }
      return cat
    })

    await this.saveCategories(updatedCategories)
  }

  // Users
  async getUsers(): Promise<User[]> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.USERS)
    if (!stored) return []

    const users = JSON.parse(stored)
    return users.map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
    }))
  }

  async saveUsers(users: User[]): Promise<void> {
    localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users))
    await this.syncToServer({ users })
  }

  async addUser(users: User[], userData: Omit<User, "id" | "createdAt">): Promise<void> {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }

    const updatedUsers = [...users, newUser]
    await this.saveUsers(updatedUsers)
  }

  async updateUser(users: User[], userId: string, updates: Partial<User>): Promise<void> {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, ...updates } : user))
    await this.saveUsers(updatedUsers)
  }

  async deleteUser(users: User[], userId: string): Promise<void> {
    const updatedUsers = users.filter((user) => user.id !== userId)
    await this.saveUsers(updatedUsers)
  }

  // Articles
  async addArticle(
    categories: Category[],
    articleData: Omit<Article, "id" | "createdAt" | "updatedAt">,
  ): Promise<void> {
    const newArticle: Article = {
      ...articleData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      editCount: 0,
    }

    const updatedCategories = categories.map((category) => {
      if (category.id === articleData.categoryId) {
        if (articleData.subcategoryId) {
          // Add to subcategory
          return {
            ...category,
            subcategories: category.subcategories.map((sub) =>
              sub.id === articleData.subcategoryId ? { ...sub, articles: [...sub.articles, newArticle] } : sub,
            ),
          }
        } else {
          // Add to category
          return {
            ...category,
            articles: [...category.articles, newArticle],
          }
        }
      }
      return category
    })

    await this.saveCategories(updatedCategories)
  }

  async updateArticle(categories: Category[], articleId: string, updates: Partial<Article>): Promise<void> {
    const updatedCategories = categories.map((category) => ({
      ...category,
      articles: category.articles.map((article) =>
        article.id === articleId
          ? {
              ...article,
              ...updates,
              updatedAt: new Date(),
              editCount: (article.editCount || 0) + 1,
            }
          : article,
      ),
      subcategories: category.subcategories.map((sub) => ({
        ...sub,
        articles: sub.articles.map((article) =>
          article.id === articleId
            ? {
                ...article,
                ...updates,
                updatedAt: new Date(),
                editCount: (article.editCount || 0) + 1,
              }
            : article,
        ),
      })),
    }))

    await this.saveCategories(updatedCategories)
  }

  async deleteArticle(categories: Category[], articleId: string): Promise<void> {
    const updatedCategories = categories.map((category) => ({
      ...category,
      articles: category.articles.filter((article) => article.id !== articleId),
      subcategories: category.subcategories.map((sub) => ({
        ...sub,
        articles: sub.articles.filter((article) => article.id !== articleId),
      })),
    }))

    await this.saveCategories(updatedCategories)
  }

  // Audit Log
  async getAuditLog(): Promise<AuditLogEntry[]> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.AUDIT_LOG)
    if (!stored) return []

    const auditLog = JSON.parse(stored)
    return auditLog.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }))
  }

  async addAuditEntry(auditLog: AuditLogEntry[], entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<void> {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date(),
    }

    const updatedAuditLog = [newEntry, ...auditLog].slice(0, 1000) // Keep last 1000 entries
    localStorage.setItem(this.STORAGE_KEYS.AUDIT_LOG, JSON.stringify(updatedAuditLog))
    await this.syncToServer({ auditLog: updatedAuditLog })
  }

  // Page Visits
  async getPageVisits(): Promise<number> {
    try {
      const response = await fetch("/api/data/page-visits")
      if (response.ok) {
        const data = await response.json()
        return data.visits
      }
    } catch (error) {
      console.error("Failed to get page visits from server:", error)
    }

    const stored = localStorage.getItem(this.STORAGE_KEYS.PAGE_VISITS)
    return stored ? Number.parseInt(stored, 10) : 0
  }

  async incrementPageVisits(): Promise<number> {
    try {
      const response = await fetch("/api/data/page-visits", { method: "POST" })
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem(this.STORAGE_KEYS.PAGE_VISITS, data.visits.toString())
        return data.visits
      }
    } catch (error) {
      console.error("Failed to increment page visits on server:", error)
    }

    const current = await this.getPageVisits()
    const newCount = current + 1
    localStorage.setItem(this.STORAGE_KEYS.PAGE_VISITS, newCount.toString())
    return newCount
  }

  // Data Management
  async exportData(): Promise<void> {
    const categories = await this.getCategories()
    const users = await this.getUsers()
    const auditLog = await this.getAuditLog()
    const pageVisits = await this.getPageVisits()

    const exportData = {
      categories,
      users,
      auditLog,
      pageVisits,
      exportedAt: new Date().toISOString(),
      version: "2.0",
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `knowledge-base-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async importData(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)

          if (!data.categories || !data.users) {
            throw new Error("Invalid backup file format")
          }

          // Clear existing data
          await this.clearAllData()

          // Import new data
          localStorage.setItem(this.STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories))
          localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(data.users))
          localStorage.setItem(this.STORAGE_KEYS.AUDIT_LOG, JSON.stringify(data.auditLog || []))
          localStorage.setItem(this.STORAGE_KEYS.PAGE_VISITS, (data.pageVisits || 0).toString())

          // Sync to server
          await this.syncToServer(data)

          resolve()
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  async clearAllData(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEYS.CATEGORIES)
    localStorage.removeItem(this.STORAGE_KEYS.USERS)
    localStorage.removeItem(this.STORAGE_KEYS.AUDIT_LOG)
    localStorage.removeItem(this.STORAGE_KEYS.PAGE_VISITS)

    // Clear on server too
    await this.syncToServer({
      categories: [],
      users: [],
      auditLog: [],
      pageVisits: 0,
    })
  }
}

export const apiDatabase = new ApiDatabase()
