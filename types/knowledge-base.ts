export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  subcategoryId?: string
  tags?: string[]
  author?: string
  createdAt: Date
  updatedAt: Date
  isPublished?: boolean
  views?: number
}

export interface Subcategory {
  id: string
  name: string
  description?: string
  articles?: Article[]
  createdAt: Date
  updatedAt?: Date
}

export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  articles?: Article[]
  subcategories?: Subcategory[]
  createdAt: Date
  updatedAt?: Date
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
  updatedAt?: Date
}

export interface AuditLogEntry {
  id: string
  action: string
  articleId?: string
  articleTitle?: string
  categoryId?: string
  performedBy: string
  timestamp: Date
  details: string
  ipAddress?: string
}

export interface KnowledgeBaseData {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  pageVisits?: number
  lastUpdated?: Date
}

export interface PageVisits {
  count: number
  lastVisit: Date
}
