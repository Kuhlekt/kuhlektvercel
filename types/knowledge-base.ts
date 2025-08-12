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
}

export interface Subcategory {
  id: string
  name: string
  articles: Article[]
}

export interface Category {
  id: string
  name: string
  subcategories: Subcategory[]
  articles: Article[]
  expanded: boolean
}

export interface KnowledgeBase {
  categories: Category[]
}

export interface User {
  id: string
  username: string
  password: string
  role: "admin" | "editor" | "viewer"
  createdAt: Date
  lastLogin?: Date
}

export interface AuditLogEntry {
  id: string
  action: "article_created" | "article_deleted" | "article_updated"
  articleId: string
  articleTitle: string
  categoryName: string
  subcategoryName?: string
  performedBy: string
  timestamp: Date
  details?: string
}
