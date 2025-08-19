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
    description: "Technical guides and API documentation",
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
      "This is your comprehensive knowledge base system. Here you can browse articles, search for information, and manage content. Use the navigation above to explore different sections.",
    categoryId: "1",
    authorId: "1",
    tags: ["welcome", "introduction"],
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "How to Add Articles",
    content:
      "To add new articles, you need to be logged in with editor or admin privileges. Click the 'Add Article' button in the navigation, fill out the form with your content, select a category, and add relevant tags.",
    categoryId: "1",
    authorId: "1",
    tags: ["tutorial", "articles"],
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "API Documentation",
    content:
      "This section contains technical documentation for our APIs. You'll find endpoint descriptions, request/response examples, and authentication details here.",
    categoryId: "2",
    authorId: "1",
    tags: ["api", "technical", "documentation"],
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
