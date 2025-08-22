import { supabase, isMockMode } from "@/lib/supabase"
import type { DatabaseUser, DatabaseArticle, DatabaseAuditLog } from "@/lib/supabase"
import type { Category, User, Article, AuditLogEntry } from "@/types/knowledge-base"

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

// Mock data for preview mode
const mockData = {
  categories: [
    {
      id: "1",
      name: "Getting Started",
      description: "Basic setup and introduction",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Advanced Topics",
      description: "Complex configurations and features",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  subcategories: [
    {
      id: "1",
      name: "Installation",
      description: "How to install",
      category_id: "1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Configuration",
      description: "How to configure",
      category_id: "1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  articles: [
    {
      id: "1",
      title: "Welcome to Kuhlekt KB",
      content: "This is your knowledge base...",
      category_id: "1",
      subcategory_id: "1",
      tags: ["welcome", "intro"],
      created_by: "admin",
      last_edited_by: "admin",
      edit_count: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  users: [
    {
      id: "1",
      username: "admin",
      password: "hashed_password",
      email: "admin@kuhlekt.com",
      role: "admin" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  auditLogs: [
    {
      id: "1",
      action: "CREATE_ARTICLE",
      article_id: "1",
      article_title: "Welcome to Kuhlekt KB",
      performed_by: "admin",
      details: "Initial article creation",
      timestamp: new Date().toISOString(),
    },
  ],
}

export async function exportAllData() {
  if (isMockMode) {
    return {
      version: "1.0",
      timestamp: new Date().toISOString(),
      ...mockData,
    }
  }

  try {
    const [categoriesRes, subcategoriesRes, articlesRes, usersRes, auditLogsRes] = await Promise.all([
      supabase!.from("categories").select("*"),
      supabase!.from("subcategories").select("*"),
      supabase!.from("articles").select("*"),
      supabase!.from("users").select("*"),
      supabase!.from("audit_log").select("*"),
    ])

    if (categoriesRes.error) throw categoriesRes.error
    if (subcategoriesRes.error) throw subcategoriesRes.error
    if (articlesRes.error) throw articlesRes.error
    if (usersRes.error) throw usersRes.error
    if (auditLogsRes.error) throw auditLogsRes.error

    return {
      version: "1.0",
      timestamp: new Date().toISOString(),
      categories: categoriesRes.data || [],
      subcategories: subcategoriesRes.data || [],
      articles: articlesRes.data || [],
      users: usersRes.data || [],
      auditLogs: auditLogsRes.data || [],
    }
  } catch (error) {
    console.error("Export error:", error)
    throw new Error("Failed to export data")
  }
}

export async function importAllData(data: any) {
  if (isMockMode) {
    // Simulate import in mock mode
    return {
      categories: data.categories?.length || 0,
      subcategories: data.subcategories?.length || 0,
      articles: data.articles?.length || 0,
      users: data.users?.length || 0,
      auditLogs: data.auditLogs?.length || 0,
    }
  }

  try {
    // Clear existing data first
    await clearAllData()

    const stats = {
      categories: 0,
      subcategories: 0,
      articles: 0,
      users: 0,
      auditLogs: 0,
    }

    // Import categories
    if (data.categories && data.categories.length > 0) {
      const { error: categoriesError } = await supabase!.from("categories").insert(data.categories)
      if (categoriesError) throw categoriesError
      stats.categories = data.categories.length
    }

    // Import subcategories
    if (data.subcategories && data.subcategories.length > 0) {
      const { error: subcategoriesError } = await supabase!.from("subcategories").insert(data.subcategories)
      if (subcategoriesError) throw subcategoriesError
      stats.subcategories = data.subcategories.length
    }

    // Import articles
    if (data.articles && data.articles.length > 0) {
      const { error: articlesError } = await supabase!.from("articles").insert(data.articles)
      if (articlesError) throw articlesError
      stats.articles = data.articles.length
    }

    // Import users
    if (data.users && data.users.length > 0) {
      const { error: usersError } = await supabase!.from("users").insert(data.users)
      if (usersError) throw usersError
      stats.users = data.users.length
    }

    // Import audit logs
    if (data.auditLogs && data.auditLogs.length > 0) {
      const { error: auditLogsError } = await supabase!.from("audit_log").insert(data.auditLogs)
      if (auditLogsError) throw auditLogsError
      stats.auditLogs = data.auditLogs.length
    }

    return stats
  } catch (error) {
    console.error("Import error:", error)
    throw new Error("Failed to import data")
  }
}

export async function clearAllData() {
  if (isMockMode) {
    // Simulate clearing in mock mode
    return
  }

  try {
    // Delete in reverse order to respect foreign key constraints
    await Promise.all([
      supabase!.from("audit_log").delete().neq("id", ""),
      supabase!.from("articles").delete().neq("id", ""),
      supabase!.from("subcategories").delete().neq("id", ""),
      supabase!.from("categories").delete().neq("id", ""),
      supabase!
        .from("users")
        .delete()
        .neq("username", "admin"), // Keep admin user
    ])
  } catch (error) {
    console.error("Clear data error:", error)
    throw new Error("Failed to clear data")
  }
}

export const database = {
  // Users
  async getUsers(): Promise<User[]> {
    if (isMockMode) {
      return mockData.users.map(convertDatabaseUser)
    }

    const { data, error } = await supabase!.from("users").select("*").order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching users:", error)
      throw error
    }

    return (data || []).map(convertDatabaseUser)
  },

  async saveUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
    if (isMockMode) {
      const newUser = {
        ...mockData.users[0],
        id: Date.now().toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      }
      return convertDatabaseUser(newUser)
    }

    const { data, error } = await supabase!
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
    if (isMockMode) {
      const updatedUser = {
        ...mockData.users[0],
        id: userId,
        ...updates,
        updated_at: new Date().toISOString(),
      }
      return convertDatabaseUser(updatedUser)
    }

    const updateData: any = {}
    if (updates.username) updateData.username = updates.username
    if (updates.password) updateData.password = updates.password
    if (updates.email) updateData.email = updates.email
    if (updates.role) updateData.role = updates.role
    if (updates.lastLogin) updateData.last_login = updates.lastLogin.toISOString()
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase!.from("users").update(updateData).eq("id", userId).select().single()

    if (error) {
      console.error("Error updating user:", error)
      throw error
    }

    return convertDatabaseUser(data)
  },

  // Categories with subcategories and articles
  async getCategories(): Promise<Category[]> {
    if (isMockMode) {
      return [
        {
          id: "1",
          name: "Getting Started",
          description: "Basic setup and introduction",
          articles: [
            {
              id: "1",
              title: "Welcome to Kuhlekt KB",
              content: "This is your knowledge base...",
              categoryId: "1",
              subcategoryId: "1",
              tags: ["welcome", "intro"],
              createdBy: "admin",
              lastEditedBy: "admin",
              editCount: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          subcategories: [
            {
              id: "1",
              name: "Installation",
              description: "How to install",
              articles: [],
            },
          ],
        },
      ]
    }

    // Get categories
    const { data: categoriesData, error: categoriesError } = await supabase!
      .from("categories")
      .select("*")
      .order("name", { ascending: true })

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError)
      throw categoriesError
    }

    // Get subcategories
    const { data: subcategoriesData, error: subcategoriesError } = await supabase!
      .from("subcategories")
      .select("*")
      .order("name", { ascending: true })

    if (subcategoriesError) {
      console.error("Error fetching subcategories:", subcategoriesError)
      throw subcategoriesError
    }

    // Get articles
    const { data: articlesData, error: articlesError } = await supabase!
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
    if (isMockMode) {
      return Date.now().toString()
    }

    const { data, error } = await supabase!
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
    if (isMockMode) {
      return Date.now().toString()
    }

    const { data, error } = await supabase!
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
    if (isMockMode) {
      return
    }

    const { error } = await supabase!.from("categories").delete().eq("id", categoryId)

    if (error) {
      console.error("Error deleting category:", error)
      throw error
    }
  },

  async deleteSubcategory(subcategoryId: string): Promise<void> {
    if (isMockMode) {
      return
    }

    const { error } = await supabase!.from("subcategories").delete().eq("id", subcategoryId)

    if (error) {
      console.error("Error deleting subcategory:", error)
      throw error
    }
  },

  // Articles
  async saveArticle(article: Omit<Article, "id" | "createdAt" | "updatedAt">): Promise<Article> {
    if (isMockMode) {
      const newArticle = {
        ...mockData.articles[0],
        id: Date.now().toString(),
        title: article.title,
        content: article.content,
        category_id: article.categoryId,
        subcategory_id: article.subcategoryId,
        tags: article.tags,
        created_by: article.createdBy,
        last_edited_by: article.lastEditedBy,
        edit_count: article.editCount || 0,
      }
      return convertDatabaseArticle(newArticle)
    }

    const { data, error } = await supabase!
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
    if (isMockMode) {
      const updatedArticle = {
        ...mockData.articles[0],
        id: articleId,
        ...updates,
        updated_at: new Date().toISOString(),
      }
      return convertDatabaseArticle(updatedArticle)
    }

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

    const { data, error } = await supabase!.from("articles").update(updateData).eq("id", articleId).select().single()

    if (error) {
      console.error("Error updating article:", error)
      throw error
    }

    return convertDatabaseArticle(data)
  },

  async deleteArticle(articleId: string): Promise<void> {
    if (isMockMode) {
      return
    }

    const { error } = await supabase!.from("articles").delete().eq("id", articleId)

    if (error) {
      console.error("Error deleting article:", error)
      throw error
    }
  },

  // Audit Log
  async getAuditLog(): Promise<AuditLogEntry[]> {
    if (isMockMode) {
      return mockData.auditLogs.map(convertDatabaseAuditLog)
    }

    const { data, error } = await supabase!
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
    if (isMockMode) {
      return
    }

    const { error } = await supabase!.from("audit_log").insert({
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
    if (isMockMode) {
      return Number.parseInt(localStorage.getItem("kb_page_visits") || "0", 10)
    }

    const { data, error } = await supabase!.from("app_settings").select("value").eq("key", "page_visits").single()

    if (error) {
      console.error("Error fetching page visits:", error)
      return 0
    }

    return Number.parseInt(data?.value || "0", 10)
  },

  async incrementPageVisits(): Promise<number> {
    if (isMockMode) {
      const current = Number.parseInt(localStorage.getItem("kb_page_visits") || "0", 10)
      const newVisits = current + 1
      localStorage.setItem("kb_page_visits", newVisits.toString())
      return newVisits
    }

    const currentVisits = await this.getPageVisits()
    const newVisits = currentVisits + 1

    const { error } = await supabase!.from("app_settings").upsert({
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
    if (isMockMode) {
      return { unsubscribe: () => {} }
    }

    const subscription = supabase!
      .channel("categories-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, callback)
      .on("postgres_changes", { event: "*", schema: "public", table: "subcategories" }, callback)
      .on("postgres_changes", { event: "*", schema: "public", table: "articles" }, callback)
      .subscribe()

    return subscription
  },

  subscribeToAuditLog(callback: () => void) {
    if (isMockMode) {
      return { unsubscribe: () => {} }
    }

    const subscription = supabase!
      .channel("audit-log-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "audit_log" }, callback)
      .subscribe()

    return subscription
  },

  // Data migration and management
  async clearAllData(): Promise<void> {
    return clearAllData()
  },

  async exportData() {
    return exportAllData()
  },
}
