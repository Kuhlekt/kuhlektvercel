export interface Category {
  id: string
  name: string
  description: string
  icon?: string
  parentId?: string | null
  createdAt: Date | string
  updatedAt: Date | string
  articles?: Article[]
  subcategories?: Category[]
}

export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  tags?: string[]
  createdAt: Date | string
  updatedAt: Date | string
  createdBy?: string
}

export interface User {
  id: string
  username: string
  password: string
  role: "admin" | "editor" | "viewer"
  email: string
  isActive: boolean
  createdAt: Date | string
  lastLogin: Date | string | null
}

export interface AuditLogEntry {
  id: string
  action: string
  timestamp: Date | string
  username: string
  performedBy: string
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
