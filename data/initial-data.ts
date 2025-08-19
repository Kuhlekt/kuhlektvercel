import type { Category, Article } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Basic information to get you started",
    createdAt: new Date("2024-01-01"),
    createdBy: "admin",
  },
  {
    id: "2",
    name: "User Guides",
    description: "Step-by-step guides for users",
    createdAt: new Date("2024-01-01"),
    createdBy: "admin",
  },
  {
    id: "3",
    name: "Technical Documentation",
    description: "Technical specifications and API documentation",
    createdAt: new Date("2024-01-01"),
    createdBy: "admin",
  },
  {
    id: "4",
    name: "FAQ",
    description: "Frequently asked questions",
    createdAt: new Date("2024-01-01"),
    createdBy: "admin",
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
- Create and edit articles (with proper permissions)
- Manage users and categories (admin only)

## Getting Started

1. **Browse Categories**: Use the left sidebar to navigate through different categories
2. **Search**: Use the search bar in the top navigation to find specific articles
3. **Login**: Click the login button to access editing features
4. **Create Articles**: Once logged in, use the "Add Article" button to create new content

## User Roles

- **Admin**: Full access to all features including user management
- **Editor**: Can create and edit articles
- **Viewer**: Read-only access to published articles

Enjoy using the knowledge base!`,
    categoryId: "1",
    authorId: "1",
    createdBy: "admin",
    tags: ["welcome", "getting-started", "introduction"],
    status: "published",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    title: "How to Create an Article",
    content: `# How to Create an Article

Creating articles in the knowledge base is simple and straightforward.

## Prerequisites

- You must be logged in as an Editor or Admin
- You need to have at least one category created

## Steps

1. **Login**: Click the "Login" button in the top navigation
2. **Add Article**: Click the "Add Article" button (appears after login)
3. **Fill in Details**:
   - Enter a descriptive title
   - Select the appropriate category
   - Write your content using Markdown
   - Add relevant tags (comma-separated)
   - Choose status (draft or published)
4. **Save**: Click "Create Article" to save

## Tips

- Use clear, descriptive titles
- Add relevant tags to make articles easier to find
- Use Markdown formatting for better readability
- Save as draft first, then publish when ready

## Markdown Support

The editor supports full Markdown syntax including:
- Headers (# ## ###)
- **Bold** and *italic* text
- Lists and numbered lists
- Links and images
- Code blocks`,
    categoryId: "2",
    authorId: "2",
    createdBy: "editor",
    tags: ["tutorial", "articles", "creation", "markdown"],
    status: "published",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    title: "API Documentation",
    content: `# API Documentation

This document outlines the internal API structure used by the knowledge base.

## Data Models

### User
\`\`\`typescript
interface User {
  id: string
  username: string
  email: string
  password: string
  role: "admin" | "editor" | "viewer"
  createdAt: Date
  lastLogin?: Date
}
\`\`\`

### Article
\`\`\`typescript
interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  authorId: string
  createdBy: string
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
  description?: string
  parentId?: string
  createdAt: Date
  createdBy: string
}
\`\`\`

## Storage

The application uses localStorage for data persistence:
- \`kb_users\`: User accounts
- \`kb_categories\`: Article categories
- \`kb_articles\`: Article content
- \`kb_current_user\`: Current session
- \`kb_audit_log\`: Activity log

## Authentication

Authentication is handled through the storage utility:
- Passwords are stored in plain text (demo purposes only)
- Sessions persist in localStorage
- Audit trail tracks all user actions`,
    categoryId: "3",
    authorId: "1",
    createdBy: "admin",
    tags: ["api", "documentation", "technical", "development"],
    status: "published",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
  {
    id: "4",
    title: "Frequently Asked Questions",
    content: `# Frequently Asked Questions

## General Questions

### Q: How do I reset my password?
A: Contact your administrator to reset your password. This demo version doesn't include password reset functionality.

### Q: Can I delete articles?
A: Currently, article deletion is not implemented. You can edit articles to mark them as drafts or update their content.

### Q: How do I search for articles?
A: Use the search bar in the top navigation. It searches through article titles, content, and tags.

## Technical Questions

### Q: Where is my data stored?
A: All data is stored locally in your browser's localStorage. This means data is specific to your browser and device.

### Q: Can I export my data?
A: Yes! Admins can use the Data Management section in the Admin Dashboard to export all data as JSON.

### Q: Is this suitable for production use?
A: This is a demo application. For production use, you would need:
- Proper backend database
- Secure authentication
- User management features
- Data backup and recovery

## Troubleshooting

### Q: Login isn't working
A: Try these steps:
1. Make sure you're using the correct credentials
2. Check the browser console for errors
3. Clear localStorage and refresh the page
4. Try the demo credentials: admin/admin123

### Q: Articles aren't saving
A: This usually indicates a localStorage issue:
1. Check if localStorage is enabled in your browser
2. Clear localStorage and try again
3. Check browser console for errors`,
    categoryId: "4",
    authorId: "1",
    createdBy: "admin",
    tags: ["faq", "help", "troubleshooting", "support"],
    status: "published",
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-04"),
  },
]
