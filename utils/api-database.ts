import type { KnowledgeBaseData, User, Category, Article, AuditLogEntry } from "@/types/knowledge-base"

interface ApiResponse {
  success: boolean
  data?: KnowledgeBaseData
  error?: string
  message?: string
  timestamp?: string
}

interface DatabaseData {
  categories?: Category[]
  articles?: Article[]
  users?: User[]
  auditLog?: AuditLogEntry[]
  pageVisits?: number
}

class ApiDatabase {
  private baseUrl = ""
  private cache: KnowledgeBaseData | null = null
  private isLoading = false

  async loadData(): Promise<KnowledgeBaseData> {
    if (this.isLoading) {
      // Wait for current load to complete
      while (this.isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      return this.cache!
    }

    this.isLoading = true
    try {
      console.log("🔍 ApiDatabase.loadData() - Fetching data from server...")

      const response = await fetch("/api/data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Always fetch fresh data
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result: ApiResponse = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error || "Invalid response from server")
      }

      this.cache = result.data
      console.log("✅ ApiDatabase.loadData() - Data loaded successfully:", {
        categories: result.data.categories?.length || 0,
        articles: result.data.articles?.length || 0,
        users: result.data.users?.length || 0,
        auditLog: result.data.auditLog?.length || 0,
      })

      return result.data
    } catch (error) {
      console.error("❌ ApiDatabase.loadData() - Error:", error)
      throw new Error(`Failed to load data: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      this.isLoading = false
    }
  }

  async saveData(data: KnowledgeBaseData): Promise<void> {
    try {
      console.log("💾 ApiDatabase.saveData() - Saving data to server...")
      console.log("📊 Data structure:", {
        categories: data.categories?.length || 0,
        articles: data.articles?.length || 0,
        users: data.users?.length || 0,
        auditLog: data.auditLog?.length || 0,
        pageVisits: data.pageVisits,
      })

      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("❌ Save Error Response:", errorData)
        throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`)
      }

      const result: ApiResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Save operation failed")
      }

      // Update cache
      this.cache = data
      console.log("✅ ApiDatabase.saveData() - Data saved successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.saveData() - Error:", error)
      throw new Error(`Failed to save data: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async incrementPageVisits(): Promise<number> {
    try {
      console.log("📈 ApiDatabase.incrementPageVisits() - Incrementing...")

      const response = await fetch("/api/data/page-visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to increment page visits")
      }

      console.log("✅ Page visits incremented to:", result.pageVisits)
      return result.pageVisits || 0
    } catch (error) {
      console.warn("⚠️ Failed to increment page visits:", error)
      // Don't throw error for page visits - it's not critical
      return 0
    }
  }

  clearCache(): void {
    this.cache = null
    console.log("🗑️ ApiDatabase cache cleared")
  }

  getCachedData(): KnowledgeBaseData | null {
    return this.cache
  }

  async addAuditEntry(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<void> {
    const data = await this.loadData()

    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    data.auditLog = data.auditLog || []
    data.auditLog.unshift(newEntry) // Add to beginning

    // Keep only last 1000 entries
    if (data.auditLog.length > 1000) {
      data.auditLog = data.auditLog.slice(0, 1000)
    }

    await this.saveData(data)
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    const data = await this.loadData()

    data.users = data.users.map((user) =>
      user.id === userId ? { ...user, lastLogin: new Date().toISOString() } : user,
    )

    await this.saveData(data)
  }

  // Data validation
  validateData(data: any): data is KnowledgeBaseData {
    return (
      data &&
      typeof data === "object" &&
      Array.isArray(data.categories) &&
      Array.isArray(data.users) &&
      Array.isArray(data.auditLog)
    )
  }
}

// Export singleton instance
export const apiDatabase = new ApiDatabase()

// Export class for testing
export { ApiDatabase }
