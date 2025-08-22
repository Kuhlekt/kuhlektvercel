// API Database utility for handling server communication
import type { KnowledgeBaseData, Category, Article, User, AuditLogEntry } from "@/types/knowledge-base"

class ApiDatabase {
  private baseUrl = "/api/data"

  // Helper method to make API calls
  private async apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API call error for ${endpoint}:`, error)
      throw error
    }
  }

  // Load all data from server
  async loadData(): Promise<KnowledgeBaseData> {
    console.log("🔍 Loading data from API...")
    const data = await this.apiCall("")
    console.log("✅ Data loaded from API:", {
      categories: data.categories?.length || 0,
      users: data.users?.length || 0,
      auditLog: data.auditLog?.length || 0,
    })
    return data
  }

  // Save all data to server
  async saveData(data: Partial<KnowledgeBaseData>): Promise<void> {
    console.log("💾 Saving data to API...")
    await this.apiCall("", {
      method: "POST",
      body: JSON.stringify(data),
    })
    console.log("✅ Data saved to API")
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const data = await this.loadData()
    return data.categories || []
  }

  async saveCategories(categories: Category[]): Promise<void> {
    await this.saveData({ categories })
  }

  // Users
  async getUsers(): Promise<User[]> {
    const data = await this.loadData()
    return data.users || []
  }

  async saveUsers(users: User[]): Promise<void> {
    await this.saveData({ users })
  }

  // Audit Log
  async getAuditLog(): Promise<AuditLogEntry[]> {
    const data = await this.loadData()
    return data.auditLog || []
  }

  async saveAuditLog(auditLog: AuditLogEntry[]): Promise<void> {
    await this.saveData({ auditLog })
  }

  // Increment page visits
  async incrementPageVisits(): Promise<number> {
    try {
      const response = await fetch("/api/data/page-visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to increment page visits")
      }

      const data = await response.json()
      return data.pageVisits || 0
    } catch (error) {
      console.error("Error incrementing page visits:", error)
      return 0
    }
  }

  // Authentication
  async authenticateUser(username: string, password: string): Promise<User | null> {
    const users = await this.getUsers()
    const user = users.find((u) => u.username === username && u.password === password && u.isActive)

    if (user) {
      // Update last login
      const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, lastLogin: new Date() } : u))
      await this.saveUsers(updatedUsers)

      // Add audit log entry
      const auditLog = await this.getAuditLog()
      const newEntry: AuditLogEntry = {
        id: `audit_${Date.now()}`,
        action: "User Login",
        userId: user.id,
        username: user.username,
        performedBy: user.username,
        timestamp: new Date(),
        details: `User ${user.username} logged in`,
      }
      auditLog.unshift(newEntry)
      await this.saveAuditLog(auditLog)
    }

    return user
  }

  // Data management
  async exportData(): Promise<any> {
    return await this.loadData()
  }

  async importData(data: any): Promise<void> {
    await this.saveData(data)
  }

  async clearAllData(): Promise<void> {
    await this.saveData({
      categories: [],
      users: [],
      auditLog: [],
      pageVisits: 0,
    })
  }

  // Add article
  async addArticle(
    categories: Category[],
    articleData: Omit<Article, "id" | "createdAt" | "updatedAt">,
  ): Promise<Article> {
    const newArticle: Article = {
      ...articleData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedCategories = categories.map((category) => {
      if (category.id === articleData.categoryId) {
        if (articleData.subcategoryId) {
          // Add to subcategory
          const updatedSubcategories = category.subcategories?.map((sub) => {
            if (sub.id === articleData.subcategoryId) {
              return {
                ...sub,
                articles: [...(sub.articles || []), newArticle],
              }
            }
            return sub
          })
          return {
            ...category,
            subcategories: updatedSubcategories,
          }
        } else {
          // Add to main category
          return {
            ...category,
            articles: [...(category.articles || []), newArticle],
          }
        }
      }
      return category
    })

    await this.saveData({ categories: updatedCategories })
    return newArticle
  }

  // Update article
  async updateArticle(
    categories: Category[],
    articleId: string,
    updatedArticle: Omit<Article, "createdAt">,
  ): Promise<Category[]> {
    const updatedCategories = categories.map((category) => {
      // Check main category articles
      if (category.articles) {
        const articleIndex = category.articles.findIndex((article) => article.id === articleId)
        if (articleIndex !== -1) {
          const updatedArticles = [...category.articles]
          updatedArticles[articleIndex] = {
            ...updatedArticle,
            createdAt: updatedArticles[articleIndex].createdAt,
            updatedAt: new Date(),
          }
          return {
            ...category,
            articles: updatedArticles,
          }
        }
      }

      // Check subcategory articles
      if (category.subcategories) {
        const updatedSubcategories = category.subcategories.map((subcategory) => {
          if (subcategory.articles) {
            const articleIndex = subcategory.articles.findIndex((article) => article.id === articleId)
            if (articleIndex !== -1) {
              const updatedArticles = [...subcategory.articles]
              updatedArticles[articleIndex] = {
                ...updatedArticle,
                createdAt: updatedArticles[articleIndex].createdAt,
                updatedAt: new Date(),
              }
              return {
                ...subcategory,
                articles: updatedArticles,
              }
            }
          }
          return subcategory
        })

        return {
          ...category,
          subcategories: updatedSubcategories,
        }
      }

      return category
    })

    await this.saveData({ categories: updatedCategories })
    return updatedCategories
  }

  // Delete article
  async deleteArticle(categories: Category[], articleId: string): Promise<Category[]> {
    const updatedCategories = categories.map((category) => {
      // Check main category articles
      if (category.articles) {
        const filteredArticles = category.articles.filter((article) => article.id !== articleId)
        if (filteredArticles.length !== category.articles.length) {
          return {
            ...category,
            articles: filteredArticles,
          }
        }
      }

      // Check subcategory articles
      if (category.subcategories) {
        const updatedSubcategories = category.subcategories.map((subcategory) => {
          if (subcategory.articles) {
            const filteredArticles = subcategory.articles.filter((article) => article.id !== articleId)
            return {
              ...subcategory,
              articles: filteredArticles,
            }
          }
          return subcategory
        })

        return {
          ...category,
          subcategories: updatedSubcategories,
        }
      }

      return category
    })

    await this.saveData({ categories: updatedCategories })
    return updatedCategories
  }

  // Update user last login
  async updateUserLastLogin(users: User[], userId: string): Promise<User[]> {
    const updatedUsers = users.map((user) =>
      user.id === userId
        ? {
            ...user,
            lastLogin: new Date(),
          }
        : user,
    )

    await this.saveData({ users: updatedUsers })
    return updatedUsers
  }

  // Add audit entry
  async addAuditEntry(
    auditLog: AuditLogEntry[],
    entry: Omit<AuditLogEntry, "id" | "timestamp">,
  ): Promise<AuditLogEntry[]> {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    }

    const updatedAuditLog = [newEntry, ...auditLog]

    await this.saveData({ auditLog: updatedAuditLog })
    return updatedAuditLog
  }
}

export const apiDatabase = new ApiDatabase()
