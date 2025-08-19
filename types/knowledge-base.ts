export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  subcategoryId?: string
  authorId: string
  createdAt: Date
  updatedAt: Date
  status: "draft" | "published"
  tags: string[]
  createdBy: string
  editCount?: number
  lastEditedBy?: string
}

export interface Subcategory {
  id: string
  name: string
  description?: string
  categoryId: string
  articles: Article[]
}

export interface Category {
  id: string
  name: string
  description?: string
  parentId?: string
  createdAt: string
  subcategories: Subcategory[]
  articles: Article[]
}

export interface User {
  id: string
  username: string
  email: string
  password: string
  role: "admin" | "editor" | "viewer"
  createdAt: string
  lastLogin?: string
}

export interface AuditLogEntry {
  id: string
  action: string
  entityType: string
  entityId: string
  performedBy: string
  timestamp: Date
  details: string
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  details: string
  timestamp: string
}

export interface UserManagementProps {
  users: User[]
  onUsersUpdate: (users: User[]) => void
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
  auditLog: AuditLogEntry[]
}
