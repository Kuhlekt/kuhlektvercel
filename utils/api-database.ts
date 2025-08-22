import type { Category, Article, User, AuditLogEntry } from "../types/knowledge-base"

export class ApiDatabase {
  private baseUrl = "/api/data"

  async loadData(): Promise<{
    categories: Category[]
    users: User[]
    auditLog: AuditLogEntry[]
  }> {
    const response = await fetch(this.baseUrl)
    if (!response.ok) {
      throw new Error("Failed to load data")
    }
    return response.json()
  }

  async saveData(data: {
    categories: Category[]
    users: User[]
    auditLog: AuditLogEntry[]
  }): Promise<void> {
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

        if (updatedSubcategories !== category.subcategories) {
          return {
            ...category,
            subcategories: updatedSubcategories,
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

  async updateArticle(
    categories: Category[],
    articleId: string,
    updatedArticle: Omit<Article, "createdAt">,
  ): Promise<Category[]> {
    const updatedCategories = categories.map((category) => {
      if (category.articles) {
        const articleIndex = category.articles.findIndex((a) => a.id === articleId)
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

      if (category.subcategories) {
        const updatedSubcategories = category.subcategories.map((subcategory) => {
          if (subcategory.articles) {
            const articleIndex = subcategory.articles.findIndex((a) => a.id === articleId)
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

    const data = await this.loadData()
    await this.saveData({
      ...data,
      categories: updatedCategories,
    })

    return updatedCategories
  }

  async deleteArticle(categories: Category[], articleId: string): Promise<Category[]> {
    const updatedCategories = categories.map((category) => {
      if (category.articles) {
        const filteredArticles = category.articles.filter((a) => a.id !== articleId)
        if (filteredArticles.length !== category.articles.length) {
          return {
            ...category,
            articles: filteredArticles,
          }
        }
      }

      if (category.subcategories) {
        const updatedSubcategories = category.subcategories.map((subcategory) => {
          if (subcategory.articles) {
            const filteredArticles = subcategory.articles.filter((a) => a.id !== articleId)
            if (filteredArticles.length !== subcategory.articles.length) {
              return {
                ...subcategory,
                articles: filteredArticles,
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

    const data = await this.loadData()
    await this.saveData({
      ...data,
      categories: updatedCategories,
    })

    return updatedCategories
  }

  async updateUserLastLogin(users: User[], userId: string): Promise<User[]> {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          lastLogin: new Date(),
        }
      }
      return user
    })

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

  async addCategory(categories: Category[], name: string, description?: string): Promise<Category[]> {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      description,
      articles: [],
      subcategories: [],
    }

    const updatedCategories = [...categories, newCategory]

    const data = await this.loadData()
    await this.saveData({
      ...data,
      categories: updatedCategories,
    })

    return updatedCategories
  }

  async addSubcategory(
    categories: Category[],
    categoryId: string,
    name: string,
    description?: string,
  ): Promise<Category[]> {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        const newSubcategory = {
          id: Date.now().toString(),
          name,
          description,
          articles: [],
        }
        return {
          ...category,
          subcategories: [...(category.subcategories || []), newSubcategory],
        }
      }
      return category
    })

    const data = await this.loadData()
    await this.saveData({
      ...data,
      categories: updatedCategories,
    })

    return updatedCategories
  }

  async deleteCategory(categories: Category[], categoryId: string): Promise<Category[]> {
    const updatedCategories = categories.filter((category) => category.id !== categoryId)

    const data = await this.loadData()
    await this.saveData({
      ...data,
      categories: updatedCategories,
    })

    return updatedCategories
  }

  async deleteSubcategory(categories: Category[], categoryId: string, subcategoryId: string): Promise<Category[]> {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          subcategories: (category.subcategories || []).filter((sub) => sub.id !== subcategoryId),
        }
      }
      return category
    })

    const data = await this.loadData()
    await this.saveData({
      ...data,
      categories: updatedCategories,
    })

    return updatedCategories
  }

  async addUser(users: User[], userData: Omit<User, "id" | "createdAt">): Promise<User[]> {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }

    const updatedUsers = [...users, newUser]

    const data = await this.loadData()
    await this.saveData({
      ...data,
      users: updatedUsers,
    })

    return updatedUsers
  }

  async updateUser(users: User[], userId: string, updates: Partial<User>): Promise<User[]> {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, ...updates } : user))

    const data = await this.loadData()
    await this.saveData({
      ...data,
      users: updatedUsers,
    })

    return updatedUsers
  }

  async deleteUser(users: User[], userId: string): Promise<User[]> {
    const updatedUsers = users.filter((user) => user.id !== userId)

    const data = await this.loadData()
    await this.saveData({
      ...data,
      users: updatedUsers,
    })

    return updatedUsers
  }
}

export const apiDatabase = new ApiDatabase()
