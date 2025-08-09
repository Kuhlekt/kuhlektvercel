export interface Article {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  author: string
  createdAt: string
  updatedAt: string
  isPublished: boolean
  viewCount: number
}

export interface Category {
  id: string
  name: string
  description: string
  parentId?: string
  color: string
  articleCount: number
}

export interface User {
  id: string
  username: string
  password: string
  role: UserRole
  email: string
  createdAt: string
  lastLogin?: string
}

export type UserRole = "admin" | "editor" | "viewer"

export interface AuditLogEntry {
  id: string
  userId: string
  username: string
  action: string
  details: string
  timestamp: string
  ipAddress?: string
}

export interface KnowledgeBaseData {
  articles: Article[]
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  settings: {
    siteName: string
    description: string
    version: string
  }
}
