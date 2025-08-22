import type { Category, User, AuditLogEntry, AppSettings } from "../types/knowledge-base"

export class ApiDatabase {
  private baseUrl = "/api/data"

  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${this.baseUrl}?type=categories`)
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      return data.categories || []
    } catch (error) {
      console.error("Error fetching categories:", error)
      return []
    }
  }

  async saveCategories(categories: Category[]): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}?type=categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories }),
      })
      if (!response.ok) throw new Error("Failed to save categories")
    } catch (error) {
      console.error("Error saving categories:", error)
      throw error
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${this.baseUrl}?type=users`)
      if (!response.ok) throw new Error("Failed to fetch users")
      const data = await response.json()
      return data.users || []
    } catch (error) {
      console.error("Error fetching users:", error)
      return []
    }
  }

  async saveUsers(users: User[]): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}?type=users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users }),
      })
      if (!response.ok) throw new Error("Failed to save users")
    } catch (error) {
      console.error("Error saving users:", error)
      throw error
    }
  }

  async getAuditLog(): Promise<AuditLogEntry[]> {
    try {
      const response = await fetch(`${this.baseUrl}?type=audit-log`)
      if (!response.ok) throw new Error("Failed to fetch audit log")
      const data = await response.json()
      return data.auditLog || []
    } catch (error) {
      console.error("Error fetching audit log:", error)
      return []
    }
  }

  async saveAuditLog(auditLog: AuditLogEntry[]): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}?type=audit-log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditLog }),
      })
      if (!response.ok) throw new Error("Failed to save audit log")
    } catch (error) {
      console.error("Error saving audit log:", error)
      throw error
    }
  }

  async getSettings(): Promise<AppSettings> {
    try {
      const response = await fetch(`${this.baseUrl}?type=settings`)
      if (!response.ok) throw new Error("Failed to fetch settings")
      const data = await response.json()
      return data.settings || { pageVisits: 0 }
    } catch (error) {
      console.error("Error fetching settings:", error)
      return { pageVisits: 0 }
    }
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}?type=settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      })
      if (!response.ok) throw new Error("Failed to save settings")
    } catch (error) {
      console.error("Error saving settings:", error)
      throw error
    }
  }

  async incrementPageVisits(): Promise<void> {
    try {
      const response = await fetch("/api/data/page-visits", {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to increment page visits")
    } catch (error) {
      console.error("Error incrementing page visits:", error)
    }
  }
}

export const apiDatabase = new ApiDatabase()
