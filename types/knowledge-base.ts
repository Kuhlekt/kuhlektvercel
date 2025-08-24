export interface User {
  id: string
  username: string
  password: string
  email: string
  role: "admin" | "editor" | "viewer"
  isActive: boolean
  createdAt: string | Date
  lastLogin?: string | Date | null
}

export interface KnowledgeBaseUser {
  id: string
  username: string
  password: string
  email: string
  role: "admin" | "editor" | "viewer"
  isActive: boolean
  createdAt: string | Date
  lastLogin?: string | Date | null
}

export interface Category {
  id: string
  name: string
  description: string
  isActive?: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  author: string
  tags: string[]
  isPublished: boolean
  views: number
  createdAt: string | Date
  updatedAt: string | Date
}

export interface AuditLogEntry {
  id: string
  action: string
  performedBy: string
  userId?: string
  username?: string
  timestamp: string | Date
  details: string
}

export type AuditLog = AuditLogEntry

export interface KnowledgeBaseData {
  categories: Category[]
  articles: Article[]
  users: KnowledgeBaseUser[]
  auditLog: AuditLogEntry[]
  pageVisits: number
  settings?: {
    siteName: string
    description: string
    version: string
  }
  stats?: {
    totalUsers: number
    totalArticles: number
    totalCategories: number
    totalViews: number
    lastUpdated: string
  }
}

export interface DatabaseStats {
  totalUsers: number
  totalArticles: number
  totalCategories: number
  totalViews: number
  pageVisits: number
  lastUpdated: string
}
