import type { KnowledgeBaseData, User, Category, Article, AuditLogEntry, PageVisit } from "@/types/knowledge-base"

export class ApiDatabase {
  private baseUrl: string

  constructor() {
    this.baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  }

  async loadData(): Promise<KnowledgeBaseData> {
    try {
      console.log("🔍 ApiDatabase.loadData() - Fetching data from server...")

      const response = await fetch(`${this.baseUrl}/api/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "load" }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("✅ ApiDatabase.loadData() - Data loaded successfully")
      return data
    } catch (error) {
      console.error("❌ ApiDatabase.loadData() - Error:", error)
      throw new Error("Failed to load data from server")
    }
  }

  async saveData(data: KnowledgeBaseData): Promise<void> {
    try {
      console.log("💾 ApiDatabase.saveData() - Saving data to server...")

      const response = await fetch(`${this.baseUrl}/api/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "save", data }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log("✅ ApiDatabase.saveData() - Data saved successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.saveData() - Error:", error)
      throw new Error("Failed to save data to server")
    }
  }

  async importData(data: KnowledgeBaseData): Promise<void> {
    try {
      console.log("📥 ApiDatabase.importData() - Importing data to server...")

      const response = await fetch(`${this.baseUrl}/api/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "import", data }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log("✅ ApiDatabase.importData() - Data imported successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.importData() - Error:", error)
      throw new Error("Failed to import data to server")
    }
  }

  async addArticle(article: Omit<Article, "id" | "createdAt" | "updatedAt">): Promise<Article> {
    try {
      const data = await this.loadData()

      const newArticle: Article = {
        ...article,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      data.articles.push(newArticle)
      await this.saveData(data)

      return newArticle
    } catch (error) {
      console.error("❌ ApiDatabase.addArticle() - Error:", error)
      throw new Error("Failed to add article")
    }
  }

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
    try {
      const data = await this.loadData()
      const articleIndex = data.articles.findIndex((a) => a.id === id)

      if (articleIndex === -1) {
        throw new Error("Article not found")
      }

      const updatedArticle = {
        ...data.articles[articleIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      data.articles[articleIndex] = updatedArticle
      await this.saveData(data)

      return updatedArticle
    } catch (error) {
      console.error("❌ ApiDatabase.updateArticle() - Error:", error)
      throw new Error("Failed to update article")
    }
  }

  async deleteArticle(id: string): Promise<void> {
    try {
      const data = await this.loadData()
      data.articles = data.articles.filter((a) => a.id !== id)
      await this.saveData(data)
    } catch (error) {
      console.error("❌ ApiDatabase.deleteArticle() - Error:", error)
      throw new Error("Failed to delete article")
    }
  }

  async addCategory(category: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<Category> {
    try {
      const data = await this.loadData()

      const newCategory: Category = {
        ...category,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      data.categories.push(newCategory)
      await this.saveData(data)

      return newCategory
    } catch (error) {
      console.error("❌ ApiDatabase.addCategory() - Error:", error)
      throw new Error("Failed to add category")
    }
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    try {
      const data = await this.loadData()
      const categoryIndex = data.categories.findIndex((c) => c.id === id)

      if (categoryIndex === -1) {
        throw new Error("Category not found")
      }

      const updatedCategory = {
        ...data.categories[categoryIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      data.categories[categoryIndex] = updatedCategory
      await this.saveData(data)

      return updatedCategory
    } catch (error) {
      console.error("❌ ApiDatabase.updateCategory() - Error:", error)
      throw new Error("Failed to update category")
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const data = await this.loadData()
      data.categories = data.categories.filter((c) => c.id !== id)
      await this.saveData(data)
    } catch (error) {
      console.error("❌ ApiDatabase.deleteCategory() - Error:", error)
      throw new Error("Failed to delete category")
    }
  }

  async addUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    try {
      const data = await this.loadData()

      const newUser: User = {
        ...user,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      data.users.push(newUser)
      await this.saveData(data)

      return newUser
    } catch (error) {
      console.error("❌ ApiDatabase.addUser() - Error:", error)
      throw new Error("Failed to add user")
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    try {
      const data = await this.loadData()
      const userIndex = data.users.findIndex((u) => u.id === id)

      if (userIndex === -1) {
        throw new Error("User not found")
      }

      const updatedUser = {
        ...data.users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      data.users[userIndex] = updatedUser
      await this.saveData(data)

      return updatedUser
    } catch (error) {
      console.error("❌ ApiDatabase.updateUser() - Error:", error)
      throw new Error("Failed to update user")
    }
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    try {
      const data = await this.loadData()
      const userIndex = data.users.findIndex((u) => u.id === userId)

      if (userIndex !== -1) {
        data.users[userIndex].lastLogin = new Date().toISOString()
        data.users[userIndex].updatedAt = new Date().toISOString()
        await this.saveData(data)
      }
    } catch (error) {
      console.error("❌ ApiDatabase.updateUserLastLogin() - Error:", error)
      // Don't throw error for login tracking failure
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const data = await this.loadData()
      data.users = data.users.filter((u) => u.id !== id)
      await this.saveData(data)
    } catch (error) {
      console.error("❌ ApiDatabase.deleteUser() - Error:", error)
      throw new Error("Failed to delete user")
    }
  }

  async addAuditLogEntry(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<AuditLogEntry> {
    try {
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
      await this.saveData(data)

      return newEntry
    } catch (error) {
      console.error("❌ ApiDatabase.addAuditLogEntry() - Error:", error)
      throw new Error("Failed to add audit log entry")
    }
  }

  async recordPageVisit(page: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/data/page-visits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("❌ ApiDatabase.recordPageVisit() - Error:", error)
      // Don't throw error for page visit tracking failure
    }
  }

  async getPageVisits(): Promise<PageVisit[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/data/page-visits`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.pageVisits || []
    } catch (error) {
      console.error("❌ ApiDatabase.getPageVisits() - Error:", error)
      return []
    }
  }
}

export const apiDatabase = new ApiDatabase()
