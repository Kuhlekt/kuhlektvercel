export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  subcategoryId?: string
  tags?: string[]
  author: string
  createdAt: Date
  updatedAt: Date
  views?: number
  featured?: boolean
}

export interface Subcategory {
  id: string
  name: string
  description: string
  articles?: Article[]
}

export interface Category {
  id: string
  name: string
  description: string
  icon?: string
  articles?: Article[]
  subcategories?: Subcategory[]
}

export interface User {
  id: string
  username: string
  email?: string
  role: "admin" | "editor" | "viewer"
  password: string
  createdAt: Date
  lastLogin?: Date
}

export interface AuditLogEntry {
  id: string
  action:
    | "article_created"
    | "article_updated"
    | "article_deleted"
    | "category_created"
    | "category_updated"
    | "category_deleted"
    | "user_login"
    | "user_created"
    | "user_updated"
    | "user_deleted"
    | "data_imported"
    | "data_exported"
  articleId?: string
  articleTitle?: string
  categoryId?: string
  userId?: string
  performedBy: string
  timestamp: Date
  details: string
}

export interface KnowledgeBaseData {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  pageVisits?: number
  lastUpdated?: Date
}
