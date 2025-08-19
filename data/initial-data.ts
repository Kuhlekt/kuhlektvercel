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

This knowledge base contains comprehensive documentation and guides for using our platform effectively.

## What you'll find here:
- Getting started guides
- Technical documentation
- Best practices
- Troubleshooting guides
- API references

## How to navigate:
1. Browse categories on the left sidebar
2. Use the search function to find specific topics
3. Click on articles to view detailed content
4. Use tags to find related articles

## Need help?
If you can't find what you're looking for, please contact our support team.`,
        summary: "Introduction to the knowledge base and how to use it effectively",
        tags: ["welcome", "introduction", "getting-started"],
        categoryId: "1",
        author: "Kuhlekt Team",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        isPublished: true,
        viewCount: 0,
      },
      {
        id: "2",
        title: "Account Setup",
        content: `# Account Setup Guide

Setting up your account is the first step to accessing all features of our platform.

## Steps to set up your account:

1. **Registration**
   - Visit the registration page
   - Fill in your details
   - Verify your email address

2. **Profile Configuration**
   - Add your profile picture
   - Set your preferences
   - Configure notification settings

3. **Security Settings**
   - Enable two-factor authentication
   - Set a strong password
   - Review privacy settings

## Important Notes:
- Keep your login credentials secure
- Regularly update your password
- Contact support if you encounter issues`,
        summary: "Complete guide for setting up your account",
        tags: ["account", "setup", "registration"],
        categoryId: "1",
        author: "Support Team",
        createdAt: new Date("2024-01-02T00:00:00.000Z"),
        updatedAt: new Date("2024-01-02T00:00:00.000Z"),
        isPublished: true,
        viewCount: 0,
      },
    ],
    subcategories: [
      {
        id: "1-1",
        name: "Quick Start",
        description: "Get up and running quickly",
        parentId: "1",
        articles: [
          {
            id: "3",
            title: "5-Minute Quick Start",
            content: `# 5-Minute Quick Start

Get up and running with our platform in just 5 minutes!

## Step 1: Create Account (1 minute)
- Click "Sign Up"
- Enter your email and password
- Verify your email

## Step 2: Complete Profile (2 minutes)
- Add your name and company
- Upload a profile picture
- Set your timezone

## Step 3: Explore Dashboard (2 minutes)
- Take the guided tour
- Check out the main features
- Customize your dashboard

You're all set! Start exploring the platform.`,
            summary: "Get started with our platform in just 5 minutes",
            tags: ["quick-start", "tutorial", "beginner"],
            categoryId: "1",
            subcategoryId: "1-1",
            author: "Product Team",
            createdAt: new Date("2024-01-03T00:00:00.000Z"),
            updatedAt: new Date("2024-01-03T00:00:00.000Z"),
            isPublished: true,
            viewCount: 0,
          },
        ],
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
      },
    ],
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    id: "2",
    name: "Technical Documentation",
    description: "Detailed technical guides and API documentation",
    articles: [
      {
        id: "4",
        title: "API Overview",
        content: `# API Overview

Our REST API provides programmatic access to all platform features.

## Base URL
\`\`\`
https://api.kuhlekt.com/v1
\`\`\`

## Authentication
All API requests require authentication using API keys:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.kuhlekt.com/v1/endpoint
\`\`\`

## Rate Limits
- 1000 requests per hour for free accounts
- 10000 requests per hour for premium accounts

## Response Format
All responses are in JSON format:

\`\`\`json
{
  "success": true,
  "data": {},
  "message": "Success"
}
\`\`\`

## Error Handling
Errors return appropriate HTTP status codes with detailed messages.`,
        summary: "Complete overview of our REST API",
        tags: ["api", "documentation", "rest", "authentication"],
        categoryId: "2",
        author: "Engineering Team",
        createdAt: new Date("2024-01-04T00:00:00.000Z"),
        updatedAt: new Date("2024-01-04T00:00:00.000Z"),
        isPublished: true,
        viewCount: 0,
      },
    ],
    subcategories: [
      {
        id: "2-1",
        name: "API Endpoints",
        description: "Detailed API endpoint documentation",
        parentId: "2",
        articles: [
          {
            id: "5",
            title: "User Management API",
            content: `# User Management API

Manage users programmatically through our API.

## List Users
\`\`\`http
GET /api/users
\`\`\`

### Response
\`\`\`json
{
  "users": [
    {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

## Create User
\`\`\`http
POST /api/users
Content-Type: application/json

{
  "email": "new@example.com",
  "name": "New User",
  "password": "secure_password"
}
\`\`\`

## Update User
\`\`\`http
PUT /api/users/:id
Content-Type: application/json

{
  "name": "Updated Name"
}
\`\`\`

## Delete User
\`\`\`http
DELETE /api/users/:id
\`\`\``,
            summary: "API endpoints for user management operations",
            tags: ["api", "users", "endpoints", "crud"],
            categoryId: "2",
            subcategoryId: "2-1",
            author: "API Team",
            createdAt: new Date("2024-01-05T00:00:00.000Z"),
            updatedAt: new Date("2024-01-05T00:00:00.000Z"),
            isPublished: true,
            viewCount: 0,
          },
        ],
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
      },
    ],
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    id: "3",
    name: "Troubleshooting",
    description: "Common issues and their solutions",
    articles: [
      {
        id: "6",
        title: "Common Login Issues",
        content: `# Common Login Issues

Having trouble logging in? Here are the most common issues and solutions.

## Issue 1: Forgot Password
**Solution:**
1. Click "Forgot Password" on the login page
2. Enter your email address
3. Check your email for reset instructions
4. Follow the link to create a new password

## Issue 2: Account Locked
**Solution:**
- Wait 15 minutes and try again
- Contact support if the issue persists

## Issue 3: Two-Factor Authentication Problems
**Solutions:**
- Ensure your device's time is correct
- Try generating a new code
- Use backup codes if available
- Contact support to disable 2FA temporarily

## Issue 4: Browser Issues
**Solutions:**
- Clear browser cache and cookies
- Try an incognito/private window
- Update your browser
- Try a different browser

## Still Having Issues?
Contact our support team with:
- Your email address
- Error messages you're seeing
- Steps you've already tried`,
        summary: "Solutions for common login and authentication issues",
        tags: ["troubleshooting", "login", "authentication", "support"],
        categoryId: "3",
        author: "Support Team",
        createdAt: new Date("2024-01-06T00:00:00.000Z"),
        updatedAt: new Date("2024-01-06T00:00:00.000Z"),
        isPublished: true,
        viewCount: 0,
      },
    ],
    subcategories: [],
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
]
