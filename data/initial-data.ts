import type { Category } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Basic information to get you started",
    articles: [
      {
        id: "1",
        title: "Welcome to Kuhlekt Knowledge Base",
        content:
          "This is your comprehensive knowledge base system. Here you can browse articles, search for information, and manage content.",
        categoryId: "1",
        tags: ["welcome", "introduction"],
        author: "System",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
      },
      {
        id: "2",
        title: "How to Navigate",
        content:
          "Use the category tree on the left to browse articles. You can also use the search bar at the top to find specific content.",
        categoryId: "1",
        tags: ["navigation", "help"],
        author: "System",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
      },
    ],
    subcategories: [],
  },
  {
    id: "2",
    name: "User Management",
    description: "Information about user accounts and permissions",
    articles: [
      {
        id: "3",
        title: "User Roles",
        content:
          "There are three user roles: Admin (full access), Editor (can create/edit articles), and Viewer (read-only access).",
        categoryId: "2",
        tags: ["users", "roles", "permissions"],
        author: "System",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
      },
    ],
    subcategories: [
      {
        id: "2-1",
        name: "Account Settings",
        description: "Managing your account",
        articles: [
          {
            id: "4",
            title: "Changing Your Password",
            content:
              "To change your password, contact your administrator. Password changes require admin approval for security.",
            categoryId: "2",
            subcategoryId: "2-1",
            tags: ["password", "security"],
            author: "System",
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Technical Documentation",
    description: "Technical guides and documentation",
    articles: [],
    subcategories: [
      {
        id: "3-1",
        name: "API Documentation",
        description: "API guides and references",
        articles: [
          {
            id: "5",
            title: "REST API Overview",
            content:
              "Our REST API provides programmatic access to the knowledge base. Authentication is required for all endpoints.",
            categoryId: "3",
            subcategoryId: "3-1",
            tags: ["api", "rest", "technical"],
            author: "System",
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
          },
        ],
      },
    ],
  },
]
