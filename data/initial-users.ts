import type { User } from "../types/knowledge-base"

export const initialUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@kuhlekt.com",
    password: "admin123",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    username: "editor",
    email: "editor@kuhlekt.com",
    password: "editor123",
    role: "editor",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    username: "viewer",
    email: "viewer@kuhlekt.com",
    password: "viewer123",
    role: "viewer",
    createdAt: new Date().toISOString(),
  },
]
