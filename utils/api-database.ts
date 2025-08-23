import type { Category, Article, User, AuditLogEntry, KnowledgeBaseData } from "@/types/knowledge-base"

class ApiDatabase {
  private data: KnowledgeBaseData | null = null
  private isLoading = false

  async loadData(): Promise<KnowledgeBaseData> {
    console.log("🔍 ApiDatabase.loadData() - Fetching data from server...")

    try {
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

      const data = await response.json()
      console.log("✅ ApiDatabase.loadData() - Data loaded successfully")

      this.data = {
        categories: Array.isArray(data.categories) ? data.categories : [],
        users: Array.isArray(data.users) ? data.users : [],
        auditLog: Array.isArray(data.auditLog) ? data.auditLog : [],
      }

      return this.data
    } catch (error) {
      console.error("❌ ApiDatabase.loadData() - Error:", error)
      throw new Error("Failed to load data from server")
    }
  }

  async saveData(): Promise<void> {
    if (!this.data) {
      throw new Error("No data to save")
    }

    console.log("💾 ApiDatabase.saveData() - Saving data to server...")

    try {
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
      console.log("✅ ApiDatabase.saveData() - Data saved successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.saveData() - Error:", error)
      throw new Error("Failed to save data to server")
    }
  }

  async incrementPageVisits(): Promise<number> {
    try {
      const response = await fetch("/api/data/page-visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        console.warn("Failed to increment page visits")
        return 0
      }

      const result = await response.json()
      return result.totalVisits || 0
    } catch (error) {
      console.warn("Error incrementing page visits:", error)
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

    this.data = {
      ...this.data!,
      categories: updatedCategories,
    }

    await this.saveData()
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

    this.data = {
      ...this.data!,
      categories: updatedCategories,
    }

    await this.saveData()
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

    this.data = {
      ...this.data!,
      categories: updatedCategories,
    }

    await this.saveData()
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

    this.data = {
      ...this.data!,
      users: updatedUsers,
    }

    await this.saveData()
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

    this.data = {
      ...this.data!,
      auditLog: updatedAuditLog,
    }

    await this.saveData()
    return updatedAuditLog
  }

  async importData(data: KnowledgeBaseData): Promise<void> {
    this.data = data
    await this.saveData()
  }
}

export const apiDatabase = new ApiDatabase()
