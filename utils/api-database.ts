import type { Category, Article, User, AuditLogEntry, KnowledgeBaseData } from "@/types/knowledge-base"

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
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      this.data = await response.json()
      console.log("✅ ApiDatabase.loadData() - Data loaded successfully")
      return this.data!
    } catch (error) {
      console.error("❌ ApiDatabase.loadData() - Error:", error)
      throw new Error("Failed to load data from server")
    } finally {
      this.isLoading = false
    }
  }

  async saveData(data?: KnowledgeBaseData): Promise<void> {
    const dataToSave = data || this.data
    if (!dataToSave) {
      throw new Error("No data to save")
    }

    try {
      console.log("💾 ApiDatabase.saveData() - Saving data to server...")
      console.log("📊 Data structure:", {
        categories: dataToSave.categories?.length || 0,
        users: dataToSave.users?.length || 0,
        auditLog: dataToSave.auditLog?.length || 0,
      })

      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("❌ Save Error Response:", errorData)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || "Failed to save data")
      }

      // Update local cache
      this.data = dataToSave
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
      if (result.success) {
        return result.visits
      } else {
        console.warn("Page visits increment failed:", result.error)
        return 0
      }
    } catch (error) {
      console.warn("Failed to increment page visits:", error)
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

    if (this.data) {
      this.data.categories = updatedCategories
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

    if (this.data) {
      this.data.categories = updatedCategories
      await this.saveData()
    }

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

    if (this.data) {
      this.data.categories = updatedCategories
      await this.saveData()
    }

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

    if (this.data) {
      this.data.users = updatedUsers
      await this.saveData()
    }

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

    const updatedAuditLog = [newEntry, ...auditLog]

    if (this.data) {
      this.data.auditLog = updatedAuditLog
      await this.saveData()
    }

    return updatedAuditLog
  }

  async importData(data: KnowledgeBaseData): Promise<void> {
    this.data = data
    await this.saveData(data)
  }
}

export const apiDatabase = new ApiDatabase()
