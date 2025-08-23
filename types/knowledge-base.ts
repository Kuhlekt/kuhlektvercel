export interface User {
  id: string
  username: string
  password: string
  role: "admin" | "editor" | "viewer"
  email?: string
  createdAt: string
  lastLogin?: string
  isActive: boolean
}

export interface Category {
  id: string
  name: string
  description?: string
  parentId?: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  authorId: string
  tags: string[]
  isPublished: boolean
  createdAt: string
  updatedAt: string
  viewCount: number
}

export interface AuditLogEntry {
  id: string
  userId: string
  action: string
  details: string
  timestamp: string
  ipAddress?: string
}

export interface KnowledgeBaseData {
  categories: Category[]
  articles: Article[]
  users: User[]
  auditLog: AuditLogEntry[]
  pageVisits: number
}

// Backward compatibility
export type KnowledgeBaseUser = User
