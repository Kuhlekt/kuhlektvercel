export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  authorId: string
  createdBy: string
  tags: string[]
  status: "draft" | "published"
  createdAt: Date
  updatedAt: Date
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
  createdAt: Date
  createdBy: string
}

export interface User {
  id: string
  username: string
  email: string
  password: string
  role: "admin" | "editor" | "viewer"
  createdAt: Date
  lastLogin?: Date
}

export interface AuditLog {
  id: string
  performedBy: string
  action: string
  details: string
  timestamp: Date
}

export interface UserManagementProps {
  users: User[]
  onUsersUpdate: (users: User[]) => void
  onAuditLogUpdate: (auditLog: AuditLog[]) => void
  auditLog: AuditLog[]
}
