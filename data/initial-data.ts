import type { Category, Article } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Basic information to get you started",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "User Guide",
    description: "Comprehensive user documentation",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "API Documentation",
    description: "Technical API reference",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    name: "Troubleshooting",
    description: "Common issues and solutions",
    createdAt: new Date("2024-01-01"),
  },
]

export const initialArticles: Article[] = [
  {
    id: "1",
    title: "Welcome to Kuhlekt Knowledge Base",
    content: `# Welcome to Kuhlekt Knowledge Base

This is your comprehensive knowledge management system. Here you can:

- Browse articles by category
- Search for specific content
- Create and edit articles (with proper permissions)
- Manage users and categories (admin only)

## Getting Started

1. **Browse Categories**: Use the sidebar to navigate through different categories
2. **Search**: Use the search bar to find specific articles
3. **Login**: Click the login button to access editing features

## User Roles

- **Viewer**: Can read all published articles
- **Editor**: Can create and edit articles
- **Admin**: Full access to all features including user management

Enjoy exploring the knowledge base!`,
    categoryId: "1",
    authorId: "1",
    createdBy: "admin",
    tags: ["welcome", "getting-started"],
    status: "published",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    title: "How to Create Articles",
    content: `# Creating Articles

To create a new article, you need editor or admin permissions.

## Steps:

1. Click the "Add Article" button in the navigation
2. Fill in the article details:
   - **Title**: A descriptive title for your article
   - **Category**: Select the appropriate category
   - **Content**: Write your article content using Markdown
   - **Tags**: Add relevant tags for better searchability
   - **Status**: Choose between Draft or Published

3. Click "Create Article" to save

## Markdown Support

You can use Markdown formatting in your articles:

- **Bold text** with \`**text**\`
- *Italic text* with \`*text*\`
- Lists with \`-\` or \`1.\`
- Headers with \`#\`, \`##\`, etc.
- Code blocks with triple backticks

## Best Practices

- Use clear, descriptive titles
- Add relevant tags
- Keep content well-structured
- Review before publishing`,
    categoryId: "2",
    authorId: "2",
    createdBy: "editor",
    tags: ["articles", "creation", "markdown"],
    status: "published",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    title: "API Authentication",
    content: `# API Authentication

Our API uses token-based authentication for secure access.

## Authentication Methods

### Bearer Token
Include your API token in the Authorization header:

\`\`\`
Authorization: Bearer your-api-token-here
\`\`\`

### API Key
Alternatively, you can use an API key parameter:

\`\`\`
GET /api/articles?api_key=your-api-key
\`\`\`

## Getting Your Token

1. Log into your account
2. Go to Settings > API Access
3. Generate a new token
4. Copy and store it securely

## Rate Limits

- 1000 requests per hour for authenticated users
- 100 requests per hour for unauthenticated users

## Error Responses

- \`401 Unauthorized\`: Invalid or missing token
- \`403 Forbidden\`: Insufficient permissions
- \`429 Too Many Requests\`: Rate limit exceeded`,
    categoryId: "3",
    authorId: "1",
    createdBy: "admin",
    tags: ["api", "authentication", "security"],
    status: "published",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
  {
    id: "4",
    title: "Common Login Issues",
    content: `# Common Login Issues

Having trouble logging in? Here are the most common issues and solutions.

## Forgot Password

If you've forgotten your password:

1. Click "Forgot Password" on the login page
2. Enter your email address
3. Check your email for reset instructions
4. Follow the link to create a new password

## Account Locked

After multiple failed login attempts, your account may be temporarily locked:

- Wait 15 minutes before trying again
- Contact support if the issue persists

## Browser Issues

Clear your browser cache and cookies:

1. Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. Select "Cookies and other site data"
3. Select "Cached images and files"
4. Click "Clear data"

## Still Having Issues?

Contact our support team:
- Email: support@kuhlekt.com
- Phone: 1-800-KUHLEKT
- Live chat available 9 AM - 5 PM EST`,
    categoryId: "4",
    authorId: "2",
    createdBy: "editor",
    tags: ["login", "troubleshooting", "support"],
    status: "published",
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-04"),
  },
]
