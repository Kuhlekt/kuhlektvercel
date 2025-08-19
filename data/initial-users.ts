import type { User } from "../types/knowledge-base"

export const initialUsers: User[] = [
  {
    id: "admin-001",
    username: "admin",
    password: "admin123",
    email: "admin@kuhlekt.com",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    lastLogin: undefined,
  },
]
