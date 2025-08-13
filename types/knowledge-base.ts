export interface User {
  id: string
  username: string
  email: string
  role: "admin" | "editor" | "viewer"
  createdAt: Date
  lastLogin?: Date
}

export interface Category {
  id: string
  name: string
  description?: string
  subcategories: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  description?: string
}

export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  subcategoryId?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
  editCount?: number
  lastEditedBy?: string
}

export interface AuditLogEntry {
  id: string
  action: "create" | "update" | "delete" | "login" | "logout"
  entityType: "article" | "category" | "user"
  entityId: string
  userId: string
  username: string
  timestamp: Date
  details?: string
  oldValue?: any
  newValue?: any
}

export interface KnowledgeBaseState {
  categories: Category[]
  articles: Article[]
  users: User[]
  auditLog: AuditLogEntry[]
  currentUser: User | null
  isAuthenticated: boolean
}
