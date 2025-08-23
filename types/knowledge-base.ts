export interface User {
  id: string
  username: string
  password: string
  role: "admin" | "editor" | "viewer"
  email: string
  isActive?: boolean
  createdAt: string | Date
  lastLogin: string | Date | null
}

export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  subcategoryId?: string
  tags?: string[]
  createdAt: string | Date
  updatedAt: string | Date
  createdBy?: string
}

export interface Category {
  id: string
  name: string
  description: string
  icon?: string
  parentId?: string | null
  createdAt?: string | Date
  updatedAt?: string | Date
  articles?: Article[]
  subcategories?: Category[]
}

export interface AuditLogEntry {
  id: string
  action: string
  timestamp: string | Date
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

// Backward compatibility alias
export type KnowledgeBaseUser = User
