import type { KnowledgeBaseData } from "../types/knowledge-base"

class ApiDatabase {
  private cache: KnowledgeBaseData | null = null
  private cacheTimestamp = 0
  private readonly CACHE_DURATION = 5000 // 5 seconds

  async loadData(): Promise<KnowledgeBaseData> {
    try {
      // Check cache first
      if (this.cache && Date.now() - this.cacheTimestamp < this.CACHE_DURATION) {
        console.log("📦 Using cached data")
        return this.cache
      }

      console.log("🌐 Fetching data from API...")
      const response = await fetch("/api/data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Ensure data structure is complete
      const completeData: KnowledgeBaseData = {
        categories: data.categories || [],
        articles: data.articles || [],
        users: data.users || [],
        auditLog: data.auditLog || [],
        pageVisits: data.pageVisits || 0,
        ...data,
      }

      // Update cache
      this.cache = completeData
      this.cacheTimestamp = Date.now()

      console.log("✅ Data loaded successfully:", {
        categories: completeData.categories.length,
        articles: completeData.articles.length,
        users: completeData.users.length,
        auditLog: completeData.auditLog.length,
        pageVisits: completeData.pageVisits,
      })

      return completeData
    } catch (error) {
      console.error("❌ Failed to load data:", error)

      // Return fallback data structure
      const fallbackData: KnowledgeBaseData = {
        categories: [],
        articles: [],
        users: [],
        auditLog: [],
        pageVisits: 0,
      }

      return fallbackData
    }
  }

  async saveData(data: Partial<KnowledgeBaseData>): Promise<void> {
    try {
      console.log("💾 Saving data to API...")
      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Clear cache to force refresh
      this.clearCache()
      console.log("✅ Data saved successfully")
    } catch (error) {
      console.error("❌ Failed to save data:", error)
      throw error
    }
  }

  async incrementPageVisits(): Promise<number> {
    try {
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
      return result.pageVisits || 0
    } catch (error) {
      console.error("❌ Failed to increment page visits:", error)
      return 0
    }
  }

  async exportData(): Promise<string> {
    try {
      const data = await this.loadData()
      const exportData = {
        ...data,
        exportedAt: new Date().toISOString(),
        version: "1.0",
        metadata: {
          totalCategories: data.categories.length,
          totalArticles: data.articles.length,
          totalUsers: data.users.length,
          totalAuditEntries: data.auditLog.length,
        },
      }
      return JSON.stringify(exportData, null, 2)
    } catch (error) {
      console.error("❌ Failed to export data:", error)
      throw error
    }
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const importedData = JSON.parse(jsonData)

      // Validate data structure
      if (!importedData.categories || !Array.isArray(importedData.categories)) {
        throw new Error("Invalid data format: categories must be an array")
      }
      if (!importedData.articles || !Array.isArray(importedData.articles)) {
        throw new Error("Invalid data format: articles must be an array")
      }
      if (!importedData.users || !Array.isArray(importedData.users)) {
        throw new Error("Invalid data format: users must be an array")
      }

      // Save imported data
      await this.saveData({
        categories: importedData.categories,
        articles: importedData.articles,
        users: importedData.users,
        auditLog: importedData.auditLog || [],
        pageVisits: importedData.pageVisits || 0,
      })

      console.log("✅ Data imported successfully")
    } catch (error) {
      console.error("❌ Failed to import data:", error)
      throw error
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await this.saveData({
        categories: [],
        articles: [],
        users: [],
        auditLog: [
          {
            id: Date.now().toString(),
            action: "clear_all_data",
            performedBy: "system",
            timestamp: new Date().toISOString(),
            details: "All data cleared by administrator",
          },
        ],
        pageVisits: 0,
      })
      console.log("✅ All data cleared successfully")
    } catch (error) {
      console.error("❌ Failed to clear data:", error)
      throw error
    }
  }

  clearCache(): void {
    this.cache = null
    this.cacheTimestamp = 0
    console.log("🗑️ Cache cleared")
  }

  getCachedData(): KnowledgeBaseData | null {
    if (this.cache && Date.now() - this.cacheTimestamp < this.CACHE_DURATION) {
      return this.cache
    }
    return null
  }
}

export const apiDatabase = new ApiDatabase()
