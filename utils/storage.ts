import type { Article, Category, User, AuditLogEntry, KnowledgeBaseData } from "@/types/knowledge-base"
import { initialArticles, initialCategories } from "@/data/initial-data"
import { initialUsers } from "@/data/initial-users"
import { initialAuditLog } from "@/data/initial-audit-log"

const STORAGE_KEYS = {
  ARTICLES: "kb_articles",
  CATEGORIES: "kb_categories",
  USERS: "kb_users",
  CURRENT_USER: "kb_current_user",
  AUDIT_LOG: "kb_audit_log",
  INITIALIZED: "kb_initialized",
}

// Initialize storage with default data
export const initializeStorage = (): void => {
  if (typeof window === "undefined") return

  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED)

  if (!isInitialized) {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(initialArticles))
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories))
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers))
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(initialAuditLog))
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true")
  }
}

// Get all stored data
export const getStoredData = (): KnowledgeBaseData => {
  if (typeof window === "undefined") {
    return {
      articles: initialArticles,
      categories: initialCategories,
      users: initialUsers,
      auditLog: initialAuditLog,
      settings: {
        siteName: "Kuhlekt Knowledge Base",
        description: "Internal knowledge management system",
        version: "1.0.0",
      },
    }
  }

  try {
    const articles = localStorage.getItem(STORAGE_KEYS.ARTICLES)
    const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    const users = localStorage.getItem(STORAGE_KEYS.USERS)
    const auditLog = localStorage.getItem(STORAGE_KEYS.AUDIT_LOG)

    return {
      articles: articles ? JSON.parse(articles) : initialArticles,
      categories: categories ? JSON.parse(categories) : initialCategories,
      users: users ? JSON.parse(users) : initialUsers,
      auditLog: auditLog ? JSON.parse(auditLog) : initialAuditLog,
      settings: {
        siteName: "Kuhlekt Knowledge Base",
        description: "Internal knowledge management system",
        version: "1.0.0",
      },
    }
  } catch (error) {
    console.error("Error parsing stored data:", error)
  }

  return {
    articles: initialArticles,
    categories: initialCategories,
    users: initialUsers,
    auditLog: initialAuditLog,
    settings: {
      siteName: "Kuhlekt Knowledge Base",
      description: "Internal knowledge management system",
      version: "1.0.0",
    },
  }
}

// Save all data
export const saveStoredData = (data: KnowledgeBaseData): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(data.articles))
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories))
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users))
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(data.auditLog))
  } catch (error) {
    console.error("Error saving data:", error)
  }
}

// Get articles
export const getArticles = (): Article[] => {
  if (typeof window === "undefined") return initialArticles

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ARTICLES)
    return stored ? JSON.parse(stored) : initialArticles
  } catch (error) {
    console.error("Error loading articles:", error)
    return initialArticles
  }
}

// Get categories
export const getCategories = (): Category[] => {
  if (typeof window === "undefined") return initialCategories

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    return stored ? JSON.parse(stored) : initialCategories
  } catch (error) {
    console.error("Error loading categories:", error)
    return initialCategories
  }
}

// Get users
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return initialUsers

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS)
    return stored ? JSON.parse(stored) : initialUsers
  } catch (error) {
    console.error("Error loading users:", error)
    return initialUsers
  }
}

// Get audit log
export const getAuditLog = (): AuditLogEntry[] => {
  if (typeof window === "undefined") return initialAuditLog

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOG)
    return stored ? JSON.parse(stored) : initialAuditLog
  } catch (error) {
    console.error("Error loading audit log:", error)
    return initialAuditLog
  }
}

// Current user management
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error("Error loading current user:", error)
    return null
  }
}

export const setCurrentUser = (user: User | null): void => {
  if (typeof window === "undefined") return

  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    }
  } catch (error) {
    console.error("Error saving current user:", error)
  }
}

// Article management
export const addArticle = (article: Article): void => {
  if (typeof window === "undefined") return

  try {
    const articles = getArticles()
    articles.push(article)
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles))
  } catch (error) {
    console.error("Error adding article:", error)
  }
}

export const updateArticle = (updatedArticle: Article): void => {
  if (typeof window === "undefined") return

  try {
    const articles = getArticles()
    const index = articles.findIndex((a) => a.id === updatedArticle.id)
    if (index !== -1) {
      articles[index] = updatedArticle
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles))
    }
  } catch (error) {
    console.error("Error updating article:", error)
  }
}

export const deleteArticle = (articleId: string): void => {
  if (typeof window === "undefined") return

  try {
    const articles = getArticles()
    const filtered = articles.filter((a) => a.id !== articleId)
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(filtered))
  } catch (error) {
    console.error("Error deleting article:", error)
  }
}

// Category management
export const saveCategories = (categories: Category[]): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
  } catch (error) {
    console.error("Error saving categories:", error)
  }
}

// User management
export const addUser = (user: User): void => {
  if (typeof window === "undefined") return

  try {
    const users = getUsers()
    users.push(user)
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  } catch (error) {
    console.error("Error adding user:", error)
  }
}

export const saveUsers = (users: User[]): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  } catch (error) {
    console.error("Error saving users:", error)
  }
}

// Audit log management
export const addAuditLogEntry = (entry: AuditLogEntry): void => {
  if (typeof window === "undefined") return

  try {
    const auditLog = getAuditLog()
    auditLog.unshift(entry) // Add to beginning for newest first
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(auditLog))
  } catch (error) {
    console.error("Error adding audit log entry:", error)
  }
}

// Export data for backup
export const exportData = (): KnowledgeBaseData => {
  return {
    articles: getArticles(),
    categories: getCategories(),
    users: getUsers(),
    auditLog: getAuditLog(),
    settings: {
      siteName: "Kuhlekt Knowledge Base",
      description: "Internal knowledge management system",
      version: "1.0.0",
    },
  }
}

// Import data from backup
export const importData = (data: KnowledgeBaseData): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(data.articles))
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories))
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users))
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(data.auditLog))
  } catch (error) {
    console.error("Error importing data:", error)
  }
}

// Clear all data
export const clearAllData = (): void => {
  if (typeof window === "undefined") return

  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.error("Error clearing data:", error)
  }
}
