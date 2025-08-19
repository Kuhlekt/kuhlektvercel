import type { AuditLogEntry } from "../types/knowledge-base"

export const initialAuditLog: AuditLogEntry[] = [
  {
    id: "1",
    action: "system_initialized",
    entityType: "article",
    entityId: "system",
    performedBy: "system",
    timestamp: new Date("2024-01-01T00:00:00.000Z"),
    details: "Knowledge base system initialized with default data",
  },
]
