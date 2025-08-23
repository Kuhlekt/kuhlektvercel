import type { KnowledgeBaseData, User, Category, Article, AuditLogEntry } from "@/types/knowledge-base"

class ApiDatabase {
  private data: KnowledgeBaseData | null = null
  private isLoading = false

  async loadData(): Promise<KnowledgeBaseData> {
    if (this.isLoading) {
      // Wait for current load to complete
      while (this.isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      return this.data!
    }

    if (this.data) {
      return this.data
    }

    this.isLoading = true
    try {
      console.log("🔍 ApiDatabase.loadData() - Fetching data from server...")
      const response = await fetch("/api/data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ HTTP Error Response:", errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      this.data = await response.json()

      // Ensure data structure is valid
      if (!this.data || typeof this.data !== "object") {
        throw new Error("Invalid data structure received")
      }

      if (!Array.isArray(this.data.categories)) {
        this.data.categories = []
      }

      if (!Array.isArray(this.data.articles)) {
        this.data.articles = []
      }

      if (!Array.isArray(this.data.users)) {
        this.data.users = []
      }

      if (!Array.isArray(this.data.auditLog)) {
        this.data.auditLog = []
      }

      if (typeof this.data.pageVisits !== "number") {
        this.data.pageVisits = 0
      }

      console.log("✅ ApiDatabase.loadData() - Data loaded successfully")
      return this.data!
    } catch (error) {
      console.error("❌ ApiDatabase.loadData() - Error:", error)
      throw new Error("Failed to load data from server")
    } finally {
      this.isLoading = false
    }
  }

  async saveData(): Promise<void> {
    if (!this.data) {
      throw new Error("No data to save")
    }

    try {
      console.log("💾 ApiDatabase.saveData() - Saving data to server...")

      // Validate data before sending
      if (!Array.isArray(this.data.categories)) {
        throw new Error("Categories must be an array")
      }
      if (!Array.isArray(this.data.articles)) {
        throw new Error("Articles must be an array")
      }
      if (!Array.isArray(this.data.users)) {
        throw new Error("Users must be an array")
      }
      if (!Array.isArray(this.data.auditLog)) {
        throw new Error("Audit log must be an array")
      }

      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.data),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Save Error Response:", errorText)
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
    try {
      console.log("📊 ApiDatabase.incrementPageVisits() - Incrementing page visits...")
      const response = await fetch("/api/data/page-visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        console.warn("⚠️ Failed to increment page visits")
        return 0
      }

      const result = await response.json()
      if (result.success) {
        console.log("✅ Page visits incremented:", result.totalVisits)
        return result.totalVisits || 0
      } else {
        console.warn("⚠️ Page visits increment returned failure")
        return 0
      }
    } catch (error) {
      console.warn("⚠️ Error incrementing page visits (non-critical):", error)
      return 0
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

    if (this.data) {
      this.data.categories = updatedCategories
      this.data.articles = [...(this.data.articles || []), newArticle]
      await this.saveData()
    }

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

    if (this.data) {
      this.data.categories = updatedCategories
      // Also update in articles array
      const articleIndex = this.data.articles.findIndex((a) => a.id === articleId)
      if (articleIndex !== -1) {
        const originalArticle = this.data.articles[articleIndex]
        this.data.articles[articleIndex] = {
          ...updatedArticle,
          createdAt: originalArticle.createdAt,
          updatedAt: new Date().toISOString(),
        }
      }
      await this.saveData()
    }

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

    if (this.data) {
      this.data.categories = updatedCategories
      this.data.articles = this.data.articles.filter((a) => a.id !== articleId)
      await this.saveData()
    }

    return updatedCategories
  }

  async updateUserLastLogin(users: User[], userId: string): Promise<User[]> {
    if (!Array.isArray(users)) {
      throw new Error("Users parameter must be an array")
    }

    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          lastLogin: new Date().toISOString(),
        }
      }
      return user
    })

    if (this.data) {
      this.data.users = updatedUsers
      await this.saveData()
    }

    return updatedUsers
  }

  async addAuditEntry(
    auditLog: AuditLogEntry[],
    entry: Omit<AuditLogEntry, "id" | "timestamp">,
  ): Promise<AuditLogEntry[]> {
    if (!Array.isArray(auditLog)) {
      throw new Error("AuditLog parameter must be an array")
    }

    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    const updatedAuditLog = [newEntry, ...auditLog]

    // Keep only last 1000 entries
    if (updatedAuditLog.length > 1000) {
      updatedAuditLog.splice(1000)
    }

    if (this.data) {
      this.data.auditLog = updatedAuditLog
      await this.saveData()
    }

    return updatedAuditLog
  }

  async importData(data: KnowledgeBaseData): Promise<void> {
    // Validate imported data
    if (!data || typeof data !== "object") {
      throw new Error("Invalid data format")
    }

    if (!Array.isArray(data.categories)) {
      throw new Error("Categories must be an array")
    }

    if (!Array.isArray(data.articles)) {
      throw new Error("Articles must be an array")
    }

    if (!Array.isArray(data.users)) {
      throw new Error("Users must be an array")
    }

    if (!Array.isArray(data.auditLog)) {
      throw new Error("Audit log must be an array")
    }

    this.data = data
    await this.saveData()
  }

  clearCache(): void {
    this.data = null
  }
}

export const apiDatabase = new ApiDatabase()
