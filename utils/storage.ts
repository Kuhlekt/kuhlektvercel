import type { KnowledgeBaseData, Article, Category, User, AuditLogEntry } from "@/types/knowledge-base"
import { initialArticles, initialCategories } from "@/data/initial-data"
import { initialUsers } from "@/data/initial-users"
import { initialAuditLog } from "@/data/initial-audit-log"

const STORAGE_KEY = "kuhlekt-knowledge-base"
const CURRENT_USER_KEY = "kuhlekt-current-user"

let currentUser: User | null = null

export function initializeStorage(): void {
  if (typeof window === "undefined") return

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    const initialData: KnowledgeBaseData = {
      articles: initialArticles,
      categories: initialCategories,
      users: initialUsers,
      auditLog: initialAuditLog,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
  }
}

export function getStoredData(): KnowledgeBaseData {
  if (typeof window === "undefined") {
    return {
      articles: initialArticles,
      categories: initialCategories,
      users: initialUsers,
      auditLog: initialAuditLog,
    }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      return {
        articles: data.articles || initialArticles,
        categories: data.categories || initialCategories,
        users: data.users || initialUsers,
        auditLog: data.auditLog || initialAuditLog,
      }
    }
  } catch (error) {
    console.error("Error loading stored data:", error)
  }

  const initialData = {
    articles: initialArticles,
    categories: initialCategories,
    users: initialUsers,
    auditLog: initialAuditLog,
  }

  saveStoredData(initialData)
  return initialData
}

export function saveStoredData(data: KnowledgeBaseData): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving data:", error)
  }
}

// Article functions
export function getArticles(): Article[] {
  return getStoredData().articles
}

export function addArticle(article: Omit<Article, "id" | "createdAt" | "updatedAt">): Article {
  const data = getStoredData()
  const newArticle: Article = {
    ...article,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
  }

  data.articles.push(newArticle)
  saveStoredData(data)

  // Add audit log entry
  addAuditLogEntry({
    action: "Article Created",
    userId: currentUser?.id || "unknown",
    username: currentUser?.username || "Unknown",
    details: `Created article: ${newArticle.title}`,
    entityType: "article",
    entityId: newArticle.id,
  })

  return newArticle
}

export function updateArticle(id: string, updates: Partial<Article>): Article | null {
  const data = getStoredData()
  const articleIndex = data.articles.findIndex((a) => a.id === id)

  if (articleIndex === -1) return null

  const updatedArticle = {
    ...data.articles[articleIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  data.articles[articleIndex] = updatedArticle
  saveStoredData(data)

  // Add audit log entry
  addAuditLogEntry({
    action: "Article Updated",
    userId: currentUser?.id || "unknown",
    username: currentUser?.username || "Unknown",
    details: `Updated article: ${updatedArticle.title}`,
    entityType: "article",
    entityId: updatedArticle.id,
  })

  return updatedArticle
}

export function deleteArticle(id: string): boolean {
  const data = getStoredData()
  const articleIndex = data.articles.findIndex((a) => a.id === id)

  if (articleIndex === -1) return false

  const article = data.articles[articleIndex]
  data.articles.splice(articleIndex, 1)
  saveStoredData(data)

  // Add audit log entry
  addAuditLogEntry({
    action: "Article Deleted",
    userId: currentUser?.id || "unknown",
    username: currentUser?.username || "Unknown",
    details: `Deleted article: ${article.title}`,
    entityType: "article",
    entityId: article.id,
  })

  return true
}

// Category functions
export function getCategories(): Category[] {
  return getStoredData().categories
}

export function saveCategories(categories: Category[]): void {
  const data = getStoredData()
  data.categories = categories
  saveStoredData(data)
}

// User functions
export function getUsers(): User[] {
  return getStoredData().users
}

export function addUser(user: Omit<User, "id" | "createdAt">): User {
  const data = getStoredData()
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }

  data.users.push(newUser)
  saveStoredData(data)

  // Add audit log entry
  addAuditLogEntry({
    action: "User Created",
    userId: currentUser?.id || "unknown",
    username: currentUser?.username || "Unknown",
    details: `Created user: ${newUser.username}`,
    entityType: "user",
    entityId: newUser.id,
  })

  return newUser
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  if (currentUser) return currentUser

  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY)
    if (stored) {
      currentUser = JSON.parse(stored)
      return currentUser
    }
  } catch (error) {
    console.error("Error loading current user:", error)
  }

  return null
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return

  currentUser = user

  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

// Audit log functions
export function getAuditLog(): AuditLogEntry[] {
  return getStoredData().auditLog
}

export function addAuditLogEntry(entry: Omit<AuditLogEntry, "id" | "timestamp">): void {
  const data = getStoredData()
  const newEntry: AuditLogEntry = {
    ...entry,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  }

  data.auditLog.unshift(newEntry)
  saveStoredData(data)
}

// Export/Import functions
export function exportData(): string {
  const data = getStoredData()
  return JSON.stringify(data, null, 2)
}

export function importData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData)

    // Validate data structure
    if (!data.articles || !data.categories || !data.users || !data.auditLog) {
      throw new Error("Invalid data structure")
    }

    saveStoredData(data)
    return true
  } catch (error) {
    console.error("Error importing data:", error)
    return false
  }
}
