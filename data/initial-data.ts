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
    name: "User Guide",
    description: "Comprehensive user documentation",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Technical Documentation",
    description: "Technical specifications and API documentation",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
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
      "This is your comprehensive knowledge base system. Here you can find all the information you need to get started and make the most of our platform.",
    categoryId: "1",
    authorId: "1",
    tags: ["welcome", "introduction", "getting-started"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "How to Create Your First Article",
    content:
      "Creating articles is easy! Simply click the 'Add Article' button in the navigation bar, fill out the form with your content, select a category, and publish.",
    categoryId: "1",
    authorId: "1",
    tags: ["tutorial", "articles", "creation"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "User Management Guide",
    content: "Learn how to manage users, assign roles, and control access permissions in the admin dashboard.",
    categoryId: "2",
    authorId: "1",
    tags: ["users", "management", "admin"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "API Documentation",
    content: "Complete API reference for developers. Includes authentication, endpoints, and example requests.",
    categoryId: "3",
    authorId: "1",
    tags: ["api", "development", "technical"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Common Issues and Solutions",
    content: "Find solutions to the most common problems users encounter when using the platform.",
    categoryId: "4",
    authorId: "1",
    tags: ["troubleshooting", "issues", "solutions"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
]
