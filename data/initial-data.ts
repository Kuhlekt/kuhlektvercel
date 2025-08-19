import type { Category, Article } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Basic information to get you started",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Technical Documentation",
    description: "Technical guides and documentation",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "FAQ",
    description: "Frequently asked questions",
    createdAt: new Date().toISOString(),
  },
]

export const initialArticles: Article[] = [
  {
    id: "1",
    title: "Welcome to the Knowledge Base",
    content:
      "This is your comprehensive knowledge base system. Here you can browse articles, search for information, and if you have the right permissions, add new content.",
    categoryId: "1",
    authorId: "1",
    tags: ["welcome", "introduction"],
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "How to Login",
    content:
      "To access admin features, click the Login button in the top right corner. Use the credentials: admin / admin123",
    categoryId: "1",
    authorId: "1",
    tags: ["login", "authentication"],
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
