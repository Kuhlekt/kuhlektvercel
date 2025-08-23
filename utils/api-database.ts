import type { KnowledgeBaseData, User, Category, Article, AuditLogEntry } from "@/types/knowledge-base"

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

  async saveData(): Promise<void> {
    if (!this.data) {
      throw new Error("No data to save")
    }

    try {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log("✅ Data saved successfully")
    } catch (error) {
      console.error("❌ Error saving data:", error)
      throw new Error("Failed to save data")
    }
  }

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
        return
      }

      const result = await response.json()
      if (this.data) {
        this.data.pageVisits = result.count
      }
    } catch (error) {
      console.warn("Failed to increment page visits:", error)
    }
  }

  // User methods
  async getUsers(): Promise<User[]> {
    const data = await this.loadData()
    return data.users || []
  }

  async getUserByCredentials(username: string, password: string): Promise<User | null> {
    const users = await this.getUsers()
    return users.find((u) => u.username === username && u.password === password && u.isActive) || null
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    try {
      const data = await this.loadData()
      const user = data.users.find((u) => u.id === userId)
      if (user) {
        user.lastLogin = new Date().toISOString()
        await this.saveData()
      }
    } catch (error) {
      console.error("Failed to update user last login:", error)
      throw error
    }
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    const data = await this.loadData()
    return data.categories || []
  }

  async addCategory(category: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<Category> {
    const data = await this.loadData()
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    data.categories.push(newCategory)
    await this.saveData()
    return newCategory
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    const data = await this.loadData()
    const index = data.categories.findIndex((c) => c.id === id)
    if (index !== -1) {
      data.categories[index] = {
        ...data.categories[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      await this.saveData()
    }
  }

  async deleteCategory(id: string): Promise<void> {
    const data = await this.loadData()
    data.categories = data.categories.filter((c) => c.id !== id)
    await this.saveData()
  }

  // Article methods
  async getArticles(): Promise<Article[]> {
    const data = await this.loadData()
    return data.articles || []
  }

  async getArticleById(id: string): Promise<Article | null> {
    const articles = await this.getArticles()
    return articles.find((a) => a.id === id) || null
  }

  async addArticle(article: Omit<Article, "id" | "createdAt" | "updatedAt" | "viewCount">): Promise<Article> {
    const data = await this.loadData()
    const newArticle: Article = {
      ...article,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
    }
    data.articles.push(newArticle)
    await this.saveData()
    return newArticle
  }

  async updateArticle(id: string, updates: Partial<Article>): Promise<void> {
    const data = await this.loadData()
    const index = data.articles.findIndex((a) => a.id === id)
    if (index !== -1) {
      data.articles[index] = {
        ...data.articles[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      await this.saveData()
    }
  }

  async deleteArticle(id: string): Promise<void> {
    const data = await this.loadData()
    data.articles = data.articles.filter((a) => a.id !== id)
    await this.saveData()
  }

  async incrementArticleViews(id: string): Promise<void> {
    const data = await this.loadData()
    const article = data.articles.find((a) => a.id === id)
    if (article) {
      article.viewCount = (article.viewCount || 0) + 1
      article.lastViewedAt = new Date().toISOString()
      await this.saveData()
    }
  }

  // Audit log methods
  async addAuditLogEntry(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<void> {
    const data = await this.loadData()
    const newEntry: AuditLogEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }
    if (!data.auditLog) {
      data.auditLog = []
    }
    data.auditLog.push(newEntry)
    await this.saveData()
  }

  async getAuditLog(): Promise<AuditLogEntry[]> {
    const data = await this.loadData()
    return (data.auditLog || []).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  // Search methods
  async searchArticles(query: string): Promise<Article[]> {
    const articles = await this.getArticles()
    const searchTerm = query.toLowerCase()

    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )
  }

  // Data management
  async exportData(): Promise<KnowledgeBaseData> {
    return await this.loadData()
  }

  async importData(newData: KnowledgeBaseData): Promise<void> {
    this.data = newData
    await this.saveData()
  }

  async clearCache(): void {
    this.data = null
  }
}

export const apiDatabase = new ApiDatabase()
