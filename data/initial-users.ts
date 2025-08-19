import type { User } from "../types/knowledge-base"

export const initialUsers: User[] = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
]
