import type { AuditLogEntry } from "../types/knowledge-base"

export const initialAuditLog: AuditLogEntry[] = [
  {
    id: "1",
    action: "system_initialized",
    entityType: "system",
    entityId: "kb-system",
    performedBy: "system",
    timestamp: new Date("2024-01-01T00:00:00.000Z"),
    details: "Knowledge base system initialized with default data",
  },
  {
    id: "2",
    action: "user_created",
    entityType: "user",
    entityId: "1",
    performedBy: "system",
    timestamp: new Date("2024-01-01T00:01:00.000Z"),
    details: "Default admin user created",
  },
  {
    id: "3",
    action: "categories_initialized",
    entityType: "category",
    entityId: "all",
    performedBy: "system",
    timestamp: new Date("2024-01-01T00:02:00.000Z"),
    details: "Initial categories and articles loaded",
  },
]
