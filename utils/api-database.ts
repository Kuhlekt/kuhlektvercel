// API Database utility for handling server communication
import type { KnowledgeBaseData, User, Category, Article, AuditLogEntry } from "@/types/knowledge-base"

interface DatabaseData {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  pageVisits: number
}

class ApiDatabase {
  private baseUrl = "/api/data"

  // Load all data from server
  async loadData(): Promise<KnowledgeBaseData> {
    console.log("🔍 ApiDatabase.loadData() - Fetching data from server...")
    try {
      const response = await fetch(this.baseUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("✅ ApiDatabase.loadData() - Data received:", {
        categories: data.categories?.length || 0,
        users: data.users?.length || 0,
        usernames: data.users?.map((u: User) => u.username) || [],
        auditLog: data.auditLog?.length || 0,
        pageVisits: data.pageVisits || 0,
      })
      return data
    } catch (error) {
      console.error("❌ ApiDatabase.loadData() - Error:", error)
      throw new Error(`Failed to load data from server: ${error}`)
    }
  }

  // Save all data to server with better error handling
  async saveData(data: KnowledgeBaseData): Promise<void> {
    console.log("💾 ApiDatabase.saveData() - Saving data to server...")
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log("✅ ApiDatabase.saveData() - Data saved successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.saveData() - Error saving data:", error)
      throw new Error(`Failed to save data to server: ${error}`)
    }
  }

  // Increment page visits with graceful failure
  async incrementPageVisits(): Promise<number> {
    console.log("📈 ApiDatabase.incrementPageVisits() - Incrementing page visits...")
    try {
      const response = await fetch(`${this.baseUrl}/page-visits`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ ApiDatabase.incrementPageVisits() - Success:", result.pageVisits)
      return result.pageVisits
    } catch (error) {
      console.error("❌ ApiDatabase.incrementPageVisits() - Error:", error)
      throw new Error(`Failed to increment page visits: ${error}`)
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
  async updateUserLastLogin(userId: string): Promise<void> {
    console.log("👤 ApiDatabase.updateUserLastLogin() - Updating last login for user:", userId)
    try {
      const data = await this.loadData()
      const user = data.users.find((u) => u.id === userId)
      if (user) {
        user.lastLogin = new Date().toISOString()
        await this.saveData(data)
        console.log("✅ ApiDatabase.updateUserLastLogin() - Updated successfully")
      }
    } catch (error) {
      console.error("❌ ApiDatabase.updateUserLastLogin() - Error:", error)
      throw new Error(`Failed to update last login: ${error}`)
    }
  }

  // Add audit entry
  async addAuditLogEntry(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<void> {
    try {
      const data = await this.loadData()
      const newEntry: AuditLogEntry = {
        ...entry,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      }
      data.auditLog.push(newEntry)
      await this.saveData(data)
    } catch (error) {
      console.error("Error adding audit log entry:", error)
      throw new Error(`Failed to add audit log entry: ${error}`)
    }
  }

  // Import data with better error handling
  async importData(importedData: KnowledgeBaseData): Promise<void> {
    console.log("📥 ApiDatabase.importData() - Starting data import...")
    try {
      await this.saveData(importedData)
      console.log("✅ ApiDatabase.importData() - Data imported successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.importData() - Error importing data:", error)
      throw new Error(`Failed to import data to server: ${error}`)
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
      throw new Error(`Failed to export data from server: ${error}`)
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
      throw new Error(`Failed to clear data from server: ${error}`)
    }
  }
}

// Export a singleton instance
export const apiDatabase = new ApiDatabase()
