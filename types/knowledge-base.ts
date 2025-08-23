export interface Category {
  id: string
  name: string
  description: string
  icon?: string
  articles?: Article[]
  subcategories?: Subcategory[]
  createdAt: Date
  updatedAt: Date
}

export interface Subcategory {
  id: string
  name: string
  description: string
  parentId: string
  articles?: Article[]
  createdAt: Date
  updatedAt: Date
}

export interface Article {
  id: string
  title: string
  content: string
  summary?: string
  categoryId: string
  subcategoryId?: string
  tags?: string[]
  author: string
  status: "draft" | "published" | "archived"
  priority: "low" | "medium" | "high"
  createdAt: Date
  updatedAt: Date
  viewCount?: number
  lastViewedAt?: Date
}

export interface User {
  id: string
  username: string
  password: string
  email: string
  role: "admin" | "editor" | "viewer"
  isActive: boolean
  createdAt: Date
  lastLogin: Date | null
}

// Alias for backward compatibility
export type KnowledgeBaseUser = User

export interface AuditLogEntry {
  id: string
  action: string
  articleId?: string
  articleTitle?: string
  categoryId?: string
  performedBy: string
  timestamp: Date
  details: string
}

export interface SystemStats {
  totalArticles: number
  totalCategories: number
  totalUsers: number
  pageViews: number
  lastUpdated: Date
}

export interface DatabaseData {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  stats?: SystemStats
}
