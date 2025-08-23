export interface User {
  id: string
  username: string
  password: string
  role: "admin" | "editor" | "viewer"
  email: string
  isActive: boolean
  createdAt: string | Date
  lastLogin: string | Date | null
}

export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  tags: string[]
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Category {
  id: string
  name: string
  description: string
  icon?: string
  createdAt: string | Date
  updatedAt: string | Date
  articles: Article[]
  subcategories: Category[]
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

export interface SearchResult {
  type: "article" | "category"
  id: string
  title: string
  content?: string
  categoryName: string
  relevance: number
}

export interface UserRole {
  canRead: boolean
  canWrite: boolean
  canDelete: boolean
  canManageUsers: boolean
  canManageCategories: boolean
  canViewAudit: boolean
}

export const USER_ROLES: Record<string, UserRole> = {
  admin: {
    canRead: true,
    canWrite: true,
    canDelete: true,
    canManageUsers: true,
    canManageCategories: true,
    canViewAudit: true,
  },
  editor: {
    canRead: true,
    canWrite: true,
    canDelete: true,
    canManageUsers: false,
    canManageCategories: true,
    canViewAudit: false,
  },
  viewer: {
    canRead: true,
    canWrite: false,
    canDelete: false,
    canManageUsers: false,
    canManageCategories: false,
    canViewAudit: false,
  },
}
