export interface User {
  id: string
  username: string
  password: string
  role: "admin" | "editor" | "viewer"
  email: string
  createdAt: string
  lastLogin: string | null
}

export interface Category {
  id: string
  name: string
  description: string
  parentId: string | null
  articles: Article[]
}

export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  authorId: string
  createdAt: string
  updatedAt: string
  tags: string[]
  isPublished: boolean
}

export interface AuditLogEntry {
  id: string
  action: string
  userId: string
  timestamp: string
  details: string
}

export interface KnowledgeBaseData {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  pageVisits: number
}

// Backward compatibility
export type KnowledgeBaseUser = User
