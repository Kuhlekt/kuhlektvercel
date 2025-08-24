import type { User, Category, Article, AuditLogEntry } from "@/types/knowledge-base"

interface DatabaseData {
  categories?: Category[]
  articles?: Article[]
  users?: User[]
  auditLog?: AuditLogEntry[]
  pageVisits?: number
}

class ApiDatabase {
  private baseUrl = ""
  private cache: DatabaseData | null = null
  private isLoading = false

  async loadData(): Promise<DatabaseData> {
    if (this.isLoading) {
      // Wait for current load to complete
      while (this.isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      return this.cache || {}
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

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to load data")
      }

      if (result.warning) {
        console.warn("⚠️", result.warning)
      }

      this.cache = result.data || {}
      console.log("✅ ApiDatabase.loadData() - Data loaded successfully:", {
        categories: result.data?.categories?.length || 0,
        articles: result.data?.articles?.length || 0,
        users: result.data?.users?.length || 0,
        auditLog: result.data?.auditLog?.length || 0,
        pageVisits: result.data?.pageVisits || 0,
      })

      return this.cache
    } catch (error) {
      console.error("❌ ApiDatabase.loadData() - Error:", error)

      // Return cached data if available, otherwise empty data
      const fallbackData = this.cache || {
        categories: [],
        articles: [],
        users: [],
        auditLog: [],
        pageVisits: 0,
      }

      console.warn("⚠️ Returning fallback data due to error")
      return fallbackData
    } finally {
      this.isLoading = false
    }
  }

  async saveData(data: DatabaseData): Promise<void> {
    try {
      console.log("💾 ApiDatabase.saveData() - Saving data to server...")
      console.log("📊 Data structure being saved:", {
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

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Save operation failed")
      }

      // Update local cache
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

      // Update cache if available
      if (this.cache) {
        this.cache.pageVisits = result.pageVisits
      }

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

  getCachedData(): DatabaseData | null {
    return this.cache
  }
}

// Export singleton instance
export const apiDatabase = new ApiDatabase()
