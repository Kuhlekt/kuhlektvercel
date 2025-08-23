export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  subcategoryId?: string
  tags?: string[]
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Subcategory {
  id: string
  name: string
  description?: string
  articles?: Article[]
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  articles?: Article[]
  subcategories?: Subcategory[]
  createdAt: Date | string
  updatedAt: Date | string
}

export interface User {
  id: string
  username: string
  password: string
  role: "admin" | "editor" | "viewer"
  email?: string
  isActive: boolean
  createdAt: Date | string
  lastLogin?: Date | string | null
}

// Alias for backward compatibility
export type KnowledgeBaseUser = User

export interface AuditLogEntry {
  id: string
  timestamp: Date | string
  action: string
  articleId?: string
  articleTitle?: string
  categoryId?: string
  categoryName?: string
  subcategoryName?: string
  userId?: string
  username: string
  performedBy?: string
  details: string
}

export interface KnowledgeBaseData {
  categories: Category[]
  articles?: Article[]
  users: User[]
  auditLog: AuditLogEntry[]
  pageVisits: number
}

export interface SearchResult {
  article: Article
  category: Category
  subcategory?: Subcategory
}
