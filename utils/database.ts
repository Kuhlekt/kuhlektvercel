import { supabase, isMockMode } from "@/lib/supabase"

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
      supabase!.from("audit_logs").select("*"),
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
      const { error: auditLogsError } = await supabase!.from("audit_logs").insert(data.auditLogs)

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
      supabase!.from("audit_logs").delete().neq("id", ""),
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
