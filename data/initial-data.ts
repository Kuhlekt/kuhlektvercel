import type { Category, Article } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Basic information and setup guides",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Technical Documentation",
    description: "Detailed technical guides and references",
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
    title: "Welcome to Kuhlekt Knowledge Base",
    content:
      "This is your comprehensive knowledge base system. You can browse articles by category, search for specific content, and manage your knowledge efficiently.",
    categoryId: "1",
    authorId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["welcome", "introduction"],
    status: "published",
  },
  {
    id: "2",
    title: "How to Add New Articles",
    content:
      'To add a new article, click the "Add Article" button in the navigation. Fill in the title, select a category, add content, and optionally include tags.',
    categoryId: "1",
    authorId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["tutorial", "articles"],
    status: "published",
  },
]
