import type { AuditLog } from "../types/knowledge-base"

export const initialAuditLog: AuditLog[] = [
  {
    id: "1",
    performedBy: "1",
    action: "SYSTEM_INIT",
    details: "Knowledge Base system initialized",
    timestamp: new Date(),
  },
]
