import type { Category, Article, User, AuditLogEntry } from "../types/knowledge-base"

interface DatabaseData {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  settings: {
    pageVisits: number
  }
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

  async getCategories(): Promise<Category[]> {
    const data = await this.loadData()
    return data.categories
  }

  async saveCategories(categories: Category[]): Promise<void> {
    const data = await this.loadData()
    await this.saveData({ ...data, categories })
  }

  async getUsers(): Promise<User[]> {
    const data = await this.loadData()
    return data.users
  }

  async saveUsers(users: User[]): Promise<void> {
    const data = await this.loadData()
    await this.saveData({ ...data, users })
  }

  async getAuditLog(): Promise<AuditLogEntry[]> {
    const data = await this.loadData()
    return data.auditLog
  }

  async saveAuditLog(auditLog: AuditLogEntry[]): Promise<void> {
    const data = await this.loadData()
    await this.saveData({ ...data, auditLog })
  }

  async getSettings(): Promise<{ pageVisits: number }> {
    const data = await this.loadData()
    return data.settings
  }

  async saveSettings(settings: { pageVisits: number }): Promise<void> {
    const data = await this.loadData()
    await this.saveData({ ...data, settings })
  }

  async incrementPageVisits(): Promise<void> {
    try {
      const response = await fetch("/api/data/page-visits", {
        method: "POST",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
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
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedCategories = categories.map((category) => {
      if (category.id === articleData.categoryId) {
        return {
          ...category,
          articles: [...category.articles, newArticle],
        }
      }
      // Check subcategories
      const updatedSubcategories = category.subcategories.map((subcategory) => {
        if (subcategory.id === articleData.categoryId) {
          return {
            ...subcategory,
            articles: [...subcategory.articles, newArticle],
          }
        }
        return subcategory
      })
      return {
        ...category,
        subcategories: updatedSubcategories,
      }
    })

    await this.saveCategories(updatedCategories)
    return newArticle
  }

  async updateArticle(
    categories: Category[],
    articleId: string,
    updatedData: Omit<Article, "createdAt">,
  ): Promise<Category[]> {
    const updatedCategories = categories.map((category) => {
      const updatedArticles = category.articles.map((article) =>
        article.id === articleId ? { ...article, ...updatedData, updatedAt: new Date() } : article,
      )

      const updatedSubcategories = category.subcategories.map((subcategory) => ({
        ...subcategory,
        articles: subcategory.articles.map((article) =>
          article.id === articleId ? { ...article, ...updatedData, updatedAt: new Date() } : article,
        ),
      }))

      return {
        ...category,
        articles: updatedArticles,
        subcategories: updatedSubcategories,
      }
    })

    await this.saveCategories(updatedCategories)
    return updatedCategories
  }

  async deleteArticle(categories: Category[], articleId: string): Promise<Category[]> {
    const updatedCategories = categories.map((category) => ({
      ...category,
      articles: category.articles.filter((article) => article.id !== articleId),
      subcategories: category.subcategories.map((subcategory) => ({
        ...subcategory,
        articles: subcategory.articles.filter((article) => article.id !== articleId),
      })),
    }))

    await this.saveCategories(updatedCategories)
    return updatedCategories
  }

  async updateUserLastLogin(users: User[], userId: string): Promise<User[]> {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, lastLogin: new Date() } : user))
    await this.saveUsers(updatedUsers)
    return updatedUsers
  }

  async addAuditEntry(
    auditLog: AuditLogEntry[],
    entry: Omit<AuditLogEntry, "id" | "timestamp">,
  ): Promise<AuditLogEntry[]> {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    const updatedAuditLog = [newEntry, ...auditLog]
    await this.saveAuditLog(updatedAuditLog)
    return updatedAuditLog
  }
}

export const apiDatabase = new ApiDatabase()
