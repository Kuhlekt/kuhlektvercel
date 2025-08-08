import type { User } from "../types/knowledge-base"

export const initialUsers: User[] = [
  {
    id: "admin-001",
    username: "admin",
    password: "admin123",
    role: "admin",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    lastLogin: undefined
  },
  {
    id: "editor-001", 
    username: "editor",
    password: "editor123",
    role: "editor",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    lastLogin: undefined
  },
  {
    id: "viewer-001",
    username: "viewer", 
    password: "viewer123",
    role: "viewer",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    lastLogin: undefined
  }
]
