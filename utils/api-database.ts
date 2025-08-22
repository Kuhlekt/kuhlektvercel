// API Database utility for handling server communication
import type { Category, User, AuditLogEntry, Article } from "@/types/knowledge-base"

interface DatabaseData {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  pageVisits: number
}

class ApiDatabase {
  private baseUrl = "/api"

  // Load all data from server
  async loadData(): Promise<DatabaseData> {
    try {
      const response = await fetch(`${this.baseUrl}/data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("API loadData response:", data)

      return {
        categories: data.categories || [],
        users: data.users || [],
        auditLog: data.auditLog || [],
        pageVisits: data.pageVisits || 0,
      }
    } catch (error) {
      console.error("Error loading data from API:", error)
      throw new Error("Failed to load data from server")
    }
  }

  // Save all data to server
  async saveData(data: Partial<DatabaseData>): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log("Data saved successfully to API")
    } catch (error) {
      console.error("Error saving data to API:", error)
      throw new Error("Failed to save data to server")
    }
  }

  // Increment page visits
  async incrementPageVisits(): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/data/page-visits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.pageVisits || 0
    } catch (error) {
      console.error("Error incrementing page visits:", error)
      return 0
    }
  }

  // Add article
  async addArticle(
    categories: Category[],
    articleData: Omit<Article, "id" | "createdAt" | "updatedAt">,
  ): Promise<Article> {
    const newArticle: Article = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...articleData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Find the target category
    const updatedCategories = [...categories]
    const targetCategory = updatedCategories.find((cat) => cat.id === articleData.categoryId)

    if (!targetCategory) {
      throw new Error("Category not found")
    }

    // Add to category or subcategory
    if (articleData.subcategoryId) {
      const subcategory = targetCategory.subcategories?.find((sub) => sub.id === articleData.subcategoryId)
      if (!subcategory) {
        throw new Error("Subcategory not found")
      }
      if (!subcategory.articles) {
        subcategory.articles = []
      }
      subcategory.articles.push(newArticle)
    } else {
      if (!targetCategory.articles) {
        targetCategory.articles = []
      }
      targetCategory.articles.push(newArticle)
    }

    // Save to server
    await this.saveData({ categories: updatedCategories })

    return newArticle
  }

  // Update article
  async updateArticle(
    categories: Category[],
    articleId: string,
    updatedArticle: Omit<Article, "createdAt">,
  ): Promise<Category[]> {
    const updatedCategories = [...categories]
    let found = false

    // Find and update the article
    for (const category of updatedCategories) {
      // Check category articles
      if (category.articles) {
        const articleIndex = category.articles.findIndex((article) => article.id === articleId)
        if (articleIndex !== -1) {
          category.articles[articleIndex] = {
            ...updatedArticle,
            createdAt: category.articles[articleIndex].createdAt,
            updatedAt: new Date(),
          }
          found = true
          break
        }
      }

      // Check subcategory articles
      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          if (subcategory.articles) {
            const articleIndex = subcategory.articles.findIndex((article) => article.id === articleId)
            if (articleIndex !== -1) {
              subcategory.articles[articleIndex] = {
                ...updatedArticle,
                createdAt: subcategory.articles[articleIndex].createdAt,
                updatedAt: new Date(),
              }
              found = true
              break
            }
          }
        }
        if (found) break
      }
    }

    if (!found) {
      throw new Error("Article not found")
    }

    // Save to server
    await this.saveData({ categories: updatedCategories })

    return updatedCategories
  }

  // Delete article
  async deleteArticle(categories: Category[], articleId: string): Promise<Category[]> {
    const updatedCategories = [...categories]
    let found = false

    // Find and delete the article
    for (const category of updatedCategories) {
      // Check category articles
      if (category.articles) {
        const articleIndex = category.articles.findIndex((article) => article.id === articleId)
        if (articleIndex !== -1) {
          category.articles.splice(articleIndex, 1)
          found = true
          break
        }
      }

      // Check subcategory articles
      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          if (subcategory.articles) {
            const articleIndex = subcategory.articles.findIndex((article) => article.id === articleId)
            if (articleIndex !== -1) {
              subcategory.articles.splice(articleIndex, 1)
              found = true
              break
            }
          }
        }
        if (found) break
      }
    }

    if (!found) {
      throw new Error("Article not found")
    }

    // Save to server
    await this.saveData({ categories: updatedCategories })

    return updatedCategories
  }

  // Update user last login
  async updateUserLastLogin(users: User[], userId: string): Promise<User[]> {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, lastLogin: new Date() } : user))

    // Save to server
    await this.saveData({ users: updatedUsers })

    return updatedUsers
  }

  // Add audit entry
  async addAuditEntry(
    auditLog: AuditLogEntry[],
    entry: {
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
    },
  ): Promise<AuditLogEntry[]> {
    const newEntry: AuditLogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      ...entry,
    }

    const updatedAuditLog = [newEntry, ...auditLog]

    // Keep only last 1000 entries
    if (updatedAuditLog.length > 1000) {
      updatedAuditLog.splice(1000)
    }

    // Save to server
    await this.saveData({ auditLog: updatedAuditLog })

    return updatedAuditLog
  }

  // Import data
  async importData(importData: any): Promise<void> {
    try {
      console.log("Importing data to API:", importData)

      // Process and validate the data
      const processedData = {
        categories: importData.categories || [],
        users: importData.users || [],
        auditLog: importData.auditLog || [],
        pageVisits: importData.settings?.pageVisits || importData.pageVisits || 0,
      }

      // Ensure proper date handling
      processedData.categories = processedData.categories.map((cat: any) => ({
        ...cat,
        createdAt: new Date(cat.createdAt || Date.now()),
        updatedAt: new Date(cat.updatedAt || Date.now()),
        articles: (cat.articles || []).map((article: any) => ({
          ...article,
          createdAt: new Date(article.createdAt || Date.now()),
          updatedAt: new Date(article.updatedAt || Date.now()),
        })),
        subcategories: (cat.subcategories || []).map((sub: any) => ({
          ...sub,
          createdAt: new Date(sub.createdAt || Date.now()),
          updatedAt: new Date(sub.updatedAt || Date.now()),
          articles: (sub.articles || []).map((article: any) => ({
            ...article,
            createdAt: new Date(article.createdAt || Date.now()),
            updatedAt: new Date(article.updatedAt || Date.now()),
          })),
        })),
      }))

      processedData.users = processedData.users.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt || Date.now()),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
      }))

      processedData.auditLog = processedData.auditLog.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp || Date.now()),
      }))

      // Save all data to server
      await this.saveData(processedData)

      console.log("Data imported successfully to API")
    } catch (error) {
      console.error("Error importing data to API:", error)
      throw new Error("Failed to import data to server")
    }
  }

  // Export data
  async exportData(): Promise<any> {
    try {
      const data = await this.loadData()

      return {
        categories: data.categories,
        users: data.users,
        auditLog: data.auditLog,
        settings: {
          pageVisits: data.pageVisits,
          exportedAt: new Date().toISOString(),
          version: "1.0",
        },
      }
    } catch (error) {
      console.error("Error exporting data from API:", error)
      throw new Error("Failed to export data from server")
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      await this.saveData({
        categories: [],
        users: [],
        auditLog: [],
        pageVisits: 0,
      })

      console.log("All data cleared successfully from API")
    } catch (error) {
      console.error("Error clearing data from API:", error)
      throw new Error("Failed to clear data from server")
    }
  }
}

export const apiDatabase = new ApiDatabase()
