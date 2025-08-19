import type { User } from "../types/knowledge-base"

export const initialUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@kuhlekt.com",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    username: "editor",
    email: "editor@kuhlekt.com",
    role: "editor",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    username: "viewer",
    email: "viewer@kuhlekt.com",
    role: "viewer",
    createdAt: new Date().toISOString(),
  },
]

// Simple password storage (in production, use proper hashing)
export const userPasswords: Record<string, string> = {
  admin: "admin123",
  editor: "editor123",
  viewer: "viewer123",
}
