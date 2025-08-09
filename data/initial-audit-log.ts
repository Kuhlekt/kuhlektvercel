import type { AuditLogEntry } from "@/types/knowledge-base"

export const initialAuditLog: AuditLogEntry[] = [
  {
    id: "1",
    action: "System Initialized",
    userId: "system",
    username: "System",
    timestamp: "2024-01-01T00:00:00Z",
    details: "Knowledge base system initialized with default data",
    entityType: "system",
  },
  {
    id: "2",
    action: "Article Created",
    userId: "1",
    username: "admin",
    timestamp: "2024-01-01T00:00:00Z",
    details: "Created article: Getting Started with Kuhlekt Knowledge Base",
    entityType: "article",
    entityId: "1",
  },
  {
    id: "3",
    action: "User Created",
    userId: "1",
    username: "admin",
    timestamp: "2024-01-01T00:00:00Z",
    details: "Created user accounts for admin, editor, and viewer",
    entityType: "user",
  },
]
