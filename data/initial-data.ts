import type { Category, Article } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Essential information for new users",
    createdAt: new Date("2024-01-01"),
    subcategories: [],
    articles: [],
  },
  {
    id: "2",
    name: "Technical Documentation",
    description: "Detailed technical guides and references",
    createdAt: new Date("2024-01-01"),
    subcategories: [],
    articles: [],
  },
  {
    id: "3",
    name: "FAQ",
    description: "Frequently asked questions and answers",
    createdAt: new Date("2024-01-01"),
    subcategories: [],
    articles: [],
  },
]

export const initialArticles: Article[] = [
  {
    id: "1",
    title: "Welcome to Kuhlekt Knowledge Base",
    content:
      "This is your comprehensive knowledge base system. Here you can find all the information you need to get started and make the most of our platform.\n\nKey features:\n- User authentication and role-based access\n- Category-based organization\n- Full-text search capabilities\n- Article management tools\n- Admin dashboard for system management",
    categoryId: "1",
    authorId: "1",
    createdBy: "admin",
    tags: ["welcome", "introduction", "getting-started"],
    status: "published",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    title: "How to Create Your First Article",
    content:
      "Creating articles in the knowledge base is simple:\n\n1. Log in with your credentials\n2. Click the 'Add Article' button in the navigation\n3. Fill in the article details:\n   - Title: Make it descriptive and clear\n   - Content: Write your article content\n   - Category: Select the appropriate category\n   - Tags: Add relevant tags for better searchability\n   - Status: Choose draft or published\n4. Click 'Create Article' to save\n\nYour article will be immediately available to users based on your role permissions.",
    categoryId: "1",
    authorId: "1",
    createdBy: "admin",
    tags: ["tutorial", "articles", "creation"],
    status: "published",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    title: "API Documentation",
    content:
      "Our API provides programmatic access to the knowledge base functionality.\n\nBase URL: https://api.kuhlekt.com/v1\n\nAuthentication:\nAll API requests require authentication using Bearer tokens.\n\nEndpoints:\n- GET /articles - Retrieve all articles\n- POST /articles - Create a new article\n- GET /articles/{id} - Get specific article\n- PUT /articles/{id} - Update article\n- DELETE /articles/{id} - Delete article\n\nExample request:\ncurl -H 'Authorization: Bearer YOUR_TOKEN' https://api.kuhlekt.com/v1/articles",
    categoryId: "2",
    authorId: "2",
    createdBy: "editor",
    tags: ["api", "documentation", "technical"],
    status: "published",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "4",
    title: "Troubleshooting Common Issues",
    content:
      "Here are solutions to the most common issues users encounter:\n\n**Login Problems:**\n- Ensure you're using the correct username and password\n- Check if Caps Lock is enabled\n- Clear your browser cache and cookies\n\n**Search Not Working:**\n- Try different keywords\n- Check spelling\n- Use broader search terms\n\n**Can't Create Articles:**\n- Verify you have editor or admin permissions\n- Ensure all required fields are filled\n- Check if you're logged in\n\n**Performance Issues:**\n- Clear browser cache\n- Disable browser extensions temporarily\n- Try a different browser",
    categoryId: "3",
    authorId: "1",
    createdBy: "admin",
    tags: ["troubleshooting", "help", "support"],
    status: "published",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
]
