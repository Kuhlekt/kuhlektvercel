import type { Category, Article } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Basic information and setup guides",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Technical Documentation",
    description: "Technical guides and API documentation",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Troubleshooting",
    description: "Common issues and solutions",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Best Practices",
    description: "Recommended approaches and methodologies",
    createdAt: new Date().toISOString(),
  },
]

export const initialArticles: Article[] = [
  {
    id: "1",
    title: "Welcome to Kuhlekt Knowledge Base",
    content: `Welcome to the Kuhlekt Knowledge Base! This is your central hub for all documentation, guides, and resources.

Getting Started:
1. Browse categories on the left sidebar
2. Use the search bar to find specific articles
3. Login to add and edit articles
4. Admins can manage users and categories

Features:
- Full-text search across all articles
- Category-based organization
- User role management (Admin, Editor, Viewer)
- Article versioning and audit logs
- Responsive design for all devices

For support, contact your system administrator.`,
    categoryId: "1",
    authorId: "1",
    tags: ["welcome", "getting-started", "overview"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "User Roles and Permissions",
    content: `Understanding user roles in the Knowledge Base:

ADMIN:
- Full access to all features
- Can manage users and categories
- Can edit any article
- Access to admin dashboard and audit logs

EDITOR:
- Can create and edit articles
- Can manage their own content
- Cannot access admin features

VIEWER:
- Can only read published articles
- Cannot create or edit content
- Basic search and browsing capabilities

Role Assignment:
Only administrators can assign roles to users. Contact your admin to change user permissions.`,
    categoryId: "1",
    authorId: "1",
    tags: ["users", "permissions", "roles"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "API Documentation Overview",
    content: `The Kuhlekt Knowledge Base provides a RESTful API for integration with external systems.

Base URL: https://api.kuhlekt.com/kb/v1

Authentication:
All API requests require authentication using API keys. Include your API key in the Authorization header:
Authorization: Bearer YOUR_API_KEY

Available Endpoints:
- GET /articles - List all articles
- GET /articles/{id} - Get specific article
- POST /articles - Create new article
- PUT /articles/{id} - Update article
- DELETE /articles/{id} - Delete article
- GET /categories - List categories
- GET /search?q={query} - Search articles

Rate Limiting:
API requests are limited to 1000 requests per hour per API key.

For detailed endpoint documentation, see the individual API guides in this category.`,
    categoryId: "2",
    authorId: "1",
    tags: ["api", "documentation", "integration"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Common Login Issues",
    content: `Troubleshooting login problems:

ISSUE: "Invalid username or password"
SOLUTION:
1. Verify your credentials are correct
2. Check if Caps Lock is enabled
3. Try resetting your password
4. Contact admin if account is locked

ISSUE: "Account locked"
SOLUTION:
1. Wait 15 minutes for automatic unlock
2. Contact administrator for immediate unlock
3. Review security policies

ISSUE: "Session expired"
SOLUTION:
1. Simply log in again
2. Sessions expire after 24 hours of inactivity
3. Enable "Remember me" for longer sessions

ISSUE: Browser compatibility
SOLUTION:
1. Use supported browsers: Chrome, Firefox, Safari, Edge
2. Clear browser cache and cookies
3. Disable browser extensions that might interfere
4. Try incognito/private browsing mode

If problems persist, contact technical support with your username and error details.`,
    categoryId: "3",
    authorId: "1",
    tags: ["login", "troubleshooting", "authentication"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Writing Effective Documentation",
    content: `Best practices for creating clear, useful documentation:

STRUCTURE:
1. Start with a clear title
2. Provide a brief overview
3. Use headings to organize content
4. Include step-by-step instructions
5. Add examples and code snippets
6. End with troubleshooting or FAQ

WRITING STYLE:
- Use clear, concise language
- Write in active voice
- Define technical terms
- Use bullet points and numbered lists
- Keep paragraphs short

FORMATTING:
- Use consistent heading styles
- Highlight important information
- Include relevant tags
- Add screenshots when helpful
- Use code blocks for technical content

MAINTENANCE:
- Review and update regularly
- Remove outdated information
- Gather feedback from users
- Track article usage and effectiveness

COLLABORATION:
- Use draft status for work in progress
- Get peer reviews before publishing
- Maintain version history
- Document changes in audit logs

Remember: Good documentation saves time for everyone and reduces support requests.`,
    categoryId: "4",
    authorId: "1",
    tags: ["documentation", "writing", "best-practices"],
    status: "published",
    createdAt: new Date().toISOString(),
  },
]
