interface DatabaseData {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  settings: { pageVisits: number }
}

class ApiDatabase {
  private baseUrl = "/api/data"

  async loadData(): Promise<DatabaseData> {
    try {
      const response = await fetch(this.baseUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return {
        categories: data.categories || [],
        users: data.users || [],
        auditLog: data.auditLog || [],
        settings: data.settings || { pageVisits: 0 },
      }
    } catch (error) {
      console.error("Error loading data:", error)
      throw error
    }
  }

  async saveData(data: DatabaseData): Promise<void> {
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
    } catch (error) {
      console.error("Error saving data:", error)
      throw error
    }
  }

  async incrementPageVisits(): Promise<number> {
    try {
      const response = await fetch("/api/data/page-visits", {
        method: "POST",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data.pageVisits
    } catch (error) {
      console.error("Error incrementing page visits:", error)
      throw error
    }
  }

  async addArticle(
    categories: Category[],
    articleData: Omit<Article, "id" | "createdAt" | "updatedAt">,
  ): Promise<Article> {
    const newArticle: Article = {
      ...articleData,
      id: Date.now().toString(),
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
      return category
    })

    const data = await this.loadData()
    await this.saveData({
      ...data,
      categories: updatedCategories,
    })

    return newArticle
  }

  async updateArticle(
    categories: Category[],
    articleId: string,
    updatedArticle: Omit<Article, "createdAt">,
  ): Promise<Category[]> {
    const updatedCategories = categories.map((category) => ({
      ...category,
      articles: (category.articles || []).map((article) =>
        article.id === articleId
          ? { ...updatedArticle, createdAt: article.createdAt, updatedAt: new Date().toISOString() }
          : article,
      ),
    }))

    const data = await this.loadData()
    await this.saveData({
      ...data,
      categories: updatedCategories,
    })

    return updatedCategories
  }

  async deleteArticle(categories: Category[], articleId: string): Promise<Category[]> {
    const updatedCategories = categories.map((category) => ({
      ...category,
      articles: (category.articles || []).filter((article) => article.id !== articleId),
    }))

    const data = await this.loadData()
    await this.saveData({
      ...data,
      categories: updatedCategories,
    })

    return updatedCategories
  }

  async updateUserLastLogin(users: User[], userId: string): Promise<User[]> {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, lastLogin: new Date() } : user))

    const data = await this.loadData()
    await this.saveData({
      ...data,
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
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }

    const updatedAuditLog = [newEntry, ...auditLog]

    const data = await this.loadData()
    await this.saveData({
      ...data,
      auditLog: updatedAuditLog,
    })

    return updatedAuditLog
  }
}

export const apiDatabase = new ApiDatabase()

// Import types
import type { Category, Article, User, AuditLogEntry } from "../types/knowledge-base"
