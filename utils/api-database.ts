import type { KnowledgeBaseData, User, Article, Category, AuditLog } from "@/types/knowledge-base"

class ApiDatabase {
  private cache: KnowledgeBaseData | null = null
  private cacheExpiry = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private async fetchData(): Promise<KnowledgeBaseData> {
    const now = Date.now()

    if (this.cache && now < this.cacheExpiry) {
      return this.cache
    }

    try {
      const response = await fetch("/api/data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      this.cache = data
      this.cacheExpiry = now + this.CACHE_DURATION

      return data
    } catch (error) {
      console.error("Error fetching data:", error)
      throw new Error("Failed to fetch data from server")
    }
  }

  private async saveData(data: KnowledgeBaseData): Promise<void> {
    try {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      // Update cache
      this.cache = data
      this.cacheExpiry = Date.now() + this.CACHE_DURATION
    } catch (error) {
      console.error("Error saving data:", error)
      throw new Error("Failed to save data to server")
    }
  }

  private invalidateCache(): void {
    this.cache = null
    this.cacheExpiry = 0
  }

  async getAllData(): Promise<KnowledgeBaseData> {
    return await this.fetchData()
  }

  async getUsers(): Promise<User[]> {
    const data = await this.fetchData()
    return data.users || []
  }

  async getArticles(): Promise<Article[]> {
    const data = await this.fetchData()
    return data.articles || []
  }

  async getCategories(): Promise<Category[]> {
    const data = await this.fetchData()
    return data.categories || []
  }

  async getAuditLog(): Promise<AuditLog[]> {
    const data = await this.fetchData()
    return data.auditLog || []
  }

  async addUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
    const data = await this.fetchData()
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    data.users.push(newUser)
    await this.saveData(data)
    return newUser
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const data = await this.fetchData()
    const userIndex = data.users.findIndex((u) => u.id === id)

    if (userIndex === -1) return null

    data.users[userIndex] = { ...data.users[userIndex], ...updates }
    await this.saveData(data)
    return data.users[userIndex]
  }

  async deleteUser(id: string): Promise<boolean> {
    const data = await this.fetchData()
    const initialLength = data.users.length
    data.users = data.users.filter((u) => u.id !== id)

    if (data.users.length < initialLength) {
      await this.saveData(data)
      return true
    }
    return false
  }

  async addArticle(article: Omit<Article, "id" | "createdAt" | "updatedAt" | "views">): Promise<Article> {
    const data = await this.fetchData()
    const newArticle: Article = {
      ...article,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
    }

    data.articles.push(newArticle)
    await this.saveData(data)
    return newArticle
  }

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
    const data = await this.fetchData()
    const articleIndex = data.articles.findIndex((a) => a.id === id)

    if (articleIndex === -1) return null

    data.articles[articleIndex] = {
      ...data.articles[articleIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    await this.saveData(data)
    return data.articles[articleIndex]
  }

  async deleteArticle(id: string): Promise<boolean> {
    const data = await this.fetchData()
    const initialLength = data.articles.length
    data.articles = data.articles.filter((a) => a.id !== id)

    if (data.articles.length < initialLength) {
      await this.saveData(data)
      return true
    }
    return false
  }

  async addCategory(category: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<Category> {
    const data = await this.fetchData()
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    data.categories.push(newCategory)
    await this.saveData(data)
    return newCategory
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    const data = await this.fetchData()
    const categoryIndex = data.categories.findIndex((c) => c.id === id)

    if (categoryIndex === -1) return null

    data.categories[categoryIndex] = {
      ...data.categories[categoryIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    await this.saveData(data)
    return data.categories[categoryIndex]
  }

  async deleteCategory(id: string): Promise<boolean> {
    const data = await this.fetchData()
    const initialLength = data.categories.length
    data.categories = data.categories.filter((c) => c.id !== id)

    if (data.categories.length < initialLength) {
      await this.saveData(data)
      return true
    }
    return false
  }

  async addAuditLog(log: Omit<AuditLog, "id" | "timestamp">): Promise<AuditLog> {
    const data = await this.fetchData()
    const newLog: AuditLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }

    data.auditLog.push(newLog)
    await this.saveData(data)
    return newLog
  }

  async incrementPageVisits(articleId: string): Promise<number> {
    try {
      const response = await fetch("/api/data/page-visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articleId }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      this.invalidateCache() // Invalidate cache since data changed
      return result.views || 0
    } catch (error) {
      console.error("Error incrementing page visits:", error)
      return 0
    }
  }

  async searchArticles(query: string): Promise<Article[]> {
    const data = await this.fetchData()
    const searchTerm = query.toLowerCase()

    return data.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )
  }

  async getArticlesByCategory(categoryId: string): Promise<Article[]> {
    const data = await this.fetchData()
    return data.articles.filter((article) => article.categoryId === categoryId)
  }

  async getStats() {
    const data = await this.fetchData()
    return data.stats
  }
}

export const apiDatabase = new ApiDatabase()
