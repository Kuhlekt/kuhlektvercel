import type { KnowledgeBaseData, User } from "@/types/knowledge-base"

class ApiDatabase {
  private baseUrl = "/api/data"

  async loadData(): Promise<KnowledgeBaseData> {
    console.log("🔍 ApiDatabase.loadData() - Fetching data from server...")

    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "load" }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("✅ ApiDatabase.loadData() - Data received:", {
        categories: data.categories?.length || 0,
        users: data.users?.length || 0,
        usernames: data.users?.map((u: User) => u.username) || [],
        auditLog: data.auditLog?.length || 0,
        pageVisits: data.pageVisits || 0,
      })

      return data
    } catch (error) {
      console.error("❌ ApiDatabase.loadData() - Error:", error)
      throw new Error("Failed to load data from server")
    }
  }

  async saveData(data: KnowledgeBaseData): Promise<void> {
    console.log("💾 ApiDatabase.saveData() - Saving data to server...")

    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", data }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log("✅ ApiDatabase.saveData() - Data saved successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.saveData() - Error saving data:", error)
      throw new Error("Failed to save data to server")
    }
  }

  async incrementPageVisits(): Promise<number> {
    console.log("📈 ApiDatabase.incrementPageVisits() - Incrementing page visits...")

    try {
      const response = await fetch(`${this.baseUrl}/page-visits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        console.warn("⚠️ Page visits increment failed, but continuing...")
        return 0
      }

      const result = await response.json()
      console.log("✅ ApiDatabase.incrementPageVisits() - Success:", result.pageVisits)
      return result.pageVisits
    } catch (error) {
      console.warn("⚠️ Failed to increment page visits, continuing...", error)
      return 0
    }
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    console.log("👤 ApiDatabase.updateUserLastLogin() - Updating last login for user:", userId)

    try {
      const data = await this.loadData()

      if (!data.users || !Array.isArray(data.users)) {
        throw new Error("Users data is not available or invalid")
      }

      const user = data.users.find((u) => u.id === userId)
      if (!user) {
        throw new Error(`User with ID ${userId} not found`)
      }

      user.lastLogin = new Date().toISOString()
      await this.saveData(data)

      console.log("✅ ApiDatabase.updateUserLastLogin() - Last login updated successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.updateUserLastLogin() - Error:", error)
      throw new Error("Failed to update user last login")
    }
  }

  async importData(importData: KnowledgeBaseData): Promise<void> {
    console.log("📥 ApiDatabase.importData() - Starting data import...")

    try {
      // Validate import data structure
      if (!importData.categories || !importData.users) {
        throw new Error("Invalid import data structure")
      }

      const response = await fetch(`${this.baseUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "import", data: importData }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log("✅ ApiDatabase.importData() - Data imported successfully")
    } catch (error) {
      console.error("❌ ApiDatabase.importData() - Error importing data:", error)
      throw new Error("Failed to import data to server")
    }
  }

  async getSummary(): Promise<any> {
    console.log("📊 ApiDatabase.getSummary() - Fetching data summary...")

    try {
      const response = await fetch(`${this.baseUrl}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const summary = await response.json()
      console.log("✅ ApiDatabase.getSummary() - Summary received:", summary)
      return summary
    } catch (error) {
      console.error("❌ ApiDatabase.getSummary() - Error:", error)
      throw new Error("Failed to get data summary")
    }
  }
}

// Export singleton instance
export const apiDatabase = new ApiDatabase()
