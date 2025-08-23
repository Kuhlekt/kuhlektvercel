export interface User {
  id: string
  username: string
  password: string
  email: string
  role: "admin" | "editor" | "viewer"
  isActive: boolean
  createdAt: string
  lastLogin?: string
}

export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  tags: string[]
  authorId: string
  status: "draft" | "published" | "archived"
  createdAt: string
  updatedAt: string
  viewCount: number
  lastViewedAt?: string
  isPublished: boolean
}

export interface Subcategory {
  id: string
  name: string
  description: string
  articles: Article[]
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description: string
  parentId?: string
  subcategories?: Category[]
  articles?: Article[]
  createdAt: string
  updatedAt: string
}

export interface AuditLogEntry {
  id: string
  action: string
  userId?: string
  articleId?: string
  articleTitle?: string
  categoryId?: string
  performedBy: string
  timestamp: string
  details: string
}

export interface PageVisit {
  id: string
  page: string
  timestamp: string
  userAgent?: string
  ip?: string
}

export interface KnowledgeBaseData {
  categories: Category[]
  articles: Article[]
  users: User[]
  auditLog: AuditLogEntry[]
  pageVisits: number
}

export interface SearchResult {
  type: "article" | "category"
  id: string
  title: string
  content?: string
  categoryName?: string
  relevance: number
}

export interface UserSession {
  user: User
  isLoggedIn: boolean
  loginTime: string
  expiresAt: string
}

export interface SystemStats {
  totalArticles: number
  totalCategories: number
  totalUsers: number
  pageVisits: number
  lastUpdated: Date
}

export interface ImportExportData {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  settings: {
    pageVisits: number
    exportedAt: string
    version: string
  }
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

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthUser {
  id: string
  username: string
  role: "admin" | "editor" | "viewer"
  email: string
}
