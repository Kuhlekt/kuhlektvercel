import type { User, Category, Article, AuditLogEntry } from "@/types/knowledge-base"

interface DatabaseData {
  categories?: Category[]
  articles?: Article[]
  users?: User[]
  auditLog?: AuditLogEntry[]
  pageVisits?: number
}

interface ExportData extends DatabaseData {
  settings?: {
    exportedAt: string
    version: string
  }
  exportedAt?: string
  version?: string
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

  async exportData(): Promise<ExportData> {
    try {
      console.log("📤 ApiDatabase.exportData() - Exporting all data...")

      // Load current data
      const data = await this.loadData()

      // Create export object with metadata
      const exportData: ExportData = {
        ...data,
        settings: {
          exportedAt: new Date().toISOString(),
          version: "1.0.0",
        },
        exportedAt: new Date().toISOString(),
        version: "1.0.0",
      }

      console.log("✅ ApiDatabase.exportData() - Data exported successfully:", {
        categories: exportData.categories?.length || 0,
        articles: exportData.articles?.length || 0,
        users: exportData.users?.length || 0,
        auditLog: exportData.auditLog?.length || 0,
        pageVisits: exportData.pageVisits || 0,
      })

      return exportData
    } catch (error) {
      console.error("❌ ApiDatabase.exportData() - Error:", error)
      throw new Error(`Failed to export data: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async importData(importData: ExportData): Promise<void> {
    try {
      console.log("📥 ApiDatabase.importData() - Importing data...")
      console.log("📊 Import data structure:", {
        categories: importData.categories?.length || 0,
        articles: importData.articles?.length || 0,
        users: importData.users?.length || 0,
        auditLog: importData.auditLog?.length || 0,
        pageVisits: importData.pageVisits || 0,
      })

      // Validate import data structure
      if (!importData || typeof importData !== "object") {
        throw new Error("Invalid import data format")
      }

      // Prepare data for import (exclude metadata)
      const dataToImport: DatabaseData = {
        categories: Array.isArray(importData.categories) ? importData.categories : [],
        articles: Array.isArray(importData.articles) ? importData.articles : [],
        users: Array.isArray(importData.users) ? importData.users : [],
        auditLog: Array.isArray(importData.auditLog) ? importData.auditLog : [],
        pageVisits: typeof importData.pageVisits === "number" ? importData.pageVisits : 0,
      }

      // Add import audit log entry
      const importAuditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        userId: "system",
        username: "System",
        action: "data_import",
        details: `Imported ${dataToImport.categories?.length || 0} categories, ${dataToImport.articles?.length || 0} articles, ${dataToImport.users?.length || 0} users`,
        ipAddress: "127.0.0.1",
      }

      dataToImport.auditLog = [...(dataToImport.auditLog || []), importAuditEntry]

      // Save the imported data
      await this.saveData(dataToImport)

      console.log("✅ ApiDatabase.importData() - Data imported successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.importData() - Error:", error)
      throw new Error(`Failed to import data: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async clearAllData(): Promise<void> {
    try {
      console.log("🗑️ ApiDatabase.clearAllData() - Clearing all data...")

      // Create empty data structure with system audit entry
      const clearAuditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        userId: "system",
        username: "System",
        action: "data_clear",
        details: "All data cleared by administrator",
        ipAddress: "127.0.0.1",
      }

      const emptyData: DatabaseData = {
        categories: [],
        articles: [],
        users: [],
        auditLog: [clearAuditEntry],
        pageVisits: 0,
      }

      // Save empty data
      await this.saveData(emptyData)

      console.log("✅ ApiDatabase.clearAllData() - All data cleared successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.clearAllData() - Error:", error)
      throw new Error(`Failed to clear data: ${error instanceof Error ? error.message : "Unknown error"}`)
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
