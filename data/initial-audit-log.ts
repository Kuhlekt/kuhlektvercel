import type { AuditLogEntry } from '@/types/knowledge-base'

export const initialAuditLog: AuditLogEntry[] = [
  {
    id: '1',
    action: 'create_article',
    userId: '1',
    userName: 'Administrator',
    timestamp: new Date('2024-01-15T10:30:00'),
    details: 'Created article "Getting Started with React Hooks"',
    targetId: '1'
  },
  {
    id: '2',
    action: 'create_article',
    userId: '2',
    userName: 'Content Editor',
    timestamp: new Date('2024-01-10T14:20:00'),
    details: 'Created article "Advanced TypeScript Patterns"',
    targetId: '2'
  },
  {
    id: '3',
    action: 'create_category',
    userId: '1',
    userName: 'Administrator',
    timestamp: new Date('2024-01-05T09:15:00'),
    details: 'Created category "Frontend Development"',
    targetId: '1'
  }
]
