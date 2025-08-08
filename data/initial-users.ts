import type { User } from '@/types/knowledge-base'

export const initialUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    email: 'admin@kuhlekt.com',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2024-01-25')
  },
  {
    id: '2',
    username: 'editor',
    password: 'editor123',
    name: 'Content Editor',
    email: 'editor@kuhlekt.com',
    role: 'editor',
    createdAt: new Date('2024-01-02'),
    lastLogin: new Date('2024-01-24')
  }
]
