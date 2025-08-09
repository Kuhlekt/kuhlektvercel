export interface Article {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  author: string
  views?: number
  featured?: boolean
}

export interface Category {
  id: string
  name: string
  description: string
  parentId?: string
  children?: Category[]
  color?: string
  articleCount?: number
}

export interface User {
  id: string
  username: string
  password: string
  email?: string
  role: "admin" | "editor" | "viewer"
  createdAt: string
  lastLogin?: string
}

export type UserRole = "admin" | "editor" | "viewer"

export interface AuditLogEntry {
  id: string
  action: string
  userId: string
  username: string
  timestamp: string
  details: string
  entityType: "article" | "category" | "user" | "system"
  entityId?: string
}

export interface KnowledgeBaseData {
  articles: Article[]
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
}
