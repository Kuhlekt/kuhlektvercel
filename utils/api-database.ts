import type { Category, User, Article, AuditLogEntry } from "../types/knowledge-base"

// API-based database operations
export const apiDatabase = {
  // Load all data
  async loadData(): Promise<{
    categories: Category[]
    users: User[]
    auditLog: AuditLogEntry[]
    pageVisits: number
  }> {
    const response = await fetch("/api/data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to load data")
    }

    const data = await response.json()

    // Convert date strings back to Date objects
    const categories = data.categories.map((category: any) => ({
      ...category,
      articles: (category.articles || []).map((article: any) => ({
        ...article,
        createdAt: new Date(article.createdAt),
        updatedAt: new Date(article.updatedAt),
      })),
      subcategories: (category.subcategories || []).map((sub: any) => ({
        ...sub,
        articles: (sub.articles || []).map((article: any) => ({
          ...article,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt),
        })),
      })),
    }))

    const users = data.users.map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
    }))

    const auditLog = data.auditLog.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }))

    return {
      categories,
      users,
      auditLog,
      pageVisits: data.pageVisits || 0,
    }
  },

  // Save categories
  async saveCategories(categories: Category[]): Promise<void> {
    const response = await fetch("/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "categories",
        data: categories,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to save categories")
    }
  },

  // Save users
  async saveUsers(users: User[]): Promise<void> {
    const response = await fetch("/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "users",
        data: users,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to save users")
    }
  },

  // Save audit log
  async saveAuditLog(auditLog: AuditLogEntry[]): Promise<void> {
    const response = await fetch("/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "auditLog",
        data: auditLog,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to save audit log")
    }
  },

  // Increment page visits
  async incrementPageVisits(): Promise<number> {
    const response = await fetch("/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "incrementPageVisits",
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to increment page visits")
    }

    const result = await response.json()
    return result.pageVisits
  },

  // Helper methods for common operations
  async addArticle(categories: Category[], article: Omit<Article, "id" | "createdAt" | "updatedAt">): Promise<Article> {
    const newArticle: Article = {
      ...article,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedCategories = categories.map((category) => {
      if (category.id === article.categoryId) {
        if (article.subcategoryId) {
          // Add to subcategory
          return {
            ...category,
            subcategories: category.subcategories.map((subcategory) =>
              subcategory.id === article.subcategoryId
                ? { ...subcategory, articles: [...subcategory.articles, newArticle] }
                : subcategory,
            ),
          }
        } else {
          // Add to main category
          return {
            ...category,
            articles: [...category.articles, newArticle],
          }
        }
      }
      return category
    })

    await this.saveCategories(updatedCategories)
    return newArticle
  },

  async updateArticle(categories: Category[], articleId: string, updates: Partial<Article>): Promise<Category[]> {
    const updatedCategories = categories.map((category) => ({
      ...category,
      articles: category.articles.map((article) =>
        article.id === articleId ? { ...article, ...updates, updatedAt: new Date() } : article,
      ),
      subcategories: category.subcategories.map((subcategory) => ({
        ...subcategory,
        articles: subcategory.articles.map((article) =>
          article.id === articleId ? { ...article, ...updates, updatedAt: new Date() } : article,
        ),
      })),
    }))

    await this.saveCategories(updatedCategories)
    return updatedCategories
  },

  async deleteArticle(categories: Category[], articleId: string): Promise<Category[]> {
    const updatedCategories = categories.map((category) => ({
      ...category,
      articles: category.articles.filter((article) => article.id !== articleId),
      subcategories: category.subcategories.map((subcategory) => ({
        ...subcategory,
        articles: subcategory.articles.filter((article) => article.id !== articleId),
      })),
    }))

    await this.saveCategories(updatedCategories)
    return updatedCategories
  },

  async addCategory(categories: Category[], name: string, description?: string): Promise<Category[]> {
    const newCategory: Category = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      description,
      articles: [],
      subcategories: [],
    }

    const updatedCategories = [...categories, newCategory]
    await this.saveCategories(updatedCategories)
    return updatedCategories
  },

  async addSubcategory(
    categories: Category[],
    categoryId: string,
    name: string,
    description?: string,
  ): Promise<Category[]> {
    const newSubcategory = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      description,
      articles: [],
    }

    const updatedCategories = categories.map((category) =>
      category.id === categoryId
        ? { ...category, subcategories: [...category.subcategories, newSubcategory] }
        : category,
    )

    await this.saveCategories(updatedCategories)
    return updatedCategories
  },

  async deleteCategory(categories: Category[], categoryId: string): Promise<Category[]> {
    const updatedCategories = categories.filter((category) => category.id !== categoryId)
    await this.saveCategories(updatedCategories)
    return updatedCategories
  },

  async deleteSubcategory(categories: Category[], categoryId: string, subcategoryId: string): Promise<Category[]> {
    const updatedCategories = categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            subcategories: category.subcategories.filter((sub) => sub.id !== subcategoryId),
          }
        : category,
    )

    await this.saveCategories(updatedCategories)
    return updatedCategories
  },

  async addAuditEntry(
    auditLog: AuditLogEntry[],
    entry: Omit<AuditLogEntry, "id" | "timestamp">,
  ): Promise<AuditLogEntry[]> {
    const newEntry: AuditLogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      ...entry,
    }

    const updatedAuditLog = [newEntry, ...auditLog]
    await this.saveAuditLog(updatedAuditLog)
    return updatedAuditLog
  },

  async updateUserLastLogin(users: User[], userId: string): Promise<User[]> {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, lastLogin: new Date() } : user))

    await this.saveUsers(updatedUsers)
    return updatedUsers
  },

  // Export data
  async exportData(): Promise<void> {
    const data = await this.loadData()

    const exportData = {
      ...data,
      exportedAt: new Date().toISOString(),
      version: "2.0",
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `kuhlekt-kb-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },

  // Import data
  async importData(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)

          // Validate data structure
          if (!data.categories || !Array.isArray(data.categories)) {
            throw new Error("Invalid backup file: missing or invalid categories")
          }
          if (!data.users || !Array.isArray(data.users)) {
            throw new Error("Invalid backup file: missing or invalid users")
          }
          if (!data.auditLog || !Array.isArray(data.auditLog)) {
            throw new Error("Invalid backup file: missing or invalid audit log")
          }

          // Convert date strings back to Date objects
          const categories = data.categories.map((cat: any) => ({
            ...cat,
            articles: (cat.articles || []).map((article: any) => ({
              ...article,
              createdAt: new Date(article.createdAt),
              updatedAt: new Date(article.updatedAt),
            })),
            subcategories: (cat.subcategories || []).map((sub: any) => ({
              ...sub,
              articles: (sub.articles || []).map((article: any) => ({
                ...article,
                createdAt: new Date(article.createdAt),
                updatedAt: new Date(article.updatedAt),
              })),
            })),
          }))

          const users = data.users.map((user: any) => ({
            ...user,
            createdAt: new Date(user.createdAt),
            lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
          }))

          const auditLog = data.auditLog.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          }))

          // Save all data
          await Promise.all([this.saveCategories(categories), this.saveUsers(users), this.saveAuditLog(auditLog)])

          resolve()
        } catch (error) {
          console.error("Error parsing backup file:", error)
          reject(new Error(`Failed to parse backup file: ${error instanceof Error ? error.message : "Unknown error"}`))
        }
      }

      reader.onerror = () => {
        console.error("Error reading file")
        reject(new Error("Failed to read file"))
      }

      reader.readAsText(file)
    })
  },

  // Clear all data
  async clearAllData(): Promise<void> {
    await Promise.all([
      this.saveCategories([]),
      this.saveUsers([
        {
          id: "1",
          username: "admin",
          password: "admin123",
          email: "admin@kuhlekt.com",
          role: "admin",
          createdAt: new Date("2024-01-01"),
          lastLogin: undefined,
        },
        {
          id: "2",
          username: "editor",
          password: "editor123",
          email: "editor@kuhlekt.com",
          role: "editor",
          createdAt: new Date("2024-01-01"),
          lastLogin: undefined,
        },
        {
          id: "3",
          username: "viewer",
          password: "viewer123",
          email: "viewer@kuhlekt.com",
          role: "viewer",
          createdAt: new Date("2024-01-01"),
          lastLogin: undefined,
        },
      ]),
      this.saveAuditLog([]),
    ])
  },
}
