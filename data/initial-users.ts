import type { User } from "../types/knowledge-base"

export const initialUsers: User[] = [
  {
    id: "1",
    username: "admin",
    password: "kuhlekt2024",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    lastLogin: undefined,
  },
  {
    id: "2",
    username: "editor",
    password: "editor123",
    role: "editor",
    createdAt: new Date("2024-01-01"),
    lastLogin: undefined,
  },
]
