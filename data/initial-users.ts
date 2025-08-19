import type { User } from "../types/knowledge-base"

export const initialUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@kuhlekt.com",
    password: "admin123",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
]
