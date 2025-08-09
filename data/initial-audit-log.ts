import type { AuditLogEntry } from "../types/knowledge-base"

export const initialAuditLog: AuditLogEntry[] = [
  {
    id: "1",
    userId: "1",
    username: "admin",
    action: "System Initialized",
    details: "Knowledge base system initialized with default data",
    timestamp: "2024-01-15T09:00:00Z",
  },
  {
    id: "2",
    userId: "1",
    username: "admin",
    action: "Article Created",
    details: "Created article: Getting Started with Kuhlekt Knowledge Base",
    timestamp: "2024-01-15T10:00:00Z",
  },
  {
    id: "3",
    userId: "1",
    username: "admin",
    action: "Article Created",
    details: "Created article: User Management Guide",
    timestamp: "2024-01-15T11:00:00Z",
  },
]
