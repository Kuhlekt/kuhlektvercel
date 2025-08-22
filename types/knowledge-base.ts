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
  articles?: Article[]
  subcategories?: Subcategory[]
  createdAt: Date | string
  updatedAt: Date | string
}

export interface User {
  id: string
  username: string
  password: string
  email: string
  role: "admin" | "editor" | "viewer"
  isActive: boolean
  createdAt: Date | string
  lastLogin: Date | string | null
}

export interface AuditLogEntry {
  id: string
  action: string
  performedBy: string
  username: string
  timestamp: Date | string
  details: string
  articleId?: string
  articleTitle?: string
  categoryId?: string
  categoryName?: string
  subcategoryName?: string
  userId?: string
}

export interface KnowledgeBaseData {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  pageVisits: number
}
