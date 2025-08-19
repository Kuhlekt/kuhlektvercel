export interface User {
  id: string
  username: string
  password: string
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
  expanded?: boolean
}

export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  subcategoryId?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  lastEditedBy?: string
  editCount?: number
}

export interface AuditLogEntry {
  id: string
  action: string
  articleId?: string
  articleTitle?: string
  categoryName?: string
  subcategoryName?: string
  userId?: string
  username?: string
  performedBy: string
  timestamp: Date
  details?: string
}
