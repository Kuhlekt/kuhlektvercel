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
    content: `Welcome to the Kuhlekt Knowledge Base! This comprehensive platform is designed to help you find answers, learn new concepts, and stay up-to-date with the latest information.

## Getting Started

This knowledge base contains articles organized by categories to help you quickly find the information you need. Use the search functionality to find specific topics or browse through categories.

## Features

- **Search**: Use the search bar to find articles by title, content, or tags
- **Categories**: Browse articles organized by topic
- **User Roles**: Different access levels for viewing and editing content
- **Rich Content**: Articles support formatted text and multimedia

## Need Help?

If you can't find what you're looking for, please contact our support team or check the troubleshooting section.`,
    categoryId: "1",
    authorId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "published",
    tags: ["welcome", "getting-started", "introduction"],
    createdBy: "admin",
  },
  {
    id: "2",
    title: "How to Search Effectively",
    content: `Learn how to make the most of the search functionality in our knowledge base.

## Search Tips

1. **Use specific keywords**: Be specific about what you're looking for
2. **Try different terms**: If one search doesn't work, try synonyms
3. **Use quotes**: Put phrases in quotes for exact matches
4. **Filter by category**: Narrow down results by selecting specific categories

## Advanced Search

- Use the category filter to limit results to specific topics
- Search results highlight matching terms
- Articles are ranked by relevance

## Still Can't Find It?

If you're still having trouble finding what you need, try browsing through the categories or contact support.`,
    categoryId: "1",
    authorId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "published",
    tags: ["search", "tips", "help"],
    createdBy: "admin",
  },
  {
    id: "3",
    title: "API Authentication Guide",
    content: `This guide covers how to authenticate with our API endpoints.

## Authentication Methods

### API Keys
Generate an API key from your dashboard and include it in the header:
\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

### OAuth 2.0
For more secure applications, use OAuth 2.0 flow:

1. Register your application
2. Redirect users to authorization endpoint
3. Exchange authorization code for access token
4. Use access token in API requests

## Rate Limiting

API requests are limited to:
- 1000 requests per hour for authenticated users
- 100 requests per hour for unauthenticated requests

## Error Handling

Common error responses:
- 401: Unauthorized - Invalid or missing authentication
- 403: Forbidden - Insufficient permissions
- 429: Too Many Requests - Rate limit exceeded`,
    categoryId: "2",
    authorId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "published",
    tags: ["api", "authentication", "security"],
    createdBy: "admin",
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
