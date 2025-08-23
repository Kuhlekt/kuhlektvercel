export interface User {
  id: string
  username: string
  password: string
  role: "admin" | "editor" | "viewer"
  email?: string
  lastLogin?: string
  createdAt: string
  isActive: boolean
}

export interface Category {
  id: string
  name: string
  description?: string
  parentId?: string
  children?: Category[]
  articleCount?: number
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
  lastViewedAt?: string
}

export interface AuditLogEntry {
  id: string
  userId: string
  username: string
  action: string
  details: string
  timestamp: string
  ipAddress?: string
  userAgent?: string
}

export interface KnowledgeBaseData {
  categories: Category[]
  articles: Article[]
  users: User[]
  auditLog: AuditLogEntry[]
  pageVisits: number
  lastUpdated: string
}

export interface SearchResult {
  type: "article" | "category"
  id: string
  title: string
  content?: string
  categoryName?: string
  relevance: number
}

export interface ImportData {
  categories?: Category[]
  articles?: Article[]
  users?: User[]
  auditLog?: AuditLogEntry[]
}

export interface ExportData extends ImportData {
  exportedAt: string
  version: string
}
