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
    name: "Technical Documentation",
    description: "Technical specifications and API documentation",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    name: "FAQ",
    description: "Frequently asked questions",
    createdAt: new Date("2024-01-01"),
  },
]

export const initialArticles: Article[] = [
  {
    id: "1",
    title: "Welcome to Kuhlekt Knowledge Base",
    content:
      "This is your comprehensive knowledge base system. Here you can find all the information you need to get started and make the most of our platform.\n\nKey features include:\n- Article management\n- Category organization\n- User role management\n- Search functionality\n- Admin dashboard",
    categoryId: "1",
    authorId: "1",
    tags: ["welcome", "introduction", "overview"],
    status: "published",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    createdBy: "admin",
  },
  {
    id: "2",
    title: "How to Create Your First Article",
    content:
      "Creating articles is simple and straightforward:\n\n1. Click the 'Add Article' button in the navigation\n2. Fill in the article title\n3. Select a category\n4. Write your content\n5. Add relevant tags\n6. Choose to save as draft or publish immediately\n\nTips for writing great articles:\n- Use clear, descriptive titles\n- Organize content with headings\n- Add relevant tags for better searchability\n- Keep content concise and actionable",
    categoryId: "1",
    authorId: "1",
    tags: ["tutorial", "articles", "getting-started"],
    status: "published",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    createdBy: "admin",
  },
  {
    id: "3",
    title: "User Roles and Permissions",
    content:
      "The knowledge base supports three user roles:\n\n**Admin**\n- Full access to all features\n- Can manage users and categories\n- Can create, edit, and delete articles\n- Access to admin dashboard\n\n**Editor**\n- Can create and edit articles\n- Can publish articles\n- Cannot manage users or categories\n\n**Viewer**\n- Can only view published articles\n- Cannot create or edit content\n- Read-only access",
    categoryId: "2",
    authorId: "1",
    tags: ["users", "permissions", "roles"],
    status: "published",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    createdBy: "admin",
  },
  {
    id: "4",
    title: "Search and Navigation",
    content:
      "Finding information quickly is essential:\n\n**Search Features:**\n- Search by article title\n- Search within article content\n- Search by tags\n- Real-time search results\n\n**Navigation:**\n- Browse by categories\n- Expandable category tree\n- Article count per category\n- Quick access to recent articles",
    categoryId: "2",
    authorId: "2",
    tags: ["search", "navigation", "features"],
    status: "published",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    createdBy: "editor",
  },
  {
    id: "5",
    title: "API Documentation",
    content:
      "Technical specifications for developers:\n\n**Authentication**\n- Token-based authentication\n- Role-based access control\n- Session management\n\n**Endpoints**\n- GET /api/articles - Retrieve articles\n- POST /api/articles - Create new article\n- PUT /api/articles/:id - Update article\n- DELETE /api/articles/:id - Delete article\n\n**Data Formats**\n- JSON request/response format\n- Standard HTTP status codes\n- Error handling and validation",
    categoryId: "3",
    authorId: "1",
    tags: ["api", "technical", "developers"],
    status: "published",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    createdBy: "admin",
  },
  {
    id: "6",
    title: "How do I reset my password?",
    content:
      "To reset your password:\n\n1. Contact your system administrator\n2. Provide your username and email\n3. Administrator will reset your password\n4. You'll receive new login credentials\n5. Change your password after first login\n\nNote: Self-service password reset is not currently available but is planned for future releases.",
    categoryId: "4",
    authorId: "1",
    tags: ["password", "reset", "account"],
    status: "published",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    createdBy: "admin",
  },
]
