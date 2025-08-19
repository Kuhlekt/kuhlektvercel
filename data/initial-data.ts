import type { Category, Article } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Essential information for new users",
    createdAt: new Date().toISOString(),
    subcategories: [],
    articles: [],
  },
  {
    id: "2",
    name: "Technical Documentation",
    description: "Technical guides and API documentation",
    createdAt: new Date().toISOString(),
    subcategories: [],
    articles: [],
  },
  {
    id: "3",
    name: "Troubleshooting",
    description: "Common issues and solutions",
    createdAt: new Date().toISOString(),
    subcategories: [],
    articles: [],
  },
  {
    id: "4",
    name: "Best Practices",
    description: "Recommended approaches and methodologies",
    createdAt: new Date().toISOString(),
    subcategories: [],
    articles: [],
  },
]

export const initialArticles: Article[] = [
  {
    id: "1",
    title: "Welcome to Kuhlekt Knowledge Base",
    content:
      "This is your comprehensive knowledge base system. Here you can find all the information you need to get started with our platform.",
    categoryId: "1",
    authorId: "1",
    tags: ["welcome", "introduction", "getting-started"],
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "admin",
  },
  {
    id: "2",
    title: "How to Create Your First Article",
    content:
      "Creating articles is easy! Simply click the 'Add Article' button in the navigation bar and fill out the form with your content.",
    categoryId: "1",
    authorId: "1",
    tags: ["tutorial", "articles", "creation"],
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "admin",
  },
  {
    id: "3",
    title: "API Documentation Overview",
    content:
      "Our API provides comprehensive access to all platform features. This guide covers authentication, endpoints, and best practices.",
    categoryId: "2",
    authorId: "2",
    tags: ["api", "documentation", "technical"],
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "editor",
  },
  {
    id: "4",
    title: "Common Login Issues",
    content: `Troubleshoot common problems when logging into the system.

## Forgot Password

1. Click "Forgot Password" on the login page
2. Enter your email address
3. Check your email for reset instructions
4. Follow the link to create a new password

## Account Locked

If your account is locked after multiple failed attempts:
- Wait 15 minutes before trying again
- Contact support if the issue persists

## Browser Issues

Clear your browser cache and cookies:
1. Open browser settings
2. Find "Clear browsing data"
3. Select cookies and cached files
4. Clear data and try logging in again

## Still Having Problems?

Contact our support team with:
- Your username (not password)
- Browser and version
- Error messages you're seeing`,
    categoryId: "3",
    authorId: "2",
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "published",
    tags: ["login", "troubleshooting", "password"],
    createdBy: "editor",
  },
  {
    id: "5",
    title: "Writing Effective Documentation",
    content: `Best practices for creating clear and helpful documentation.

## Structure Your Content

### Use Clear Headings
Organize content with descriptive headings that help readers scan and find information quickly.

### Start with Overview
Begin each article with a brief overview of what the reader will learn.

### Use Examples
Include practical examples and code snippets where applicable.

## Writing Style

- **Be concise**: Get to the point quickly
- **Use active voice**: "Click the button" instead of "The button should be clicked"
- **Define terms**: Explain technical terms when first used
- **Use bullet points**: Break up long paragraphs with lists

## Visual Elements

- Add screenshots for UI instructions
- Use code blocks for technical examples
- Include diagrams for complex processes

## Review and Update

- Review content regularly for accuracy
- Update screenshots when UI changes
- Remove outdated information
- Ask for feedback from users`,
    categoryId: "4",
    authorId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "published",
    tags: ["documentation", "writing", "best-practices"],
    createdBy: "admin",
  },
]

// Add articles to their respective categories
initialCategories[0].articles = [initialArticles[0], initialArticles[1]]
initialCategories[1].articles = [initialArticles[2]]
initialCategories[2].articles = [initialArticles[3]]
initialCategories[3].articles = [initialArticles[4]]
