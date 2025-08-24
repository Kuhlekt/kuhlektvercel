import { supabase, isMockMode, mockDatabase } from "@/lib/supabase"
import type { KnowledgeBaseData } from "@/types/knowledge-base"

class Database {
  private cache: KnowledgeBaseData | null = null
  private cacheExpiry = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private async loadFromSupabase(): Promise<KnowledgeBaseData> {
    try {
      console.log("🔍 Loading data from Supabase...")

      const [categoriesResult, articlesResult, usersResult, auditLogResult] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("articles").select("*").order("created_at", { ascending: false }),
        supabase.from("users").select("*").order("username"),
        supabase.from("audit_log").select("*").order("timestamp", { ascending: false }).limit(100),
      ])

      if (categoriesResult.error) throw categoriesResult.error
      if (articlesResult.error) throw articlesResult.error
      if (usersResult.error) throw usersResult.error
      if (auditLogResult.error) throw auditLogResult.error

      const data: KnowledgeBaseData = {
        categories: categoriesResult.data || [],
        articles: articlesResult.data || [],
        users: usersResult.data || [],
        auditLog: auditLogResult.data || [],
        pageVisits: 0, // This would come from a separate table/counter
      }

      console.log("✅ Data loaded from Supabase:", {
        categories: data.categories.length,
        articles: data.articles.length,
        users: data.users.length,
        auditLog: data.auditLog.length,
      })

      return data
    } catch (error) {
      console.error("❌ Error loading from Supabase:", error)
      throw new Error("Failed to load data from database")
    }
  }

  private async loadFromMock(): Promise<KnowledgeBaseData> {
    console.log("🔄 Using mock database (no Supabase connection)")
    return {
      categories: mockDatabase.categories,
      articles: mockDatabase.articles,
      users: mockDatabase.users,
      auditLog: mockDatabase.auditLog,
      pageVisits: mockDatabase.pageVisits,
    }
  }

  async loadData(): Promise<KnowledgeBaseData> {
    const now = Date.now()

    // Return cached data if still valid
    if (this.cache && now < this.cacheExpiry) {
      console.log("📋 Returning cached data")
      return this.cache
    }

    try {
      let data: KnowledgeBaseData

      if (isMockMode) {
        data = await this.loadFromMock()
      } else {
        data = await this.loadFromSupabase()
      }

      // Cache the data
      this.cache = data
      this.cacheExpiry = now + this.CACHE_DURATION

      return data
    } catch (error) {
      console.error("❌ Error loading data, falling back to mock:", error)
      // Fallback to mock data if database fails
      return await this.loadFromMock()
    }
  }

  async saveData(data: Partial<KnowledgeBaseData>): Promise<void> {
    if (isMockMode) {
      console.log("💾 Mock mode: Data saved to memory (not persistent)")
      // Update mock database
      if (data.categories) mockDatabase.categories = data.categories
      if (data.articles) mockDatabase.articles = data.articles
      if (data.users) mockDatabase.users = data.users
      if (data.auditLog) mockDatabase.auditLog = data.auditLog
      if (data.pageVisits !== undefined) mockDatabase.pageVisits = data.pageVisits

      // Update cache
      this.cache = {
        categories: mockDatabase.categories,
        articles: mockDatabase.articles,
        users: mockDatabase.users,
        auditLog: mockDatabase.auditLog,
        pageVisits: mockDatabase.pageVisits,
      }
      return
    }

    try {
      console.log("💾 Saving data to Supabase...")

      const promises = []

      if (data.categories) {
        promises.push(supabase.from("categories").upsert(data.categories, { onConflict: "id" }))
      }

      if (data.articles) {
        promises.push(supabase.from("articles").upsert(data.articles, { onConflict: "id" }))
      }

      if (data.users) {
        promises.push(supabase.from("users").upsert(data.users, { onConflict: "id" }))
      }

      if (data.auditLog) {
        promises.push(supabase.from("audit_log").upsert(data.auditLog, { onConflict: "id" }))
      }

      const results = await Promise.all(promises)

      for (const result of results) {
        if (result.error) {
          throw result.error
        }
      }

      // Invalidate cache
      this.cache = null
      this.cacheExpiry = 0

      console.log("✅ Data saved to Supabase successfully")
    } catch (error) {
      console.error("❌ Error saving to Supabase:", error)
      throw new Error("Failed to save data to database")
    }
  }

  async incrementPageVisits(): Promise<number> {
    if (isMockMode) {
      mockDatabase.pageVisits++
      return mockDatabase.pageVisits
    }

    try {
      // In a real implementation, this would increment a counter in Supabase
      const { data, error } = await supabase.rpc("increment_page_visits")

      if (error) throw error

      return data || 0
    } catch (error) {
      console.error("❌ Error incrementing page visits:", error)
      return 0
    }
  }

  clearCache(): void {
    this.cache = null
    this.cacheExpiry = 0
    console.log("🗑️ Database cache cleared")
  }
}

export const database = new Database()
