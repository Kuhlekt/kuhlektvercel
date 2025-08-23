export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  subcategoryId?: string
  tags: string[]
  author: string
  authorId?: string
  createdAt: Date
  updatedAt: Date
  views: number
  isPublished?: boolean
  lastViewedAt?: Date
  viewCount?: number
}

export interface Subcategory {
  id: string
  name: string
  description: string
  articles?: Article[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Category {
  id: string
  name: string
  description: string
  articles?: Article[]
  subcategories?: Subcategory[]
  createdAt?: Date
  updatedAt?: Date
  icon?: string
}

export interface User {
  id: string
  username: string
  email: string
  role: "admin" | "editor" | "viewer"
  password: string
  createdAt: Date
  lastLogin?: Date
  isActive?: boolean
}

export interface AuditLogEntry {
  id: string
  action: string
  performedBy: string
  timestamp: Date
  details: string
  articleId?: string
  articleTitle?: string
  categoryId?: string
}

export interface KnowledgeBaseData {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  pageVisits?: number
  lastUpdated?: Date
}
