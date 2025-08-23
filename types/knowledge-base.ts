export interface User {
  id: string
  username: string
  password: string
  role: "admin" | "editor" | "viewer"
  email?: string
  lastLogin?: Date | string
  createdAt: Date | string
  updatedAt: Date | string
  isActive?: boolean
}

export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  tags?: string[]
  createdAt: Date | string
  updatedAt: Date | string
  authorId?: string
  status?: "draft" | "published" | "archived"
  publishedAt?: string
}

export interface Subcategory {
  id: string
  name: string
  description?: string
  articles?: Article[]
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  articles?: Article[]
  subcategories?: Subcategory[]
  createdAt: Date | string
  updatedAt: Date | string
  parentId?: string
  order?: number
  isActive?: boolean
}

export interface AuditLogEntry {
  id: string
  action: string
  articleId?: string
  articleTitle?: string
  categoryId?: string
  categoryName?: string
  subcategoryName?: string
  userId?: string
  username: string
  performedBy?: string
  details: string
  timestamp: Date | string
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
  subcategoryName?: string
  tags?: string[]
  relevanceScore: number
  relevance: number
}

export interface UserSession {
  user: User | null
  isLoggedIn: boolean
  loginTime: Date | null
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
