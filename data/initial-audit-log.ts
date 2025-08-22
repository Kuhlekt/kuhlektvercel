import type { AuditLogEntry } from "../types/knowledge-base"

export const initialAuditLog: AuditLogEntry[] = [
  {
    id: "1",
    action: "system_initialized",
    performedBy: "system",
    username: "system",
    timestamp: new Date("2024-01-01"),
    details: "Knowledge base initialized with default data",
  },
  {
    id: "2",
    action: "article_created",
    performedBy: "system",
    username: "system",
    timestamp: new Date("2024-01-01"),
    articleId: "1",
    articleTitle: "Welcome to the Knowledge Base",
    categoryId: "1",
    details: "Initial welcome article created during setup",
  },
]
