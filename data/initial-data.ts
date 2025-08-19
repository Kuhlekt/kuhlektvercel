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
    title: "Welcome to Kuhlekt KB",
    content: "This is your knowledge base. Start by exploring the categories and articles.",
    categoryId: "1",
    authorId: "1",
    createdBy: "admin",
    tags: ["welcome", "introduction"],
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "How to Add Articles",
    content: "Learn how to create and manage articles in the knowledge base.",
    categoryId: "1",
    authorId: "1",
    createdBy: "admin",
    tags: ["tutorial", "articles"],
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
