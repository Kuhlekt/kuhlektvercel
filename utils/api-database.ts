import type { KnowledgeBaseData, User, Category, Article, AuditLogEntry } from "@/types/knowledge-base"

export class ApiDatabase {
  private static instance: ApiDatabase
  private data: KnowledgeBaseData | null = null

  private constructor() {}

  static getInstance(): ApiDatabase {
    if (!ApiDatabase.instance) {
      ApiDatabase.instance = new ApiDatabase()
    }
    return ApiDatabase.instance
  }

  async loadData(): Promise<KnowledgeBaseData> {
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

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to load data")
      }

      this.data = result.data
      console.log("✅ ApiDatabase.loadData() - Data loaded successfully")
      return this.data
    } catch (error) {
      console.error("❌ ApiDatabase.loadData() - Error:", error)
      throw new Error("Failed to load data from server")
    }
  }

  async saveData(data: KnowledgeBaseData): Promise<void> {
    try {
      console.log("💾 ApiDatabase.saveData() - Saving data to server...")

      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("❌ Save Error Response:", JSON.stringify(errorData))
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to save data")
      }

      this.data = data
      console.log("✅ ApiDatabase.saveData() - Data saved successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.saveData() - Error:", error)
      throw new Error("Failed to save data to server")
    }
  }

  async incrementPageVisits(): Promise<number> {
    try {
      console.log("📈 ApiDatabase.incrementPageVisits() - Incrementing page visits...")

      const response = await fetch("/api/data/page-visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to increment page visits")
      }

      console.log("✅ ApiDatabase.incrementPageVisits() - Page visits incremented")
      return result.pageVisits
    } catch (error) {
      console.error("❌ ApiDatabase.incrementPageVisits() - Error:", error)
      console.log("Failed to increment page visits")
      return 0
    }
  }

  getData(): KnowledgeBaseData | null {
    return this.data
  }

  // User methods
  getUsers(): User[] {
    return this.data?.users || []
  }

  getUserById(id: string): User | undefined {
    return this.data?.users.find((user) => user.id === id)
  }

  getUserByUsername(username: string): User | undefined {
    return this.data?.users.find((user) => user.username === username)
  }

  // Category methods
  getCategories(): Category[] {
    return this.data?.categories || []
  }

  getCategoryById(id: string): Category | undefined {
    return this.data?.categories.find((category) => category.id === id)
  }

  // Article methods
  getArticles(): Article[] {
    return this.data?.articles || []
  }

  getArticleById(id: string): Article | undefined {
    return this.data?.articles.find((article) => article.id === id)
  }

  getArticlesByCategory(categoryId: string): Article[] {
    return this.data?.articles.filter((article) => article.categoryId === categoryId) || []
  }

  // Audit log methods
  getAuditLog(): AuditLogEntry[] {
    return this.data?.auditLog || []
  }

  addAuditLogEntry(entry: Omit<AuditLogEntry, "id" | "timestamp">): void {
    if (!this.data) return

    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    this.data.auditLog = this.data.auditLog || []
    this.data.auditLog.unshift(newEntry)
  }
}

export const apiDatabase = ApiDatabase.getInstance()
