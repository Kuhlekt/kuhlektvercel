import type { AuditLogEntry } from "../types/knowledge-base"

export const initialAuditLog: AuditLogEntry[] = [
  {
    id: "1",
    timestamp: new Date("2024-01-01T10:00:00Z"),
    action: "system_initialized",
    username: "system",
    performedBy: "system",
    details: "Knowledge base system initialized with default data",
  },
  {
    id: "2",
    timestamp: new Date("2024-01-01T10:01:00Z"),
    action: "users_created",
    username: "system",
    performedBy: "system",
    details: "Default user accounts created (admin, editor, viewer)",
  },
  {
    id: "3",
    timestamp: new Date("2024-01-01T10:02:00Z"),
    action: "categories_created",
    username: "system",
    performedBy: "system",
    details: "Default categories and articles created",
  },
]
