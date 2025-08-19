import { supabase } from "../lib/supabase"
import type { DatabaseUser, DatabaseArticle, DatabaseAuditLog } from "../lib/supabase"
import type { Category, User, Article, AuditLogEntry } from "../types/knowledge-base"

// Helper function to convert database dates to Date objects
const parseDate = (dateString: string): Date => new Date(dateString)

// Helper function to convert database user to app user
const convertDatabaseUser = (dbUser: DatabaseUser): User => ({
  id: dbUser.id,
  username: dbUser.username,
  password: dbUser.password,
  email: dbUser.email || "",
  role: dbUser.role,
  createdAt: parseDate(dbUser.created_at),
  lastLogin: dbUser.last_login ? parseDate(dbUser.last_login) : undefined,
})

// Helper function to convert database article to app article
const convertDatabaseArticle = (dbArticle: DatabaseArticle): Article => ({
  id: dbArticle.id,
  title: dbArticle.title,
  content: dbArticle.content,
  categoryId: dbArticle.category_id,
  subcategoryId: dbArticle.subcategory_id,
  tags: dbArticle.tags || [],
  createdBy: dbArticle.created_by,
  lastEditedBy: dbArticle.last_edited_by,
  editCount: dbArticle.edit_count || 0,
  createdAt: parseDate(dbArticle.created_at),
  updatedAt: parseDate(dbArticle.updated_at),
})

// Helper function to convert database audit log to app audit log
const convertDatabaseAuditLog = (dbAudit: DatabaseAuditLog): AuditLogEntry => ({
  id: dbAudit.id,
  action: dbAudit.action as any,
  articleId: dbAudit.article_id,
  articleTitle: dbAudit.article_title,
  categoryId: dbAudit.category_id,
  categoryName: dbAudit.category_name,
  subcategoryName: dbAudit.subcategory_name,
  userId: dbAudit.user_id,
  username: dbAudit.username,
  performedBy: dbAudit.performed_by,
  timestamp: parseDate(dbAudit.timestamp),
  details: dbAudit.details,
})

