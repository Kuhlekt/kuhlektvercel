export interface User {
  id: string
  username: string
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
  subcategoryId?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
  editCount?: number
  lastEditedBy?: string
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
    | "user_created"
    | "user_updated"
    | "user_deleted"
  articleId?: string
  articleTitle?: string
  categoryId?: string
  categoryName?: string
  subcategoryName?: string
  userId?: string
  username?: string
  performedBy: string
  timestamp: Date
  details?: string
}
