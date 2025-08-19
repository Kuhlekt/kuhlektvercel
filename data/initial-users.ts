import type { User } from "../types/knowledge-base"

export const initialUsers: User[] = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    email: "admin@kuhlekt.com",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    username: "editor",
    password: "editor123",
    email: "editor@kuhlekt.com",
    role: "editor",
    createdAt: new Date().toISOString(),
  },
]
