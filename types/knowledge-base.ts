export interface User {
  id: string
  username: string
  email: string
  password: string
  role: "admin" | "editor" | "viewer"
  createdAt: string
  lastLogin?: string
  isActive: boolean
}

export interface Article {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  updatedAt: string
  tags: string[]
  isPublished: boolean
  views: number
}

export interface Category {
  id: string
  name: string
  description: string
  articles: Article[]
  subcategories?: Category[]
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  username: string
  action: string
  details: string
  ipAddress: string
}

export interface DatabaseData {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  pageVisits: number
}

export interface SearchResult {
  type: "article" | "category"
  id: string
  title: string
  content?: string
  categoryPath?: string
  relevance: number
}
