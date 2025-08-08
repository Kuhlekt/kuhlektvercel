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
  pageViews?: number
}

export interface Subcategory {
  id: string
  name: string
  articles: Article[]
}

export interface Category {
  id: string
  name: string
  articles: Article[]
  subcategories: Subcategory[]
}

export interface User {
  id: string
  username: string
  password: string
  role: 'admin' | 'editor' | 'viewer'
  email: string
  lastLogin?: Date
}

export interface AuditLogEntry {
  id: string
  action: string
  articleId?: string
  articleTitle?: string
  categoryName?: string
  subcategoryName?: string
  performedBy: string
  timestamp: Date
  details?: string
}
