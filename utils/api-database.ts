import type { Category, User, AuditLogEntry } from "@/types/knowledge-base"

interface DatabaseData {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  pageVisits: number
}

class ApiDatabase {
  private baseUrl = "/api/data"

  // Load all data from server
  async loadData(): Promise<DatabaseData> {
    console.log("🔍 ApiDatabase.loadData() - Fetching data from server...")
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "load" }),
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to load data")
      }

      console.log("✅ ApiDatabase.loadData() - Data received:", {
        categories: data.categories?.length || 0,
        users: data.users?.length || 0,
        usernames: data.users?.map((u: User) => u.username) || [],
        auditLog: data.auditLog?.length || 0,
        pageVisits: data.pageVisits || 0,
      })

      // Ensure all arrays exist
      return {
        categories: Array.isArray(data.categories) ? data.categories : [],
        users: Array.isArray(data.users) ? data.users : [],
        auditLog: Array.isArray(data.auditLog) ? data.auditLog : [],
        pageVisits: typeof data.pageVisits === "number" ? data.pageVisits : 0,
      }
    } catch (error) {
      console.error("❌ ApiDatabase.loadData() - Error:", error)
      throw new Error(`Failed to load data from server`)
    }
  }

  // Save all data to server with better error handling
  async saveData(data: Partial<DatabaseData>): Promise<void> {
    console.log("💾 ApiDatabase.saveData() - Saving data to server...")
    try {
      // Validate data structure before sending
      const validatedData = {
        categories: Array.isArray(data.categories) ? data.categories : [],
        users: Array.isArray(data.users) ? data.users : [],
        auditLog: Array.isArray(data.auditLog) ? data.auditLog : [],
        pageVisits: typeof data.pageVisits === "number" ? data.pageVisits : 0,
      }

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "save", data: validatedData }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || "Save operation failed")
      }

      console.log("✅ ApiDatabase.saveData() - Data saved successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.saveData() - Error saving data:", error)
      throw new Error(`Failed to save data to server`)
    }
  }

  // Increment page visits with graceful failure
  async incrementPageVisits(): Promise<number> {
    console.log("📈 ApiDatabase.incrementPageVisits() - Incrementing page visits...")
    try {
      const response = await fetch(`${this.baseUrl}/page-visits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        console.warn("⚠️ Failed to increment page visits, continuing...")
        return 0
      }

      const data = await response.json()

      if (data.success) {
        console.log(`✅ ApiDatabase.incrementPageVisits() - Success: ${data.pageVisits}`)
        return data.pageVisits || 0
      } else {
        console.warn("⚠️ Page visits increment returned failure, continuing...")
        return 0
      }
    } catch (error) {
      console.warn("⚠️ Error incrementing page visits:", error)
      return 0
    }
  }

  // Update user last login - FIXED: expects userId string, not users array
  async updateUserLastLogin(users: User[], userId: string): Promise<User[]> {
    console.log("👤 ApiDatabase.updateUserLastLogin() - Updating last login for user:", userId)

    try {
      // Validate inputs
      if (!Array.isArray(users)) {
        throw new Error("Users parameter must be an array")
      }

      if (!userId || typeof userId !== "string") {
        throw new Error("UserId parameter must be a string")
      }

      const updatedUsers = users.map((user) => (user.id === userId ? { ...user, lastLogin: new Date() } : user))

      // Save to server
      await this.saveData({ users: updatedUsers })

      console.log("✅ User last login updated successfully")
      return updatedUsers
    } catch (error) {
      console.error("❌ ApiDatabase.updateUserLastLogin() - Error:", error)
      throw new Error(`Failed to update last login`)
    }
  }

  // Add audit entry
  async addAuditEntry(
    auditLog: AuditLogEntry[],
    entry: {
      action: string
      articleId?: string
      articleTitle?: string
      categoryId?: string
      categoryName?: string
      subcategoryName?: string
      userId?: string
      username?: string
      performedBy: string
      details: string
    },
  ): Promise<AuditLogEntry[]> {
    console.log("📋 ApiDatabase.addAuditEntry() - Adding audit entry:", entry.action)

    try {
      // Validate inputs
      if (!Array.isArray(auditLog)) {
        throw new Error("AuditLog parameter must be an array")
      }

      const newEntry: AuditLogEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        username: entry.performedBy,
        ...entry,
      }

      const updatedAuditLog = [newEntry, ...auditLog]

      // Keep only last 1000 entries
      if (updatedAuditLog.length > 1000) {
        updatedAuditLog.splice(1000)
      }

      // Save to server
      await this.saveData({ auditLog: updatedAuditLog })

      console.log("✅ Audit entry added successfully")
      return updatedAuditLog
    } catch (error) {
      console.error("❌ ApiDatabase.addAuditEntry() - Error:", error)
      throw new Error(`Failed to add audit entry`)
    }
  }

  // Import data with better error handling
  async importData(importData: any): Promise<void> {
    try {
      console.log("📥 ApiDatabase.importData() - Starting data import...")

      if (!importData || typeof importData !== "object") {
        throw new Error("Invalid import data structure")
      }

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "import", data: importData }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || "Import operation failed")
      }

      console.log("✅ ApiDatabase.importData() - Data imported successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.importData() - Error importing data:", error)
      throw new Error(`Failed to import data to server`)
    }
  }

  // Export data
  async exportData(): Promise<any> {
    try {
      console.log("📤 ApiDatabase.exportData() - Starting data export...")

      const data = await this.loadData()

      const exportData = {
        categories: data.categories,
        users: data.users,
        auditLog: data.auditLog,
        settings: {
          pageVisits: data.pageVisits,
          exportedAt: new Date().toISOString(),
          version: "1.0",
        },
      }

      console.log("✅ ApiDatabase.exportData() - Data exported successfully")
      return exportData
    } catch (error) {
      console.error("❌ ApiDatabase.exportData() - Error exporting data:", error)
      throw new Error(`Failed to export data from server`)
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      console.log("🗑️ ApiDatabase.clearAllData() - Clearing all data...")

      await this.saveData({
        categories: [],
        users: [],
        auditLog: [],
        pageVisits: 0,
      })

      console.log("✅ ApiDatabase.clearAllData() - All data cleared successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.clearAllData() - Error clearing data:", error)
      throw new Error(`Failed to clear data from server`)
    }
  }
}

// Export a singleton instance
export const apiDatabase = new ApiDatabase()
