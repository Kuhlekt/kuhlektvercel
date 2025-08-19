import type { User } from "../types/knowledge-base"

export const initialUsers: User[] = [
  {
    id: "1",
    username: "admin",
    name: "Administrator",
    email: "admin@kuhlekt.com",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    isActive: true,
  },
  {
    id: "2",
    username: "editor",
    name: "Content Editor",
    email: "editor@kuhlekt.com",
    role: "editor",
    createdAt: new Date("2024-01-01"),
    isActive: true,
  },
  {
    id: "3",
    username: "viewer",
    name: "Content Viewer",
    email: "viewer@kuhlekt.com",
    role: "viewer",
    createdAt: new Date("2024-01-01"),
    isActive: true,
  },
]

export const userPasswords: Record<string, string> = {
  admin: "admin123",
  editor: "editor123",
  viewer: "viewer123",
}
