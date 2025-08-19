import type { Category } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Essential information for new users",
    articles: [
      {
        id: "1",
        title: "Welcome to Kuhlekt Knowledge Base",
        content: `# Welcome to Kuhlekt Knowledge Base

This is your comprehensive resource for all things Kuhlekt. Here you'll find:

- **Getting Started Guides** - Step-by-step instructions for new users
- **Technical Documentation** - Detailed technical information
- **Best Practices** - Recommended approaches and methodologies
- **Troubleshooting** - Solutions to common issues

## How to Use This Knowledge Base

1. **Browse Categories** - Use the category tree on the left to navigate
2. **Search** - Use the search bar to find specific information
3. **Add Content** - Logged-in users can contribute new articles
4. **Stay Updated** - Check back regularly for new content

Get started by exploring the categories or using the search function above!`,
        categoryId: "1",
        tags: ["welcome", "introduction", "getting-started"],
        createdAt: new Date("2024-01-01T10:00:00.000Z"),
        updatedAt: new Date("2024-01-01T10:00:00.000Z"),
        author: "System",
        status: "published",
      },
    ],
    subcategories: [
      {
        id: "1-1",
        name: "Quick Start",
        description: "Get up and running quickly",
        articles: [
          {
            id: "2",
            title: "5-Minute Quick Start Guide",
            content: `# 5-Minute Quick Start Guide

Get up and running with Kuhlekt in just 5 minutes!

## Step 1: Account Setup
- Create your account
- Verify your email
- Complete your profile

## Step 2: Basic Configuration
- Set your preferences
- Configure notifications
- Choose your workspace

## Step 3: First Project
- Create your first project
- Add team members
- Set up basic workflows

## Step 4: Essential Features
- Learn the dashboard
- Understand navigation
- Try key features

## Step 5: Get Help
- Join our community
- Access support resources
- Schedule training if needed

You're now ready to start using Kuhlekt effectively!`,
            categoryId: "1",
            subcategoryId: "1-1",
            tags: ["quick-start", "setup", "beginner"],
            createdAt: new Date("2024-01-01T11:00:00.000Z"),
            updatedAt: new Date("2024-01-01T11:00:00.000Z"),
            author: "Support Team",
            status: "published",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Technical Documentation",
    description: "Detailed technical information and specifications",
    articles: [],
    subcategories: [
      {
        id: "2-1",
        name: "API Reference",
        description: "Complete API documentation",
        articles: [
          {
            id: "3",
            title: "Authentication API",
            content: `# Authentication API

## Overview
The Authentication API handles user authentication and authorization.

## Endpoints

### POST /api/auth/login
Authenticate a user and return a session token.

**Request Body:**
\`\`\`json
{
  "username": "string",
  "password": "string"
}
\`\`\`

**Response:**
\`\`\`json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "role": "string"
  }
}
\`\`\`

### POST /api/auth/logout
Invalidate the current session token.

**Headers:**
\`Authorization: Bearer <token>\`

**Response:**
\`\`\`json
{
  "message": "Logged out successfully"
}
\`\`\`

## Error Codes
- 401: Invalid credentials
- 403: Access denied
- 500: Server error`,
            categoryId: "2",
            subcategoryId: "2-1",
            tags: ["api", "authentication", "reference"],
            createdAt: new Date("2024-01-01T12:00:00.000Z"),
            updatedAt: new Date("2024-01-01T12:00:00.000Z"),
            author: "Dev Team",
            status: "published",
          },
        ],
      },
    ],
  },
]
