import type { User } from "@/types/knowledge-base"

export const initialUsers: User[] = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    email: "admin@kuhlekt.com",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    username: "editor",
    password: "editor123",
    email: "editor@kuhlekt.com",
    role: "editor",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    username: "viewer",
    password: "viewer123",
    email: "viewer@kuhlekt.com",
    role: "viewer",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-01T00:00:00Z",
  },
]
