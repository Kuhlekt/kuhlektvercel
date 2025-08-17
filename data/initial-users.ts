import type { User } from "../types/knowledge-base"

export const initialUsers: User[] = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    email: "admin@kuhlekt.com",
    role: "admin",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    id: "2",
    username: "editor",
    password: "editor123",
    email: "editor@kuhlekt.com",
    role: "editor",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    id: "3",
    username: "viewer",
    password: "viewer123",
    email: "viewer@kuhlekt.com",
    role: "viewer",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
  },
]
