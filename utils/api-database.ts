import type { Category, Article, User, AuditLogEntry } from "@/types/knowledge-base"

interface DatabaseData {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  pageVisits?: number
}

class ApiDatabase {
  private baseUrl = "/api/data"

  async loadData(): Promise<DatabaseData> {
    console.log("🔍 ApiDatabase.loadData() - Fetching data from server...")

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "load" }),
        cache: "no-store",
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ HTTP Error Response:", errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Server returned failure")
      }

      console.log("✅ ApiDatabase.loadData() - Data received:", {
        categories: data.categories?.length || 0,
        users: data.users?.length || 0,
        auditLog: data.auditLog?.length || 0,
        pageVisits: data.pageVisits || 0,
      })

      return {
        categories: Array.isArray(data.categories) ? data.categories : [],
        users: Array.isArray(data.users) ? data.users : [],
        auditLog: Array.isArray(data.auditLog) ? data.auditLog : [],
        pageVisits: typeof data.pageVisits === "number" ? data.pageVisits : 0,
      }
    } catch (error) {
      console.error("❌ ApiDatabase.loadData() - Error:", error)
      throw new Error("Failed to load data from server")
    }
  }

  async saveData(data: DatabaseData): Promise<void> {
    console.log("💾 ApiDatabase.saveData() - Saving data to server...")

    try {
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

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || "Save operation failed")
      }

      console.log("✅ ApiDatabase.saveData() - Data saved successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.saveData() - Error:", error)
      throw new Error("Failed to save data to server")
    }
  }

  async incrementPageVisits(): Promise<number> {
    console.log("📊 ApiDatabase.incrementPageVisits() - Incrementing page visits...")

    try {
      const response = await fetch("/api/data/page-visits", {
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
        console.log("✅ Page visits incremented:", data.totalVisits)
        return data.totalVisits || 0
      } else {
        console.warn("⚠️ Page visits increment returned failure")
        return 0
      }
    } catch (error) {
      console.warn("⚠️ Error incrementing page visits (non-critical):", error)
      return 0
    }
  }

  async updateUserLastLogin(users: User[], userId: string): Promise<User[]> {
    console.log("👤 ApiDatabase.updateUserLastLogin() - Updating for user:", userId)

    try {
      if (!Array.isArray(users)) {
        throw new Error("Users parameter must be an array")
      }

      if (!userId || typeof userId !== "string") {
        throw new Error("UserId parameter must be a string")
      }

      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, lastLogin: new Date().toISOString() } : user,
      )

      const currentData = await this.loadData()
      await this.saveData({
        ...currentData,
        users: updatedUsers,
      })

      console.log("✅ User last login updated successfully")
      return updatedUsers
    } catch (error) {
      console.error("❌ ApiDatabase.updateUserLastLogin() - Error:", error)
      throw new Error("Failed to update last login")
    }
  }

  async addAuditEntry(
    auditLog: AuditLogEntry[],
    entry: {
      action: string
      articleId?: string
      articleTitle?: string
      categoryId?: string
      performedBy: string
      details: string
    },
  ): Promise<AuditLogEntry[]> {
    console.log("📋 ApiDatabase.addAuditEntry() - Adding entry:", entry.action)

    try {
      if (!Array.isArray(auditLog)) {
        throw new Error("AuditLog parameter must be an array")
      }

      const newEntry: AuditLogEntry = {
        id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ...entry,
      }

      const updatedAuditLog = [newEntry, ...auditLog]

      // Keep only last 1000 entries
      if (updatedAuditLog.length > 1000) {
        updatedAuditLog.splice(1000)
      }

      const currentData = await this.loadData()
      await this.saveData({
        ...currentData,
        auditLog: updatedAuditLog,
      })

      console.log("✅ Audit entry added successfully")
      return updatedAuditLog
    } catch (error) {
      console.error("❌ ApiDatabase.addAuditEntry() - Error:", error)
      throw new Error("Failed to add audit entry")
    }
  }

  async addArticle(
    categories: Category[],
    articleData: Omit<Article, "id" | "createdAt" | "updatedAt">,
  ): Promise<Article> {
    console.log("📝 ApiDatabase.addArticle() - Adding article:", articleData.title)

    try {
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

      console.log("✅ Article added successfully")
      return newArticle
    } catch (error) {
      console.error("❌ ApiDatabase.addArticle() - Error:", error)
      throw new Error("Failed to add article")
    }
  }

  async updateArticle(
    categories: Category[],
    articleId: string,
    updatedArticle: Omit<Article, "createdAt">,
  ): Promise<Category[]> {
    console.log("📝 ApiDatabase.updateArticle() - Updating article:", articleId)

    try {
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

      console.log("✅ Article updated successfully")
      return updatedCategories
    } catch (error) {
      console.error("❌ ApiDatabase.updateArticle() - Error:", error)
      throw new Error("Failed to update article")
    }
  }

  async deleteArticle(categories: Category[], articleId: string): Promise<Category[]> {
    console.log("🗑️ ApiDatabase.deleteArticle() - Deleting article:", articleId)

    try {
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

      console.log("✅ Article deleted successfully")
      return updatedCategories
    } catch (error) {
      console.error("❌ ApiDatabase.deleteArticle() - Error:", error)
      throw new Error("Failed to delete article")
    }
  }

  async importData(data: DatabaseData): Promise<void> {
    console.log("📥 ApiDatabase.importData() - Importing data...")

    try {
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

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || "Import operation failed")
      }

      console.log("✅ Data imported successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.importData() - Error:", error)
      throw new Error("Failed to import data")
    }
  }
}

export const apiDatabase = new ApiDatabase()
