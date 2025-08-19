import type { User } from "../types/knowledge-base"

export const initialUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@kuhlekt.com",
    password: "admin123",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: undefined,
  },
  {
    id: "2",
    username: "editor",
    email: "editor@kuhlekt.com",
    password: "editor123",
    role: "editor",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: undefined,
  },
  {
    id: "3",
    username: "viewer",
    email: "viewer@kuhlekt.com",
    password: "viewer123",
    role: "viewer",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: undefined,
  },
]
