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
    name: "User Guide",
    description: "Comprehensive user documentation",
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
4. **Add Articles**: Once logged in, use the "Add Article" button to create new content

## User Roles

- **Viewer**: Can read all published articles
- **Editor**: Can create and edit articles
- **Admin**: Full access to all features including user management

Enjoy exploring the knowledge base!`,
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
- You need to have at least one category available

## Steps

1. **Login**: Click the "Login" button in the top navigation
2. **Add Article**: Click the "Add Article" button (appears after login)
3. **Fill Details**: 
   - Enter a descriptive title
   - Select the appropriate category
   - Write your content using Markdown
   - Add relevant tags
   - Choose publication status

4. **Save**: Click "Create Article" to save

## Tips

- Use clear, descriptive titles
- Add relevant tags for better searchability
- Use Markdown formatting for better readability
- Save as draft first, then publish when ready`,
    categoryId: "2",
    authorId: "2",
    createdBy: "editor",
    tags: ["tutorial", "article-creation", "how-to"],
    status: "published",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    title: "API Documentation",
    content: `# API Documentation

This section covers the technical aspects of the knowledge base system.

## Authentication

The system uses session-based authentication with localStorage persistence.

## Data Structure

### Articles
- ID: Unique identifier
- Title: Article title
- Content: Markdown content
- Category: Associated category
- Author: Creator information
- Tags: Searchable keywords
- Status: Draft or Published

### Categories
- Hierarchical structure
- Nested categories supported
- Admin-managed

## Storage

Data is stored in browser localStorage with the following keys:
- \`kb_users\`: User accounts
- \`kb_categories\`: Category structure
- \`kb_articles\`: Article content
- \`kb_current_user\`: Active session
- \`kb_audit_log\`: Activity tracking`,
    categoryId: "3",
    authorId: "1",
    createdBy: "admin",
    tags: ["api", "technical", "documentation", "development"],
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
A: Contact your administrator to reset your password.

### Q: Can I delete articles?
A: Only admins can delete articles. Editors can set articles to draft status.

### Q: How do I search for articles?
A: Use the search bar in the top navigation. It searches titles, content, and tags.

## Technical Questions

### Q: Where is my data stored?
A: Data is stored locally in your browser's localStorage.

### Q: Can I export my data?
A: Yes, admins can export all data from the admin dashboard.

### Q: Is there a mobile app?
A: The web interface is responsive and works well on mobile devices.

## Troubleshooting

### Q: I can't see the login button
A: Refresh the page. If the issue persists, clear your browser cache.

### Q: My articles aren't saving
A: Check that you have editor or admin permissions and try again.`,
    categoryId: "4",
    authorId: "1",
    createdBy: "admin",
    tags: ["faq", "help", "troubleshooting", "support"],
    status: "published",
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-04"),
  },
]
