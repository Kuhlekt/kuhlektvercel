export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  subcategoryId?: string
  tags: string[]
  author?: string
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  lastEditedBy?: string
  editCount?: number
  isPublished?: boolean
  views?: number
}

export interface Subcategory {
  id: string
  name: string
  description: string
  articles: Article[]
  createdAt: Date
  updatedAt?: Date
}

export interface Category {
  id: string
  name: string
  description: string
  icon?: string
  color?: string
  articles: Article[]
  subcategories: Subcategory[]
  createdAt: Date
  updatedAt?: Date
}

export interface User {
  id: string
  username: string
  password: string
  email: string
  role: "admin" | "editor" | "viewer"
  isActive?: boolean
  createdAt: Date
  lastLogin?: Date | null
}

export interface AuditLogEntry {
  id: string
  action: string
  articleId?: string
  articleTitle?: string
  categoryId?: string
  categoryName?: string
  subcategoryName?: string
  userId?: string
  username?: string
  performedBy: string
  timestamp: Date
  details: string
}

export interface KnowledgeBaseData {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  pageVisits: number
  lastUpdated?: Date
}

export interface SearchResult {
  type: "article" | "category" | "subcategory"
  id: string
  title: string
  content?: string
  categoryName?: string
  subcategoryName?: string
  relevance: number
}
