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
  categoryId: string
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface AuditLogEntry {
  id: string
  action: string
  performedBy: string
  timestamp: Date
  articleId?: string
  articleTitle?: string
  categoryId?: string
  details?: string
}
