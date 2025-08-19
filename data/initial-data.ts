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
    name: "User Guides",
    description: "Step-by-step guides for common tasks",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Technical Documentation",
    description: "Detailed technical information and API references",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "FAQ",
    description: "Frequently asked questions and answers",
    createdAt: new Date().toISOString(),
  },
]

export const initialArticles: Article[] = [
  {
    id: "1",
    title: "Welcome to the Knowledge Base",
    content:
      "This is your comprehensive knowledge base system. Here you can find all the information you need to get started and make the most of our platform. Navigate through the categories on the left to explore different topics.",
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
      "Creating articles is easy! Simply click the 'Add Article' button in the navigation bar. Fill in the title, select a category, add your content, and include relevant tags. You can save as draft or publish immediately.",
    categoryId: "2",
    authorId: "1",
    tags: ["tutorial", "articles", "creation"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "User Management Guide",
    content:
      "Administrators can manage users through the Admin Dashboard. You can create new users, modify existing ones, and assign different roles (admin, editor, viewer) based on permissions needed.",
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
      "Our knowledge base provides a comprehensive API for integration with external systems. The API supports CRUD operations for articles, categories, and user management.",
    categoryId: "3",
    authorId: "1",
    tags: ["api", "documentation", "integration"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "How do I reset my password?",
    content:
      "To reset your password, contact your administrator. Currently, password reset functionality is handled through admin users who can update user credentials in the user management section.",
    categoryId: "4",
    authorId: "1",
    tags: ["password", "reset", "help"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
]
