// API Database utility for handling server communication
import type { KnowledgeBaseData, Category, Article, User, AuditLogEntry } from "@/types/knowledge-base"

class ApiDatabase {
  private baseUrl = "/api/data"

  // Load all data from server
  async loadData(): Promise<KnowledgeBaseData> {
    try {
      console.log("🔄 ApiDatabase.loadData() - Fetching data from API...")
      const response = await fetch(this.baseUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Ensure fresh data
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

      return data
    } catch (error) {
      console.error("❌ ApiDatabase.loadData() - Error:", error)
      throw error
    }
  }

  // Save all data to server
  async saveData(data: Partial<KnowledgeBaseData>): Promise<void> {
    try {
      console.log("💾 ApiDatabase.saveData() - Saving data to API...")
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

      const result = await response.json()
      console.log("✅ ApiDatabase.saveData() - Data saved successfully:", result)
    } catch (error) {
      console.error("❌ ApiDatabase.saveData() - Error:", error)
      throw error
    }
  }

  // Increment page visits
  async incrementPageVisits(): Promise<void> {
    try {
      const response = await fetch("/api/data/page-visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        console.warn("Failed to increment page visits")
      }
    } catch (error) {
      console.warn("Error incrementing page visits:", error)
    }
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
