export interface User {
  id: string
  username: string
  password: string
  email: string
  role: "admin" | "editor" | "viewer"
  createdAt: Date
  lastLogin?: Date
}

export interface Subcategory {
  id: string
  name: string
  description?: string
  articles: Article[]
}

export interface Category {
  id: string
  name: string
  description?: string
  articles: Article[]
  subcategories: Subcategory[]
}

export interface Article {
  id: string
  title: string
  content: string
  author: string
  categoryId: string
  subcategoryId?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface AuditLogEntry {
  id: string
  action: string
  entityType: "user" | "article" | "category" | "system"
  entityId: string
  performedBy: string
  timestamp: Date
  details: string
}
