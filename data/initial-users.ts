import type { User } from "../types/knowledge-base"

export const initialUsers: User[] = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    role: "admin",
    email: "admin@kuhlekt.com",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    username: "editor",
    password: "editor123",
    role: "editor",
    email: "editor@kuhlekt.com",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    username: "viewer",
    password: "viewer123",
    role: "viewer",
    email: "viewer@kuhlekt.com",
    createdAt: "2024-01-01T00:00:00Z",
  },
]
