export interface User {
  id: string
  username: string
  password: string
  email: string
  role: "admin" | "editor" | "viewer"
  isActive: boolean
  createdAt: Date | string
  lastLogin?: Date | string | null
}

export interface KnowledgeBaseUser {
  id: string
  username: string
  password: string
  email: string
  role: "admin" | "editor" | "viewer"
  isActive: boolean
  createdAt: Date | string
  lastLogin?: Date | string | null
}

export interface Category {
  id: string
  name: string
  description: string
  createdAt: Date | string
  updatedAt: Date | string
  subcategories?: Subcategory[]
  articles?: Article[]
}

export interface Subcategory {
  id: string
  name: string
  description: string
  createdAt: Date | string
  updatedAt: Date | string
  articles?: Article[]
}

export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  subcategoryId?: string
  author: string
  createdAt: Date | string
  updatedAt: Date | string
  tags: string[]
  views: number
  createdBy?: string
  lastEditedBy?: string
  editCount?: number
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
  timestamp: Date | string
  details: string
}

export interface KnowledgeBaseData {
  categories: Category[]
  articles?: Article[]
  users: KnowledgeBaseUser[]
  auditLog: AuditLogEntry[]
  pageVisits?: number
  lastUpdated?: Date | string
}
