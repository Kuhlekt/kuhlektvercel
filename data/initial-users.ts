import type { User } from "../types/knowledge-base"

export const initialUsers: User[] = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    role: "admin",
    email: "admin@internal.local",
    createdAt: new Date("2024-01-01"),
    lastLogin: undefined
  },
  {
    id: "2", 
    username: "editor",
    password: "editor123",
    role: "editor",
    email: "editor@internal.local",
    createdAt: new Date("2024-01-01"),
    lastLogin: undefined
  },
  {
    id: "3",
    username: "viewer", 
    password: "viewer123",
    role: "viewer",
    email: "viewer@internal.local",
    createdAt: new Date("2024-01-01"),
    lastLogin: undefined
  }
]
