import type { Article, Category } from "../types/knowledge-base"

export const initialArticles: Article[] = [
  {
    id: "1",
    title: "Getting Started with Kuhlekt Knowledge Base",
    content: `# Welcome to Kuhlekt Knowledge Base

This is your comprehensive knowledge management system. Here's how to get started:

## Features
- **Article Management**: Create, edit, and organize articles
- **Category System**: Organize content with hierarchical categories
- **Search Functionality**: Find information quickly
- **User Management**: Role-based access control
- **Audit Logging**: Track all system activities

## User Roles
- **Admin**: Full system access
- **Editor**: Can create and edit articles
- **Viewer**: Read-only access

## Getting Started
1. Login with your credentials
2. Browse existing articles
3. Use the search function to find specific content
4. Admins can access the dashboard for management tasks

Start exploring and building your knowledge base!`,
    category: "getting-started",
    tags: ["welcome", "tutorial", "basics"],
    author: "System",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    isPublished: true,
    viewCount: 0,
  },
  {
    id: "2",
    title: "User Management Guide",
    content: `# User Management

Learn how to manage users in the knowledge base system.

## User Roles

### Admin
- Full system access
- Can manage users, articles, and categories
- Access to audit logs and system settings

### Editor
- Can create and edit articles
- Can manage categories
- Cannot manage users or access system settings

### Viewer
- Read-only access to published articles
- Can search and browse content
- Cannot create or edit content

## Managing Users
Admins can add, edit, and remove users through the admin dashboard.

## Best Practices
- Assign appropriate roles based on user needs
- Regularly review user access
- Keep user information up to date`,
    category: "administration",
    tags: ["users", "roles", "admin"],
    author: "Admin",
    createdAt: "2024-01-15T11:00:00Z",
    updatedAt: "2024-01-15T11:00:00Z",
    isPublished: true,
    viewCount: 0,
  },
  {
    id: "3",
    title: "Content Creation Best Practices",
    content: `# Content Creation Best Practices

Guidelines for creating effective knowledge base articles.

## Writing Guidelines

### Structure Your Content
- Use clear headings and subheadings
- Break up long paragraphs
- Use bullet points and numbered lists
- Include relevant examples

### Make It Searchable
- Use descriptive titles
- Add relevant tags
- Include keywords naturally in content
- Choose appropriate categories

### Keep It Updated
- Review content regularly
- Update outdated information
- Archive obsolete articles
- Track article performance

## Formatting Tips
- Use **bold** for emphasis
- Use *italics* for definitions
- Include code blocks for technical content
- Add links to related articles

## Categories and Tags
- Choose the most specific category
- Use consistent tagging
- Limit tags to 3-5 per article
- Create new categories when needed`,
    category: "content-creation",
    tags: ["writing", "best-practices", "guidelines"],
    author: "Editor",
    createdAt: "2024-01-15T12:00:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
    isPublished: true,
    viewCount: 0,
  },
]

export const initialCategories: Category[] = [
  {
    id: "getting-started",
    name: "Getting Started",
    description: "Introduction and basic information",
    color: "#3B82F6",
    articleCount: 1,
  },
  {
    id: "administration",
    name: "Administration",
    description: "System administration and management",
    color: "#EF4444",
    articleCount: 1,
  },
  {
    id: "content-creation",
    name: "Content Creation",
    description: "Guidelines for creating and managing content",
    color: "#10B981",
    articleCount: 1,
  },
  {
    id: "technical",
    name: "Technical",
    description: "Technical documentation and guides",
    color: "#8B5CF6",
    articleCount: 0,
  },
  {
    id: "policies",
    name: "Policies",
    description: "Company policies and procedures",
    color: "#F59E0B",
    articleCount: 0,
  },
]
