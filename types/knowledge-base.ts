export interface User {
  id: string
  username: string
  password: string
  email: string
  role: "admin" | "editor" | "viewer"
  createdAt: Date
  lastLogin?: Date
}

export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  subcategoryId?: string
  tags: string[]
  author: string
  createdAt: Date
  updatedAt: Date
}

export interface Subcategory {
  id: string
  name: string
  description: string
  articles: Article[]
}

export interface Category {
  id: string
  name: string
  description: string
  articles: Article[]
  subcategories: Subcategory[]
}

export interface AuditLogEntry {
  id: string
  action: string
  entityType: string
  entityId: string
  performedBy: string
  timestamp: Date
  details: string
}
