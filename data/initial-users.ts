import type { User } from "../types/knowledge-base"

export const initialUsers: User[] = [
  {
    id: "admin-001",
    username: "admin",
    email: "admin@kuhlekt.com",
    password: "admin123",
    role: "admin",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    lastLogin: undefined,
  },
]
