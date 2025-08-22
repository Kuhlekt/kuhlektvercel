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
    const response = await fetch(this.baseUrl)
    if (!response.ok) {
      throw new Error("Failed to load data")
    }
    return response.json()
  }

  async saveData(data: DatabaseData): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to save data")
    }
  }

  async incrementPageVisits(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/page-visits`, {
      method: "POST",
    })
    if (!response.ok) {
      throw new Error("Failed to increment page visits")
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
    const updatedCategories = categories.map((category) => {
      const updatedArticles = category.articles.map((article) =>
        article.id === articleId ? { ...updatedArticle, createdAt: article.createdAt, updatedAt: new Date() } : article,
      )

      const updatedSubcategories = category.subcategories.map((subcategory) => ({
        ...subcategory,
        articles: subcategory.articles.map((article) =>
          article.id === articleId
            ? { ...updatedArticle, createdAt: article.createdAt, updatedAt: new Date() }
            : article,
        ),
      }))

      return {
        ...category,
        articles: updatedArticles,
        subcategories: updatedSubcategories,
      }
    })

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
      id: Date.now().toString(),
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

export const apiDatabase = new ApiDatabase()
