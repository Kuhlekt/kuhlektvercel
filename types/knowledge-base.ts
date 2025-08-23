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
  tags: string[]
  author: string
  createdAt: string
  updatedAt: string
  isPublished: boolean
  views: number
  lastViewedAt?: string
}

export interface AuditLog {
  id: string
  userId: string
  username: string
  action: string
  details: string
  timestamp: string
  ipAddress?: string
}

export interface KnowledgeBaseData {
  users: User[]
  categories: Category[]
  articles: Article[]
  auditLog: AuditLog[]
  settings: {
    siteName: string
    description: string
    version: string
    lastBackup?: string
  }
  stats: {
    totalUsers: number
    totalArticles: number
    totalCategories: number
    totalViews: number
    lastUpdated: string
  }
}

export interface SearchResult {
  type: "article" | "category"
  id: string
  title: string
  content?: string
  categoryName?: string
  relevance: number
}

export interface NavigationItem {
  id: string
  label: string
  path: string
  icon?: string
  children?: NavigationItem[]
}
