import type { Category, Article } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Essential information for new users",
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
    title: "Welcome to Kuhlekt Knowledge Base",
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
      "Creating articles is easy! Simply click the 'Add Article' button in the navigation bar, fill out the form with your content, and publish it to share with others.",
    categoryId: "1",
    authorId: "1",
    tags: ["tutorial", "articles", "creation"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "User Management Guide",
    content:
      "Learn how to manage users, assign roles, and control access to different parts of the knowledge base. This guide covers all administrative functions.",
    categoryId: "2",
    authorId: "1",
    tags: ["users", "management", "admin"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "API Documentation",
    content:
      "Complete API reference for developers. Includes endpoints, authentication, request/response formats, and code examples.",
    categoryId: "3",
    authorId: "1",
    tags: ["api", "development", "technical"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Common Issues and Solutions",
    content:
      "Find solutions to the most common problems users encounter. This article is regularly updated with new issues and their resolutions.",
    categoryId: "4",
    authorId: "1",
    tags: ["troubleshooting", "support", "solutions"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
]
