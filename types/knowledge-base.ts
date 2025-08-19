export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  subcategoryId?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  author?: string
  status: "draft" | "published" | "archived"
}

export interface Subcategory {
  id: string
  name: string
  description?: string
  articles: Article[]
}

export interface Category {
  id: string
  name: string
  description?: string
  articles: Article[]
  subcategories: Subcategory[]
}

export interface User {
  id: string
  username: string
  password: string
  email: string
  role: "admin" | "editor" | "viewer"
  createdAt: Date
  lastLogin?: Date
}

export interface AuditLogEntry {
  id: string
  action: string
  entityType: "article" | "category" | "user"
  entityId: string
  performedBy: string
  timestamp: Date
  details: string
}

export interface UserManagementProps {
  users: User[]
  onUsersUpdate: (users: User[]) => void
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
  auditLog: AuditLogEntry[]
}
