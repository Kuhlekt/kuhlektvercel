import type { Category, Article, User, AuditLogEntry } from "@/types/knowledge-base"

interface DatabaseData {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
}

class ApiDatabase {
  private baseUrl = "/api/data"

  async loadData(): Promise<DatabaseData> {
    try {
      console.log("🔍 ApiDatabase.loadData() - Fetching data from server...")

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "load" }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      console.log("✅ ApiDatabase.loadData() - Data loaded successfully:", {
        categories: data.categories?.length || 0,
        users: data.users?.length || 0,
        auditLog: data.auditLog?.length || 0,
      })

      return {
        categories: data.categories || [],
        users: data.users || [],
        auditLog: data.auditLog || [],
      }
    } catch (error) {
      console.error("❌ ApiDatabase.loadData() - Error:", error)
      throw new Error("Failed to load data from server")
    }
  }

  async saveData(data: DatabaseData): Promise<void> {
    try {
      console.log("💾 ApiDatabase.saveData() - Saving data to server...")

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "save", data }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log("✅ ApiDatabase.saveData() - Data saved successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.saveData() - Error:", error)
      throw new Error("Failed to save data to server")
    }
  }

  async incrementPageVisits(): Promise<void> {
    try {
      console.log("📊 ApiDatabase.incrementPageVisits() - Incrementing page visits...")

      const response = await fetch("/api/data/page-visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        console.warn("⚠️ Failed to increment page visits, but continuing...")
        return
      }

      const data = await response.json()
      console.log("✅ ApiDatabase.incrementPageVisits() - Page visits updated:", data)
    } catch (error) {
      console.warn("⚠️ ApiDatabase.incrementPageVisits() - Error (non-critical):", error)
      // Don't throw error for page visits - it's not critical
    }
  }

  async addArticle(
    categories: Category[],
    articleData: Omit<Article, "id" | "createdAt" | "updatedAt">,
  ): Promise<Article> {
    const newArticle: Article = {
      ...articleData,
      id: `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedCategories = categories.map((category) => {
      if (category.id === articleData.categoryId) {
        return {
          ...category,
          articles: [...(category.articles || []), newArticle],
        }
      }

      if (category.subcategories) {
        const updatedSubcategories = category.subcategories.map((subcategory) => {
          if (subcategory.id === articleData.categoryId) {
            return {
              ...subcategory,
              articles: [...(subcategory.articles || []), newArticle],
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

    const currentData = await this.loadData()
    await this.saveData({
      ...currentData,
      categories: updatedCategories,
    })

    return newArticle
  }

  async updateArticle(
    categories: Category[],
    articleId: string,
    updatedArticle: Omit<Article, "createdAt">,
  ): Promise<Category[]> {
    const updatedCategories = categories.map((category) => {
      // Check main category articles
      if (category.articles) {
        const articleIndex = category.articles.findIndex((a) => a.id === articleId)
        if (articleIndex !== -1) {
          const originalArticle = category.articles[articleIndex]
          const updated = [...category.articles]
          updated[articleIndex] = {
            ...updatedArticle,
            createdAt: originalArticle.createdAt,
            updatedAt: new Date().toISOString(),
          }
          return { ...category, articles: updated }
        }
      }

      // Check subcategory articles
      if (category.subcategories) {
        const updatedSubcategories = category.subcategories.map((subcategory) => {
          if (subcategory.articles) {
            const articleIndex = subcategory.articles.findIndex((a) => a.id === articleId)
            if (articleIndex !== -1) {
              const originalArticle = subcategory.articles[articleIndex]
              const updated = [...subcategory.articles]
              updated[articleIndex] = {
                ...updatedArticle,
                createdAt: originalArticle.createdAt,
                updatedAt: new Date().toISOString(),
              }
              return { ...subcategory, articles: updated }
            }
          }
          return subcategory
        })

        return { ...category, subcategories: updatedSubcategories }
      }

      return category
    })

    const currentData = await this.loadData()
    await this.saveData({
      ...currentData,
      categories: updatedCategories,
    })

    return updatedCategories
  }

  async deleteArticle(categories: Category[], articleId: string): Promise<Category[]> {
    const updatedCategories = categories.map((category) => {
      // Check main category articles
      if (category.articles) {
        const filtered = category.articles.filter((a) => a.id !== articleId)
        if (filtered.length !== category.articles.length) {
          return { ...category, articles: filtered }
        }
      }

      // Check subcategory articles
      if (category.subcategories) {
        const updatedSubcategories = category.subcategories.map((subcategory) => {
          if (subcategory.articles) {
            const filtered = subcategory.articles.filter((a) => a.id !== articleId)
            return { ...subcategory, articles: filtered }
          }
          return subcategory
        })

        return { ...category, subcategories: updatedSubcategories }
      }

      return category
    })

    const currentData = await this.loadData()
    await this.saveData({
      ...currentData,
      categories: updatedCategories,
    })

    return updatedCategories
  }

  async updateUserLastLogin(users: User[], userId: string): Promise<User[]> {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          lastLogin: new Date().toISOString(),
        }
      }
      return user
    })

    const currentData = await this.loadData()
    await this.saveData({
      ...currentData,
      users: updatedUsers,
    })

    return updatedUsers
  }

  async addAuditEntry(
    auditLog: AuditLogEntry[],
    entry: Omit<AuditLogEntry, "id" | "timestamp">,
  ): Promise<AuditLogEntry[]> {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    const updatedAuditLog = [...auditLog, newEntry]

    const currentData = await this.loadData()
    await this.saveData({
      ...currentData,
      auditLog: updatedAuditLog,
    })

    return updatedAuditLog
  }

  async importData(data: DatabaseData): Promise<void> {
    try {
      console.log("📥 ApiDatabase.importData() - Importing data...")

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "import", data }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log("✅ ApiDatabase.importData() - Data imported successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.importData() - Error:", error)
      throw new Error("Failed to import data")
    }
  }
}

// Export singleton instance
export const apiDatabase = new ApiDatabase()
