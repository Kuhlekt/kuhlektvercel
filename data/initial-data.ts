import type { Category, Article } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Basic information to get you started",
    createdAt: new Date().toISOString(),
    createdBy: "admin",
  },
  {
    id: "2",
    name: "Technical Documentation",
    description: "Technical guides and documentation",
    createdAt: new Date().toISOString(),
    createdBy: "admin",
  },
  {
    id: "3",
    name: "FAQ",
    description: "Frequently asked questions",
    createdAt: new Date().toISOString(),
    createdBy: "admin",
  },
  {
    id: "4",
    name: "Troubleshooting",
    description: "Common issues and solutions",
    createdAt: new Date().toISOString(),
    createdBy: "admin",
  },
]

export const initialArticles: Article[] = [
  {
    id: "1",
    title: "Welcome to the Knowledge Base",
    content:
      "This is your comprehensive knowledge base system. Here you can find all the information you need to get started and make the most of our platform.",
    categoryId: "1",
    authorId: "1",
    createdBy: "admin",
    tags: ["welcome", "introduction", "getting-started"],
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "How to Create Your First Article",
    content:
      "Creating articles is easy! Simply click the 'Add Article' button in the navigation bar, fill out the form with your content, select a category, and publish.",
    categoryId: "1",
    authorId: "1",
    createdBy: "admin",
    tags: ["tutorial", "articles", "creation"],
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "API Documentation",
    content:
      "Our API provides comprehensive access to all platform features. Use RESTful endpoints to integrate with your applications.",
    categoryId: "2",
    authorId: "2",
    createdBy: "editor",
    tags: ["api", "documentation", "integration"],
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "Common Login Issues",
    content:
      "If you're having trouble logging in, try clearing your browser cache, checking your credentials, or contacting support.",
    categoryId: "4",
    authorId: "1",
    createdBy: "admin",
    tags: ["login", "troubleshooting", "support"],
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
