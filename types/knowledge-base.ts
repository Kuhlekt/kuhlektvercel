export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  subcategoryId?: string
  authorId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  status: "draft" | "published"
  tags: string[]
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
  createdAt: Date
  createdBy: string
  subcategories: Category[]
  articles: Article[]
}

export interface User {
  id: string
  username: string
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  createdAt: Date
  lastLogin?: Date
  isActive: boolean
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

export interface SearchResult {
  type: "article" | "category"
  id: string
  title: string
  content?: string
  categoryName?: string
  relevance: number
}
