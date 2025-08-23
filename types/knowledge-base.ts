export interface User {
  id: string
  username: string
  password: string
  role: "admin" | "editor" | "viewer"
  isActive: boolean
  createdAt: Date
  lastLogin: Date | null
}

export interface KnowledgeBaseUser {
  id: string
  username: string
  password: string
  email: string
  role: "admin" | "editor" | "viewer"
  isActive: boolean
  createdAt: Date
  lastLogin: Date | null
}

export interface Category {
  id: string
  name: string
  description?: string
  parentId?: string
  children?: Category[]
  articleCount?: number
  createdAt: Date
  updatedAt: Date
}

export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  tags: string[]
  author: string
  createdAt: Date
  updatedAt: Date
  isPublished: boolean
  views: number
}

export interface AuditLogEntry {
  id: string
  action: string
  performedBy: string
  timestamp: Date
  details: string
  articleId?: string
  articleTitle?: string
}

export interface KnowledgeBaseData {
  categories: Category[]
  articles: Article[]
  users: KnowledgeBaseUser[]
  auditLog: AuditLogEntry[]
  pageVisits: number
}
