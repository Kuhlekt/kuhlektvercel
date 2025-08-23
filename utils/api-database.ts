import type { KnowledgeBaseData, User, Category, Article, AuditLogEntry } from "@/types/knowledge-base"

export class ApiDatabase {
  private static instance: ApiDatabase
  private data: KnowledgeBaseData = {
    categories: [],
    articles: [],
    users: [],
    auditLog: [],
    pageVisits: 0,
  }

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

      const data = await response.json()

      // Ensure all required properties exist
      this.data = {
        categories: Array.isArray(data.categories) ? data.categories : [],
        articles: Array.isArray(data.articles) ? data.articles : [],
        users: Array.isArray(data.users) ? data.users : [],
        auditLog: Array.isArray(data.auditLog) ? data.auditLog : [],
        pageVisits: typeof data.pageVisits === "number" ? data.pageVisits : 0,
      }

      console.log("✅ ApiDatabase.loadData() - Data received:", {
        categories: this.data.categories.length,
        users: this.data.users.length,
        usernames: this.data.users.map((u) => u.username),
        auditLog: this.data.auditLog.length,
        pageVisits: this.data.pageVisits,
      })

      return this.data
    } catch (error) {
      console.error("❌ ApiDatabase.loadData() - Error loading data:", error)
      throw new Error(`Failed to load data from server: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async saveData(): Promise<void> {
    try {
      console.log("💾 ApiDatabase.saveData() - Saving data to server...")

      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`HTTP error! status: ${response.status}${errorData.error ? ` - ${errorData.error}` : ""}`)
      }

      console.log("✅ ApiDatabase.saveData() - Data saved successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.saveData() - Error saving data:", error)
      throw new Error(`Failed to save data to server: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async incrementPageVisits(): Promise<void> {
    try {
      console.log("📈 ApiDatabase.incrementPageVisits() - Incrementing page visits...")

      const response = await fetch("/api/data/page-visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const result = await response.json()
        this.data.pageVisits = result.pageVisits || this.data.pageVisits
        console.log("✅ ApiDatabase.incrementPageVisits() - Page visits incremented:", this.data.pageVisits)
      } else {
        console.log("⚠️ Failed to increment page visits, continuing...")
      }
    } catch (error) {
      console.log("⚠️ Failed to increment page visits, continuing...", error)
      // Don't throw error - this shouldn't block the app
    }
  }

  async importData(importedData: Partial<KnowledgeBaseData>): Promise<void> {
    try {
      console.log("📥 ApiDatabase.importData() - Starting data import...")

      // Validate and merge imported data
      if (importedData.categories && Array.isArray(importedData.categories)) {
        this.data.categories = importedData.categories
      }
      if (importedData.articles && Array.isArray(importedData.articles)) {
        this.data.articles = importedData.articles
      }
      if (importedData.users && Array.isArray(importedData.users)) {
        this.data.users = importedData.users
      }
      if (importedData.auditLog && Array.isArray(importedData.auditLog)) {
        this.data.auditLog = importedData.auditLog
      }
      if (typeof importedData.pageVisits === "number") {
        this.data.pageVisits = importedData.pageVisits
      }

      await this.saveData()
      console.log("✅ ApiDatabase.importData() - Data imported successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.importData() - Error importing data:", error)
      throw new Error(`Failed to import data to server: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // User management methods
  async updateUserLastLogin(userId: string): Promise<void> {
    try {
      console.log("👤 ApiDatabase.updateUserLastLogin() - Updating last login for user:", userId)

      const user = this.data.users.find((u) => u.id === userId)
      if (user) {
        user.lastLogin = new Date().toISOString()
        await this.saveData()
        console.log("✅ ApiDatabase.updateUserLastLogin() - Last login updated")
      }
    } catch (error) {
      console.error("❌ ApiDatabase.updateUserLastLogin() - Error updating last login:", error)
      throw error
    }
  }

  // Getter methods
  getCategories(): Category[] {
    return this.data.categories || []
  }

  getArticles(): Article[] {
    return this.data.articles || []
  }

  getUsers(): User[] {
    return this.data.users || []
  }

  getAuditLog(): AuditLogEntry[] {
    return this.data.auditLog || []
  }

  getPageVisits(): number {
    return this.data.pageVisits || 0
  }

  getData(): KnowledgeBaseData {
    return { ...this.data }
  }

  // Setter methods for direct updates
  setData(newData: KnowledgeBaseData): void {
    this.data = { ...newData }
  }

  addAuditLogEntry(entry: Omit<AuditLogEntry, "id" | "timestamp">): void {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }
    this.data.auditLog = [...(this.data.auditLog || []), newEntry]
  }
}
