import type { Article, Category, User, AuditLogEntry, KnowledgeBaseData } from "@/types/knowledge-base"

class ApiDatabase {
  private data: KnowledgeBaseData | null = null
  private isLoading = false

  async loadData(): Promise<KnowledgeBaseData> {
    if (this.data && !this.isLoading) {
      return this.data
    }

    if (this.isLoading) {
      // Wait for existing load to complete
      while (this.isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      return this.data!
    }

    this.isLoading = true
    console.log("🔍 ApiDatabase.loadData() - Fetching data from server...")

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

  async incrementPageVisits(): Promise<number> {
    try {
      const response = await fetch("/api/data/page-visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ increment: 1 }),
      })

      if (!response.ok) {
        console.warn("Failed to increment page visits")
        return 0
      }

      const result = await response.json()
      return result.totalVisits || 0
    } catch (error) {
      console.warn("Error incrementing page visits:", error)
      return 0
    }
  }

  // Article methods
  async getArticles(): Promise<Article[]> {
    const data = await this.loadData()
    return data.articles || []
  }

  async getArticle(id: string): Promise<Article | undefined> {
    const articles = await this.getArticles()
    return articles.find((article) => article.id === id)
  }

  async addArticle(article: Omit<Article, "id" | "createdAt" | "updatedAt">): Promise<Article> {
    const data = await this.loadData()
    const newArticle: Article = {
      ...article,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
    }

    data.articles = data.articles || []
    data.articles.push(newArticle)
    await this.saveData()
    return newArticle
  }

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
    const data = await this.loadData()
    const articleIndex = data.articles?.findIndex((article) => article.id === id) ?? -1

    if (articleIndex === -1) {
      throw new Error("Article not found")
    }

    const updatedArticle = {
      ...data.articles![articleIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    data.articles![articleIndex] = updatedArticle
    await this.saveData()
    return updatedArticle
  }

  async deleteArticle(id: string): Promise<void> {
    const data = await this.loadData()
    data.articles = data.articles?.filter((article) => article.id !== id) || []
    await this.saveData()
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    const data = await this.loadData()
    return data.categories || []
  }

  async addCategory(category: Omit<Category, "id">): Promise<Category> {
    const data = await this.loadData()
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    }

    data.categories = data.categories || []
    data.categories.push(newCategory)
    await this.saveData()
    return newCategory
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const data = await this.loadData()
    const categoryIndex = data.categories?.findIndex((category) => category.id === id) ?? -1

    if (categoryIndex === -1) {
      throw new Error("Category not found")
    }

    const updatedCategory = { ...data.categories![categoryIndex], ...updates }
    data.categories![categoryIndex] = updatedCategory
    await this.saveData()
    return updatedCategory
  }

  async deleteCategory(id: string): Promise<void> {
    const data = await this.loadData()
    data.categories = data.categories?.filter((category) => category.id !== id) || []
    await this.saveData()
  }

  // User methods
  async getUsers(): Promise<User[]> {
    const data = await this.loadData()
    return data.users || []
  }

  async getUser(username: string): Promise<User | undefined> {
    const users = await this.getUsers()
    return users.find((user) => user.username === username)
  }

  async addUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
    const data = await this.loadData()
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    data.users = data.users || []
    data.users.push(newUser)
    await this.saveData()
    return newUser
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const data = await this.loadData()
    const userIndex = data.users?.findIndex((user) => user.id === id) ?? -1

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    const updatedUser = { ...data.users![userIndex], ...updates }
    data.users![userIndex] = updatedUser
    await this.saveData()
    return updatedUser
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    try {
      const data = await this.loadData()
      const userIndex = data.users?.findIndex((user) => user.id === userId) ?? -1

      if (userIndex !== -1 && data.users) {
        data.users[userIndex].lastLogin = new Date().toISOString()
        await this.saveData()
      }
    } catch (error) {
      console.warn("Failed to update user last login:", error)
    }
  }

  async deleteUser(id: string): Promise<void> {
    const data = await this.loadData()
    data.users = data.users?.filter((user) => user.id !== id) || []
    await this.saveData()
  }

  // Audit log methods
  async addAuditLogEntry(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<void> {
    const data = await this.loadData()
    const newEntry: AuditLogEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }

    data.auditLog = data.auditLog || []
    data.auditLog.push(newEntry)

    // Keep only last 1000 entries
    if (data.auditLog.length > 1000) {
      data.auditLog = data.auditLog.slice(-1000)
    }

    await this.saveData()
  }

  async getAuditLog(): Promise<AuditLogEntry[]> {
    const data = await this.loadData()
    return (data.auditLog || []).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  // Authentication
  async authenticateUser(username: string, password: string): Promise<User | null> {
    try {
      const users = await this.getUsers()
      const user = users.find((u) => u.username === username && u.isActive)

      if (user && user.password === password) {
        await this.updateUserLastLogin(user.id)
        await this.addAuditLogEntry({
          action: "login",
          userId: user.id,
          details: `User ${username} logged in`,
        })
        return user
      }

      return null
    } catch (error) {
      console.error("Authentication error:", error)
      return null
    }
  }
}

export const apiDatabase = new ApiDatabase()
