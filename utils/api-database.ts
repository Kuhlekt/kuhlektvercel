import type { Category, Article, User, AuditLogEntry, KnowledgeBaseData } from "@/types/knowledge-base"

class ApiDatabase {
  private baseUrl = "/api"

  async loadData(): Promise<KnowledgeBaseData> {
    console.log("🔍 ApiDatabase.loadData() - Fetching data from server...")

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

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to load data")
      }

      console.log("✅ ApiDatabase.loadData() - Data loaded successfully")
      return result.data
    } catch (error) {
      console.error("❌ ApiDatabase.loadData() - Error:", error)
      throw new Error("Failed to load data from server")
    }
  }

  async saveData(data: KnowledgeBaseData): Promise<void> {
    console.log("💾 ApiDatabase.saveData() - Saving data to server...")

    try {
      const response = await fetch(`${this.baseUrl}/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.log("❌ Save Error Response:", errorData)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to save data")
      }

      console.log("✅ ApiDatabase.saveData() - Data saved successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.saveData() - Error:", error)
      throw new Error("Failed to save data to server")
    }
  }

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

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to increment page visits")
      }

      return result.visits
    } catch (error) {
      console.error("Failed to increment page visits:", error)
      return 0
    }
  }

  // Article operations
  async addArticle(
    categories: Category[],
    articleData: Omit<Article, "id" | "createdAt" | "updatedAt">,
  ): Promise<Article> {
    const newArticle: Article = {
      ...articleData,
      id: `art-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
    }

    const updatedCategories = categories.map((category) => {
      if (category.id === articleData.categoryId) {
        return {
          ...category,
          articles: [...(category.articles || []), newArticle],
        }
      }

      if (category.subcategories && articleData.subcategoryId) {
        return {
          ...category,
          subcategories: category.subcategories.map((sub) => {
            if (sub.id === articleData.subcategoryId) {
              return {
                ...sub,
                articles: [...(sub.articles || []), newArticle],
              }
            }
            return sub
          }),
        }
      }

      return category
    })

    const data: KnowledgeBaseData = {
      categories: updatedCategories,
      users: [],
      auditLog: [],
    }

    await this.saveData(data)
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
        const articleIndex = category.articles.findIndex((art) => art.id === articleId)
        if (articleIndex !== -1) {
          const articles = [...category.articles]
          articles[articleIndex] = {
            ...updatedArticle,
            createdAt: articles[articleIndex].createdAt,
            updatedAt: new Date(),
          }
          return { ...category, articles }
        }
      }

      // Check subcategory articles
      if (category.subcategories) {
        const subcategories = category.subcategories.map((sub) => {
          if (sub.articles) {
            const articleIndex = sub.articles.findIndex((art) => art.id === articleId)
            if (articleIndex !== -1) {
              const articles = [...sub.articles]
              articles[articleIndex] = {
                ...updatedArticle,
                createdAt: articles[articleIndex].createdAt,
                updatedAt: new Date(),
              }
              return { ...sub, articles }
            }
          }
          return sub
        })
        return { ...category, subcategories }
      }

      return category
    })

    return updatedCategories
  }

  async deleteArticle(categories: Category[], articleId: string): Promise<Category[]> {
    const updatedCategories = categories.map((category) => {
      // Check main category articles
      if (category.articles) {
        const filteredArticles = category.articles.filter((art) => art.id !== articleId)
        if (filteredArticles.length !== category.articles.length) {
          return { ...category, articles: filteredArticles }
        }
      }

      // Check subcategory articles
      if (category.subcategories) {
        const subcategories = category.subcategories.map((sub) => {
          if (sub.articles) {
            const filteredArticles = sub.articles.filter((art) => art.id !== articleId)
            return { ...sub, articles: filteredArticles }
          }
          return sub
        })
        return { ...category, subcategories }
      }

      return category
    })

    return updatedCategories
  }

  // User operations
  async updateUserLastLogin(users: User[], userId: string): Promise<User[]> {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return { ...user, lastLogin: new Date() }
      }
      return user
    })

    return updatedUsers
  }

  // Audit log operations
  async addAuditEntry(
    auditLog: AuditLogEntry[],
    entry: Omit<AuditLogEntry, "id" | "timestamp">,
  ): Promise<AuditLogEntry[]> {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}`,
      timestamp: new Date(),
    }

    return [newEntry, ...auditLog]
  }
}

export const apiDatabase = new ApiDatabase()
