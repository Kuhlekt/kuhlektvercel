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
    title: "Welcome to Kuhlekt Knowledge Base",
    content: `# Welcome to Kuhlekt Knowledge Base

This is your comprehensive knowledge management system. Here you can:

- Browse articles by category
- Search for specific information
- Add new articles (if you have permissions)
- Manage users and content (admin only)

## Getting Started

1. **Browse Categories**: Use the sidebar to navigate through different categories
2. **Search**: Use the search bar to find specific articles
3. **Login**: Click the login button to access additional features
4. **Add Content**: Editors and admins can add new articles

## Features

- **Role-based Access**: Different permissions for admins, editors, and viewers
- **Rich Text Editing**: Full-featured editor for creating content
- **Category Management**: Organize content in a hierarchical structure
- **Search Functionality**: Find articles quickly with full-text search
- **Audit Logging**: Track all system activities

Enjoy using the knowledge base!`,
    categoryId: "1",
    authorId: "1",
    tags: ["welcome", "getting-started", "overview"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "How to Create Your First Article",
    content: `# Creating Your First Article

Follow these steps to create your first article:

## Step 1: Login
Make sure you're logged in with an editor or admin account.

## Step 2: Click "Add Article"
Look for the "Add Article" button in the navigation bar.

## Step 3: Fill in the Details
- **Title**: Give your article a descriptive title
- **Category**: Select the appropriate category
- **Content**: Write your article content using the rich text editor
- **Tags**: Add relevant tags to help with searchability
- **Status**: Choose between "Draft" or "Published"

## Step 4: Save
Click "Save Article" to add it to the knowledge base.

## Tips
- Use clear, descriptive titles
- Add relevant tags for better discoverability
- Use the rich text editor features for formatting
- Save as draft first to review before publishing`,
    categoryId: "2",
    authorId: "1",
    tags: ["tutorial", "article-creation", "guide"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "API Documentation Overview",
    content: `# API Documentation

This section contains technical documentation for developers.

## Authentication
All API requests require authentication using JWT tokens.

## Endpoints

### Articles
- \`GET /api/articles\` - List all articles
- \`POST /api/articles\` - Create new article
- \`PUT /api/articles/:id\` - Update article
- \`DELETE /api/articles/:id\` - Delete article

### Categories
- \`GET /api/categories\` - List all categories
- \`POST /api/categories\` - Create new category

### Users
- \`GET /api/users\` - List users (admin only)
- \`POST /api/users\` - Create user (admin only)

## Rate Limiting
API requests are limited to 100 requests per minute per user.

## Error Handling
All errors return JSON with error code and message.`,
    categoryId: "3",
    authorId: "1",
    tags: ["api", "documentation", "technical"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Frequently Asked Questions",
    content: `# Frequently Asked Questions

## General Questions

### Q: How do I reset my password?
A: Contact your administrator to reset your password.

### Q: Can I edit articles created by other users?
A: Only admins can edit articles created by other users. Editors can only edit their own articles.

### Q: How do I search for articles?
A: Use the search bar in the navigation. It searches through titles, content, and tags.

## Technical Questions

### Q: What file formats are supported for uploads?
A: Currently, we support images (PNG, JPG, GIF) and documents (PDF, DOC, DOCX).

### Q: Is there a mobile app?
A: The knowledge base is web-based and responsive, working well on mobile browsers.

### Q: How is data backed up?
A: Data is automatically backed up daily. Contact your administrator for restore requests.

## Account Questions

### Q: How do I change my role?
A: Only administrators can change user roles. Submit a request to your admin.

### Q: Can I delete my account?
A: Contact your administrator to delete your account and associated data.`,
    categoryId: "4",
    authorId: "1",
    tags: ["faq", "help", "support"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
]
