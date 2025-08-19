import type { Category, Article } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Essential information for new users",
    articles: [],
    subcategories: [
      {
        id: "1-1",
        name: "Setup",
        description: "Initial setup and configuration",
        articles: [],
      },
      {
        id: "1-2",
        name: "Basic Usage",
        description: "How to use basic features",
        articles: [],
      },
    ],
  },
  {
    id: "2",
    name: "Technical Documentation",
    description: "Technical guides and API documentation",
    articles: [],
    subcategories: [
      {
        id: "2-1",
        name: "API Reference",
        description: "Complete API documentation",
        articles: [],
      },
      {
        id: "2-2",
        name: "Integration Guides",
        description: "How to integrate with other systems",
        articles: [],
      },
    ],
  },
  {
    id: "3",
    name: "Troubleshooting",
    description: "Common issues and solutions",
    articles: [],
    subcategories: [
      {
        id: "3-1",
        name: "Common Issues",
        description: "Frequently encountered problems",
        articles: [],
      },
      {
        id: "3-2",
        name: "Error Messages",
        description: "Understanding error messages",
        articles: [],
      },
    ],
  },
]

export const initialArticles: Article[] = [
  {
    id: "1",
    title: "Welcome to Kuhlekt Knowledge Base",
    content: `<h1>Welcome to Kuhlekt Knowledge Base</h1>
    <p>This is your comprehensive knowledge management system. Here you can:</p>
    <ul>
      <li>Browse articles by category</li>
      <li>Search for specific information</li>
      <li>Create and edit articles (with proper permissions)</li>
      <li>Manage users and categories (admin only)</li>
    </ul>
    <h2>Getting Started</h2>
    <p>To get started, browse the categories on the left sidebar or use the search functionality in the top navigation.</p>`,
    categoryId: "1",
    subcategoryId: "1-2",
    authorId: "1",
    tags: ["welcome", "introduction", "getting-started"],
    status: "published",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    createdBy: "admin",
  },
  {
    id: "2",
    title: "How to Create Articles",
    content: `<h1>Creating Articles</h1>
    <p>To create a new article, you need to have editor or admin permissions.</p>
    <h2>Steps to Create an Article</h2>
    <ol>
      <li>Click the "Add Article" button in the navigation</li>
      <li>Fill in the article title</li>
      <li>Select a category and optionally a subcategory</li>
      <li>Write your content using the rich text editor</li>
      <li>Add relevant tags</li>
      <li>Choose to save as draft or publish immediately</li>
    </ol>
    <p>Articles support rich text formatting, including images, links, and code blocks.</p>`,
    categoryId: "1",
    subcategoryId: "1-2",
    authorId: "2",
    tags: ["articles", "creation", "editor", "how-to"],
    status: "published",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
    createdBy: "editor",
  },
  {
    id: "3",
    title: "API Authentication",
    content: `<h1>API Authentication</h1>
    <p>Our API uses token-based authentication for secure access.</p>
    <h2>Getting an API Token</h2>
    <p>To get an API token:</p>
    <ol>
      <li>Log in to your account</li>
      <li>Go to Settings > API Tokens</li>
      <li>Click "Generate New Token"</li>
      <li>Copy and store the token securely</li>
    </ol>
    <h2>Using the Token</h2>
    <p>Include the token in your requests:</p>
    <pre><code>Authorization: Bearer YOUR_TOKEN_HERE</code></pre>`,
    categoryId: "2",
    subcategoryId: "2-1",
    authorId: "1",
    tags: ["api", "authentication", "security", "tokens"],
    status: "published",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
    createdBy: "admin",
  },
]
