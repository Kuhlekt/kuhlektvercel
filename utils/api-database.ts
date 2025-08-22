import type { Category, User, AuditLogEntry, Article } from "../types/knowledge-base"

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
      const response = await fetch(this.baseUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Convert date strings back to Date objects
      const categories = data.categories.map((category: any) => ({
        ...category,
        articles: (category.articles || []).map((article: any) => ({
          ...article,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt),
        })),
        subcategories: (category.subcategories || []).map((sub: any) => ({
          ...sub,
          articles: (sub.articles || []).map((article: any) => ({
            ...article,
            createdAt: new Date(article.createdAt),
            updatedAt: new Date(article.updatedAt),
          })),
        })),
      }))

      const users = data.users.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
      }))

      const auditLog = data.auditLog.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }))

      return {
        categories,
        users,
        auditLog,
        settings: data.settings || { pageVisits: 0 },
      }
    } catch (error) {
      console.error("Failed to load data from API:", error)
      // Return default data structure if API fails
      return {
        categories: [],
        users: [
          {
            id: "1",
            username: "admin",
            password: "admin123",
            email: "admin@kuhlekt.com",
            role: "admin",
            createdAt: new Date(),
            lastLogin: undefined,
          },
        ],
        auditLog: [],
        settings: {
          pageVisits: 0,
        },
      }
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
      console.error("Failed to save data to API:", error)
      throw error
    }
  }

  async incrementPageVisits(): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/page-visits`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.pageVisits
    } catch (error) {
      console.error("Failed to increment page visits:", error)
      return 0
    }
  }

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
          return {
            ...category,
            subcategories: category.subcategories.map((subcategory) =>
              subcategory.id === articleData.subcategoryId
                ? { ...subcategory, articles: [...subcategory.articles, newArticle] }
                : subcategory,
            ),
          }
        } else {
          // Add to main category
          return {
            ...category,
            articles: [...category.articles, newArticle],
          }
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

  async updateArticle(categories: Category[], articleId: string, updates: Partial<Article>): Promise<Category[]> {
    const updatedCategories = categories.map((category) => ({
      ...category,
      articles: category.articles.map((article) =>
        article.id === articleId ? { ...article, ...updates, updatedAt: new Date() } : article,
      ),
      subcategories: category.subcategories.map((subcategory) => ({
        ...subcategory,
        articles: subcategory.articles.map((article) =>
          article.id === articleId ? { ...article, ...updates, updatedAt: new Date() } : article,
        ),
      })),
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
      articles: category.articles.filter((article) => article.id !== articleId),
      subcategories: category.subcategories.map((subcategory) => ({
        ...subcategory,
        articles: subcategory.articles.filter((article) => article.id !== articleId),
      })),
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
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
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

// Export the instance
export const apiDatabase = new ApiDatabase()

// Also export individual functions for backward compatibility
export const loadFromAPI = () => apiDatabase.loadData()
export const saveToAPI = (data: any) => apiDatabase.saveData(data)
