import type { Category, Article } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Basic information to get you started",
    createdAt: new Date().toISOString(),
    subcategories: [],
    articles: [],
  },
  {
    id: "2",
    name: "Technical Documentation",
    description: "Technical guides and documentation",
    createdAt: new Date().toISOString(),
    subcategories: [],
    articles: [],
  },
]

export const initialArticles: Article[] = [
  {
    id: "1",
    title: "Welcome to Knowledge Base",
    content: "This is your first article in the knowledge base.",
    categoryId: "1",
    authorId: "1",
    createdBy: "admin",
    tags: ["welcome", "getting-started"],
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
