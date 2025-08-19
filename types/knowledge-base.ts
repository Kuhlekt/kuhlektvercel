export interface Category {
  id: string
  name: string
  description?: string
  articles: Article[]
  subcategories: Subcategory[]
  createdAt: Date
  updatedAt: Date
}

export interface Subcategory {
  id: string
  name: string
  description?: string
  articles: Article[]
  parentId: string
  createdAt: Date
  updatedAt: Date
}

export interface Article {
  id: string
  title: string
  content: string
  summary?: string
  tags: string[]
  categoryId: string
  subcategoryId?: string
  author?: string
  createdAt: Date
  updatedAt: Date
  isPublished: boolean
  viewCount?: number
}

export interface User {
  id: string
  username: string
  password: string
  email: string
  role: "admin" | "editor" | "viewer"
  createdAt: Date
  lastLogin?: Date
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
