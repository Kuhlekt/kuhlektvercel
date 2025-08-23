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
      console.log("🔍 ApiDatabase.loadData() - Fetching data from server...")

      const response = await fetch(`${this.baseUrl}/data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      console.log("✅ ApiDatabase.loadData() - Data received:", {
        categories: data.categories?.length || 0,
        users: data.users?.length || 0,
        usernames: data.users?.map((u: any) => u.username) || [],
        auditLog: data.auditLog?.length || 0,
        pageVisits: data.pageVisits || 0,
      })

      return {
        categories: data.categories || [],
        users: data.users || [],
        auditLog: data.auditLog || [],
        pageVisits: data.pageVisits || 0,
      }
    } catch (error) {
      console.error("❌ ApiDatabase.loadData() - Error loading data:", error)
      throw new Error(`Failed to load data from server: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Save all data to server with better error handling
  async saveData(data: Partial<DatabaseData>): Promise<void> {
    try {
      console.log("💾 ApiDatabase.saveData() - Saving data to server...")

      // Validate data before sending
      if (!data || typeof data !== "object") {
        throw new Error("Invalid data structure provided")
      }

      const response = await fetch(`${this.baseUrl}/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorData.details || "Unknown error"}`)
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || "Save operation failed")
      }

      console.log("✅ ApiDatabase.saveData() - Data saved successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.saveData() - Error saving data:", error)
      throw new Error(`Failed to save data to server: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Increment page visits with graceful failure
  async incrementPageVisits(): Promise<number> {
    try {
      console.log("📈 ApiDatabase.incrementPageVisits() - Incrementing page visits...")

      const response = await fetch(`${this.baseUrl}/data/page-visits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        console.warn("⚠️ Failed to increment page visits, continuing...")
        return 0
      }

      const data = await response.json()

      if (data.success) {
        console.log(`✅ Page visits incremented to: ${data.pageVisits}`)
        return data.pageVisits || 0
      } else {
        console.warn("⚠️ Page visits increment returned failure, continuing...")
        return 0
      }
    } catch (error) {
      console.warn("⚠️ Error incrementing page visits:", error)
      return 0
    }
  }

  // Add article
  async addArticle(
    categories: Category[],
    articleData: Omit<Article, "id" | "createdAt" | "updatedAt">,
  ): Promise<Article> {
    console.log("📝 ApiDatabase.addArticle() - Adding new article:", articleData.title)

    const newArticle: Article = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...articleData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Find the target category
    const updatedCategories = JSON.parse(JSON.stringify(categories)) // Deep clone
    const targetCategory = updatedCategories.find((cat: Category) => cat.id === articleData.categoryId)

    if (!targetCategory) {
      throw new Error("Category not found")
    }

    // Add to category or subcategory
    if (articleData.subcategoryId) {
      const subcategory = targetCategory.subcategories?.find((sub: any) => sub.id === articleData.subcategoryId)
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

    console.log("✅ Article added successfully:", newArticle.title)
    return newArticle
  }

  // Update article
  async updateArticle(
    categories: Category[],
    articleId: string,
    updatedArticle: Omit<Article, "createdAt">,
  ): Promise<Category[]> {
    console.log("📝 ApiDatabase.updateArticle() - Updating article:", articleId)

    const updatedCategories = JSON.parse(JSON.stringify(categories)) // Deep clone
    let found = false

    // Find and update the article
    for (const category of updatedCategories) {
      // Check category articles
      if (category.articles) {
        const articleIndex = category.articles.findIndex((article: Article) => article.id === articleId)
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
            const articleIndex = subcategory.articles.findIndex((article: Article) => article.id === articleId)
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

    console.log("✅ Article updated successfully")
    return updatedCategories
  }

  // Delete article
  async deleteArticle(categories: Category[], articleId: string): Promise<Category[]> {
    console.log("🗑️ ApiDatabase.deleteArticle() - Deleting article:", articleId)

    const updatedCategories = JSON.parse(JSON.stringify(categories)) // Deep clone
    let found = false

    // Find and delete the article
    for (const category of updatedCategories) {
      // Check category articles
      if (category.articles) {
        const articleIndex = category.articles.findIndex((article: Article) => article.id === articleId)
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
            const articleIndex = subcategory.articles.findIndex((article: Article) => article.id === articleId)
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

    console.log("✅ Article deleted successfully")
    return updatedCategories
  }

  // Update user last login
  async updateUserLastLogin(users: User[], userId: string): Promise<User[]> {
    console.log("👤 ApiDatabase.updateUserLastLogin() - Updating last login for user:", userId)

    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, lastLogin: new Date() } : user))

    // Save to server
    await this.saveData({ users: updatedUsers })

    console.log("✅ User last login updated successfully")
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
    console.log("📋 ApiDatabase.addAuditEntry() - Adding audit entry:", entry.action)

    const newEntry: AuditLogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      username: entry.performedBy,
      ...entry,
    }

    const updatedAuditLog = [newEntry, ...auditLog]

    // Keep only last 1000 entries
    if (updatedAuditLog.length > 1000) {
      updatedAuditLog.splice(1000)
    }

    // Save to server
    await this.saveData({ auditLog: updatedAuditLog })

    console.log("✅ Audit entry added successfully")
    return updatedAuditLog
  }

  // Import data with better error handling
  async importData(importData: any): Promise<void> {
    try {
      console.log("📥 ApiDatabase.importData() - Starting data import...")

      if (!importData || typeof importData !== "object") {
        throw new Error("Invalid import data structure")
      }

      // Process and validate the data
      const processedData = {
        categories: Array.isArray(importData.categories) ? importData.categories : [],
        users: Array.isArray(importData.users) ? importData.users : [],
        auditLog: Array.isArray(importData.auditLog) ? importData.auditLog : [],
        pageVisits:
          typeof importData.pageVisits === "number" ? importData.pageVisits : importData.settings?.pageVisits || 0,
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
        isActive: user.isActive !== false, // Default to true
      }))

      processedData.auditLog = processedData.auditLog.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp || Date.now()),
      }))

      // Save all data to server
      await this.saveData(processedData)

      console.log("✅ ApiDatabase.importData() - Data imported successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.importData() - Error importing data:", error)
      throw new Error(`Failed to import data to server: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Export data
  async exportData(): Promise<any> {
    try {
      console.log("📤 ApiDatabase.exportData() - Starting data export...")

      const data = await this.loadData()

      const exportData = {
        categories: data.categories,
        users: data.users,
        auditLog: data.auditLog,
        settings: {
          pageVisits: data.pageVisits,
          exportedAt: new Date().toISOString(),
          version: "1.0",
        },
      }

      console.log("✅ ApiDatabase.exportData() - Data exported successfully")
      return exportData
    } catch (error) {
      console.error("❌ ApiDatabase.exportData() - Error exporting data:", error)
      throw new Error(`Failed to export data from server: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      console.log("🗑️ ApiDatabase.clearAllData() - Clearing all data...")

      await this.saveData({
        categories: [],
        users: [],
        auditLog: [],
        pageVisits: 0,
      })

      console.log("✅ ApiDatabase.clearAllData() - All data cleared successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.clearAllData() - Error clearing data:", error)
      throw new Error(`Failed to clear data from server: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }
}

export const apiDatabase = new ApiDatabase()
