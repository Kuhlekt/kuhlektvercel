import type { User } from "../types/knowledge-base"

export const initialUsers: User[] = [
  {
    id: "1",
    username: "admin",
    password: "admin123", // In production, this should be hashed
    email: "admin@kuhlekt.com",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    lastLogin: undefined,
  },
  {
    id: "2",
    username: "editor",
    password: "editor123", // In production, this should be hashed
    email: "editor@kuhlekt.com",
    role: "editor",
    createdAt: new Date("2024-01-01"),
    lastLogin: undefined,
  },
  {
    id: "3",
    username: "viewer",
    password: "viewer123", // In production, this should be hashed
    email: "viewer@kuhlekt.com",
    role: "viewer",
    createdAt: new Date("2024-01-01"),
    lastLogin: undefined,
  },
]