export const database = {
  // Users
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching users:", error)
      throw error
    }

    return (data || []).map(convertDatabaseUser)
  },

  async saveUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .insert({
        username: user.username,
        password: user.password,
        email: user.email,
        role: user.role,
        last_login: user.lastLogin?.toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving user:", error)
      throw error
    }

    return convertDatabaseUser(data)
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const updateData: any = {}
    if (updates.username) updateData.username = updates.username
    if (updates.password) updateData.password = updates.password
    if (updates.email) updateData.email = updates.email
    if (updates.role) updateData.role = updates.role
    if (updates.lastLogin) updateData.last_login = updates.lastLogin.toISOString()
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase.from("users").update(updateData).eq("id", userId).select().single()

    if (error) {
      console.error("Error updating user:", error)
      throw error
    }

    return convertDatabaseUser(data)
  },

  // Categories with subcategories and articles
  async getCategories(): Promise<Category[]> {
    // Get categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true })

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError)
      throw categoriesError
    }

    // Get subcategories
    const { data: subcategoriesData, error: subcategoriesError } = await supabase
      .from("subcategories")
      .select("*")
      .order("name", { ascending: true })

    if (subcategoriesError) {
      console.error("Error fetching subcategories:", subcategoriesError)
      throw subcategoriesError
    }

    // Get articles
    const { data: articlesData, error: articlesError } = await supabase
      .from("articles")
      .select("*")
      .order("updated_at", { ascending: false })

    if (articlesError) {
      console.error("Error fetching articles:", articlesError)
      throw articlesError
    }

    // Build the category structure
    const categories: Category[] = (categoriesData || []).map((dbCategory) => {
      const categorySubcategories = (subcategoriesData || [])
        .filter((sub) => sub.category_id === dbCategory.id)
        .map((dbSub) => {
          const subcategoryArticles = (articlesData || [])
            .filter((article) => article.subcategory_id === dbSub.id)
            .map(convertDatabaseArticle)

          return {
            id: dbSub.id,
            name: dbSub.name,
            description: dbSub.description,
            articles: subcategoryArticles,
          }
        })

      const categoryArticles = (articlesData || [])
        .filter((article) => article.category_id === dbCategory.id && !article.subcategory_id)
        .map(convertDatabaseArticle)

      return {
        id: dbCategory.id,
        name: dbCategory.name,
        description: dbCategory.description,
        articles: categoryArticles,
        subcategories: categorySubcategories,
      }
    })

    return categories
  },

  async saveCategory(name: string, description?: string): Promise<string> {
    const { data, error } = await supabase
      .from("categories")
      .insert({
        name,
        description,
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving category:", error)
      throw error
    }

    return data.id
  },

  async saveSubcategory(categoryId: string, name: string, description?: string): Promise<string> {
    const { data, error } = await supabase
      .from("subcategories")
      .insert({
        name,
        description,
        category_id: categoryId,
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving subcategory:", error)
      throw error
    }

    return data.id
  },

  async deleteCategory(categoryId: string): Promise<void> {
    const { error } = await supabase.from("categories").delete().eq("id", categoryId)

    if (error) {
      console.error("Error deleting category:", error)
      throw error
    }
  },

  async deleteSubcategory(subcategoryId: string): Promise<void> {
    const { error } = await supabase.from("subcategories").delete().eq("id", subcategoryId)

    if (error) {
      console.error("Error deleting subcategory:", error)
      throw error
    }
  },

  // Articles
  async saveArticle(article: Omit<Article, "id" | "createdAt" | "updatedAt">): Promise<Article> {
    const { data, error } = await supabase
      .from("articles")
      .insert({
        title: article.title,
        content: article.content,
        category_id: article.categoryId,
        subcategory_id: article.subcategoryId,
        tags: article.tags,
        created_by: article.createdBy,
        last_edited_by: article.lastEditedBy,
        edit_count: article.editCount || 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving article:", error)
      throw error
    }

    return convertDatabaseArticle(data)
  },

  async updateArticle(articleId: string, updates: Partial<Article>): Promise<Article> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (updates.title) updateData.title = updates.title
    if (updates.content) updateData.content = updates.content
    if (updates.categoryId) updateData.category_id = updates.categoryId
    if (updates.subcategoryId !== undefined) updateData.subcategory_id = updates.subcategoryId
    if (updates.tags) updateData.tags = updates.tags
    if (updates.lastEditedBy) updateData.last_edited_by = updates.lastEditedBy
    if (updates.editCount !== undefined) updateData.edit_count = updates.editCount

    const { data, error } = await supabase.from("articles").update(updateData).eq("id", articleId).select().single()

    if (error) {
      console.error("Error updating article:", error)
      throw error
    }

    return convertDatabaseArticle(data)
  },

  async deleteArticle(articleId: string): Promise<void> {
    const { error } = await supabase.from("articles").delete().eq("id", articleId)

    if (error) {
      console.error("Error deleting article:", error)
      throw error
    }
  },

  // Audit Log
  async getAuditLog(): Promise<AuditLogEntry[]> {
    const { data, error } = await supabase
      .from("audit_log")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(1000) // Limit to last 1000 entries

    if (error) {
      console.error("Error fetching audit log:", error)
      throw error
    }

    return (data || []).map(convertDatabaseAuditLog)
  },

  async addAuditEntry(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<void> {
    const { error } = await supabase.from("audit_log").insert({
      action: entry.action,
      article_id: entry.articleId,
      article_title: entry.articleTitle,
      category_id: entry.categoryId,
      category_name: entry.categoryName,
      subcategory_name: entry.subcategoryName,
      user_id: entry.userId,
      username: entry.username,
      performed_by: entry.performedBy,
      details: entry.details,
    })

    if (error) {
      console.error("Error adding audit entry:", error)
      throw error
    }
  },

  // App Settings
  async getPageVisits(): Promise<number> {
    const { data, error } = await supabase.from("app_settings").select("value").eq("key", "page_visits").single()

    if (error) {
      console.error("Error fetching page visits:", error)
      return 0
    }

    return Number.parseInt(data?.value || "0", 10)
  },

  async incrementPageVisits(): Promise<number> {
    const currentVisits = await this.getPageVisits()
    const newVisits = currentVisits + 1

    const { error } = await supabase.from("app_settings").upsert({
      key: "page_visits",
      value: newVisits.toString(),
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error incrementing page visits:", error)
      return currentVisits
    }

    return newVisits
  },

  // Real-time subscriptions
  subscribeToCategories(callback: () => void) {
    const subscription = supabase
      .channel("categories-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, callback)
      .on("postgres_changes", { event: "*", schema: "public", table: "subcategories" }, callback)
      .on("postgres_changes", { event: "*", schema: "public", table: "articles" }, callback)
      .subscribe()

    return subscription
  },

  subscribeToAuditLog(callback: () => void) {
    const subscription = supabase
      .channel("audit-log-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "audit_log" }, callback)
      .subscribe()

    return subscription
  },

  // Data migration and management
  async clearAllData(): Promise<void> {
    // Delete in correct order due to foreign key constraints
    await supabase.from("audit_log").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    await supabase.from("articles").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    await supabase.from("subcategories").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    await supabase.from("categories").delete().neq("id", "00000000-0000-0000-0000-000000000000")

    // Reset page visits
    await supabase.from("app_settings").upsert({
      key: "page_visits",
      value: "0",
      updated_at: new Date().toISOString(),
    })
  },

  async exportData() {
    const [categories, users, auditLog] = await Promise.all([this.getCategories(), this.getUsers(), this.getAuditLog()])

    const pageVisits = await this.getPageVisits()

    return {
      categories,
      users,
      auditLog,
      pageVisits,
      exportedAt: new Date().toISOString(),
      version: "2.0",
    }
  },
}
