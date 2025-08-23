export interface User {
  id: string
  username: string
  password: string
  email?: string
  role: "admin" | "editor" | "viewer"
  isActive: boolean
  createdAt: string | Date
  lastLogin?: string | Date
}

export interface KnowledgeBaseUser extends User {
  // Extended user interface for knowledge base specific fields
}

export interface Category {
  id: string
  name: string
  description: string
  parentId?: string
  color?: string
  icon?: string
  isActive: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  author: string
  tags: string[]
  isPublished: boolean
  views: number
  createdAt: string | Date
  updatedAt: string | Date
}

export interface AuditLogEntry {
  id: string
  action: string
  userId?: string
  username?: string
  performedBy: string
  timestamp: string | Date
  details: string
}

export interface KnowledgeBaseData {
  categories: Category[]
  articles: Article[]
  users: KnowledgeBaseUser[]
  auditLog: AuditLogEntry[]
  pageVisits: number
}

export interface Stats {
  totalUsers: number
  totalArticles: number
  totalCategories: number
  totalViews: number
  recentActivity: AuditLogEntry[]
}
