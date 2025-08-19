import type { Category, Article } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Essential information for new users",
    createdAt: "2024-01-01T00:00:00Z",
    subcategories: [],
    articles: [],
  },
  {
    id: "2",
    name: "Technical Documentation",
    description: "Detailed technical guides and references",
    createdAt: "2024-01-01T00:00:00Z",
    subcategories: [],
    articles: [],
  },
  {
    id: "3",
    name: "FAQ",
    description: "Frequently asked questions and answers",
    createdAt: "2024-01-01T00:00:00Z",
    subcategories: [],
    articles: [],
  },
]

export const initialArticles: Article[] = [
  {
    id: "1",
    title: "Welcome to Kuhlekt Knowledge Base",
    content: `# Welcome to Kuhlekt Knowledge Base

This is your comprehensive knowledge management system. Here you can:

- Browse articles by category
- Search for specific information
- Create and edit content (with proper permissions)
- Manage users and system settings

## Getting Started

1. **Browse Categories**: Use the sidebar to navigate through different categories
2. **Search**: Use the search bar to find specific articles
3. **Login**: Click the login button to access editing features

## User Roles

- **Viewer**: Can read articles and search
- **Editor**: Can create and edit articles
- **Admin**: Full system access including user management

Enjoy exploring the knowledge base!`,
    categoryId: "1",
    authorId: "1",
    createdBy: "admin",
    tags: ["welcome", "getting-started"],
    status: "published",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "2",
    title: "How to Create Articles",
    content: `# How to Create Articles

Creating articles in the knowledge base is simple:

## Prerequisites
- You must be logged in as an Editor or Admin
- Select the appropriate category for your article

## Steps
1. Click the "Add Article" button
2. Fill in the article title
3. Select a category
4. Add relevant tags
5. Write your content using Markdown
6. Choose to save as draft or publish immediately

## Markdown Support
The editor supports full Markdown syntax including:
- Headers
- Lists
- Links
- Code blocks
- Images
- Tables

Happy writing!`,
    categoryId: "1",
    authorId: "2",
    createdBy: "editor",
    tags: ["tutorial", "articles", "editing"],
    status: "published",
    createdAt: new Date("2024-01-02T00:00:00Z"),
    updatedAt: new Date("2024-01-02T00:00:00Z"),
  },
  {
    id: "3",
    title: "API Documentation",
    content: `# API Documentation

## Overview
This document describes the internal API structure of the knowledge base.

## Data Models

### Article
\`\`\`typescript
interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  authorId: string
  tags: string[]
  status: "draft" | "published"
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### Category
\`\`\`typescript
interface Category {
  id: string
  name: string
  description: string
  subcategories: Subcategory[]
  articles: Article[]
}
\`\`\`

## Storage
Data is persisted in localStorage with the following keys:
- \`kb_users\`: User accounts
- \`kb_categories\`: Category structure
- \`kb_articles\`: Article content
- \`kb_current_user\`: Current session
- \`kb_audit_log\`: System audit trail`,
    categoryId: "2",
    authorId: "1",
    createdBy: "admin",
    tags: ["api", "documentation", "technical"],
    status: "published",
    createdAt: new Date("2024-01-03T00:00:00Z"),
    updatedAt: new Date("2024-01-03T00:00:00Z"),
  },
]
