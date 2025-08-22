import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { KnowledgeBaseData } from "@/types/knowledge-base"

const DATA_FILE_PATH = path.join(process.cwd(), "data", "knowledge-base.json")

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE_PATH)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Default data structure
const getDefaultData = (): KnowledgeBaseData => ({
  categories: [
    {
      id: "getting-started",
      name: "Getting Started",
      description: "Essential guides to get you up and running",
      icon: "🚀",
      color: "blue",
      articles: [
        {
          id: "welcome",
          title: "Welcome to the Knowledge Base",
          content: `# Welcome to the Knowledge Base

This is your central hub for documentation, guides, and resources. Here you'll find everything you need to get started and make the most of our platform.

## What you'll find here:

- **Getting Started guides** - Step-by-step instructions for new users
- **Technical Documentation** - Detailed technical information and API references
- **Troubleshooting** - Solutions to common problems and issues
- **Best Practices** - Recommended approaches and methodologies

## How to navigate:

1. Use the category tree on the left to browse topics
2. Use the search bar to find specific information
3. Click on any article to read the full content
4. Use the breadcrumb navigation to keep track of where you are

## Need help?

If you can't find what you're looking for, please contact our support team or use the feedback feature to let us know what additional documentation would be helpful.

Happy learning!`,
          categoryId: "getting-started",
          tags: ["welcome", "introduction", "overview"],
          author: "System",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
          isPublished: true,
          views: 0,
        },
        {
          id: "quick-start",
          title: "Quick Start Guide",
          content: `# Quick Start Guide

Get up and running in just a few minutes with this quick start guide.

## Step 1: Account Setup

1. Create your account or log in
2. Complete your profile information
3. Verify your email address

## Step 2: Basic Configuration

1. Set your preferences
2. Configure your workspace
3. Invite team members (if applicable)

## Step 3: First Steps

1. Explore the dashboard
2. Create your first project
3. Familiarize yourself with the interface

## Step 4: Getting Help

- Check out our documentation
- Join our community forum
- Contact support if needed

That's it! You're ready to start using the platform effectively.`,
          categoryId: "getting-started",
          tags: ["quick-start", "setup", "configuration"],
          author: "System",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
          isPublished: true,
          views: 0,
        },
      ],
      subcategories: [],
      createdAt: new Date("2024-01-01"),
    },
    {
      id: "technical-docs",
      name: "Technical Documentation",
      description: "Detailed technical information and API references",
      icon: "📚",
      color: "green",
      articles: [
        {
          id: "api-overview",
          title: "API Overview",
          content: `# API Overview

Our API provides programmatic access to all platform features. This guide covers the basics of working with our REST API.

## Base URL

All API requests should be made to:
\`\`\`
https://api.example.com/v1
\`\`\`

## Authentication

API requests require authentication using API keys:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.example.com/v1/endpoint
\`\`\`

## Rate Limits

- 1000 requests per hour for authenticated requests
- 100 requests per hour for unauthenticated requests

## Response Format

All responses are returned in JSON format:

\`\`\`json
{
  "data": {},
  "status": "success",
  "message": "Request completed successfully"
}
\`\`\`

## Error Handling

Errors are returned with appropriate HTTP status codes and error messages:

\`\`\`json
{
  "error": {
    "code": 400,
    "message": "Bad Request",
    "details": "Invalid parameter: email"
  }
}
\`\`\`

## Next Steps

- Check out specific endpoint documentation
- Try our interactive API explorer
- Download our SDK for your preferred language`,
          categoryId: "technical-docs",
          tags: ["api", "documentation", "reference"],
          author: "System",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
          isPublished: true,
          views: 0,
        },
      ],
      subcategories: [
        {
          id: "api-endpoints",
          name: "API Endpoints",
          description: "Detailed documentation for each API endpoint",
          articles: [
            {
              id: "users-api",
              title: "Users API",
              content: `# Users API

Manage user accounts and profiles through the Users API.

## List Users

\`GET /users\`

Returns a paginated list of users.

### Parameters

- \`page\` (optional): Page number (default: 1)
- \`limit\` (optional): Items per page (default: 20, max: 100)
- \`search\` (optional): Search query for username or email

### Response

\`\`\`json
{
  "data": {
    "users": [
      {
        "id": "user_123",
        "username": "john_doe",
        "email": "john@example.com",
        "created_at": "2024-01-01T00:00:00Z",
        "last_login": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
\`\`\`

## Get User

\`GET /users/{id}\`

Returns details for a specific user.

### Response

\`\`\`json
{
  "data": {
    "id": "user_123",
    "username": "john_doe",
    "email": "john@example.com",
    "profile": {
      "first_name": "John",
      "last_name": "Doe",
      "avatar_url": "https://example.com/avatar.jpg"
    },
    "created_at": "2024-01-01T00:00:00Z",
    "last_login": "2024-01-15T10:30:00Z"
  }
}
\`\`\`

## Create User

\`POST /users\`

Creates a new user account.

### Request Body

\`\`\`json
{
  "username": "new_user",
  "email": "user@example.com",
  "password": "secure_password",
  "profile": {
    "first_name": "New",
    "last_name": "User"
  }
}
\`\`\`

### Response

Returns the created user object with a 201 status code.`,
              categoryId: "technical-docs",
              subcategoryId: "api-endpoints",
              tags: ["api", "users", "endpoints"],
              author: "System",
              createdAt: new Date("2024-01-01"),
              updatedAt: new Date("2024-01-01"),
              isPublished: true,
              views: 0,
            },
          ],
          createdAt: new Date("2024-01-01"),
        },
      ],
      createdAt: new Date("2024-01-01"),
    },
    {
      id: "troubleshooting",
      name: "Troubleshooting",
      description: "Solutions to common problems and issues",
      icon: "🔧",
      color: "orange",
      articles: [
        {
          id: "common-issues",
          title: "Common Issues and Solutions",
          content: `# Common Issues and Solutions

Here are solutions to the most frequently encountered problems.

## Login Issues

### Problem: Can't log in to my account

**Solutions:**
1. Check that you're using the correct email address
2. Verify your password (try resetting if needed)
3. Clear your browser cache and cookies
4. Try using an incognito/private browsing window
5. Check if your account has been suspended

### Problem: Forgot my password

**Solution:**
1. Go to the login page
2. Click "Forgot Password"
3. Enter your email address
4. Check your email for reset instructions
5. Follow the link to create a new password

## Performance Issues

### Problem: Application is running slowly

**Solutions:**
1. Check your internet connection
2. Close unnecessary browser tabs
3. Clear browser cache
4. Disable browser extensions temporarily
5. Try using a different browser

### Problem: Pages not loading

**Solutions:**
1. Refresh the page (Ctrl+F5 or Cmd+Shift+R)
2. Check if the service is down (status page)
3. Try accessing from a different network
4. Contact support if the issue persists

## Data Issues

### Problem: My data is not syncing

**Solutions:**
1. Check your internet connection
2. Log out and log back in
3. Force a manual sync if available
4. Check if you've exceeded storage limits
5. Contact support for data recovery

### Problem: Missing or deleted data

**Solutions:**
1. Check the trash/recycle bin
2. Look for recent backups
3. Check if data was moved to a different location
4. Contact support immediately for data recovery

## Browser Compatibility

### Supported Browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### If you're using an unsupported browser:
1. Update to the latest version
2. Switch to a supported browser
3. Enable JavaScript if disabled
4. Allow cookies from our domain

## Still Need Help?

If none of these solutions work:
1. Check our status page for known issues
2. Search our community forum
3. Contact our support team with:
   - Description of the problem
   - Steps you've already tried
   - Browser and operating system info
   - Screenshots if applicable`,
          categoryId: "troubleshooting",
          tags: ["troubleshooting", "common-issues", "solutions"],
          author: "System",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
          isPublished: true,
          views: 0,
        },
      ],
      subcategories: [],
      createdAt: new Date("2024-01-01"),
    },
  ],
  users: [
    {
      id: "admin-001",
      username: "admin",
      password: "admin123",
      email: "admin@kuhlekt.com",
      role: "admin",
      isActive: true,
      createdAt: new Date("2024-01-01"),
      lastLogin: null,
    },
    {
      id: "editor-001",
      username: "editor",
      password: "editor123",
      email: "editor@kuhlekt.com",
      role: "editor",
      isActive: true,
      createdAt: new Date("2024-01-01"),
      lastLogin: null,
    },
    {
      id: "viewer-001",
      username: "viewer",
      password: "viewer123",
      email: "viewer@kuhlekt.com",
      role: "viewer",
      isActive: true,
      createdAt: new Date("2024-01-01"),
      lastLogin: null,
    },
  ],
  auditLog: [
    {
      id: "audit-001",
      action: "system_initialized",
      performedBy: "system",
      timestamp: new Date("2024-01-01"),
      details: "Knowledge base system initialized with default data",
    },
  ],
  pageVisits: 0,
  lastUpdated: new Date(),
})

// Load data from file
async function loadData(): Promise<KnowledgeBaseData> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(DATA_FILE_PATH, "utf-8")
    const parsedData = JSON.parse(data)

    // Convert date strings back to Date objects
    const convertDates = (obj: any): any => {
      if (obj === null || obj === undefined) return obj
      if (typeof obj === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
        return new Date(obj)
      }
      if (Array.isArray(obj)) {
        return obj.map(convertDates)
      }
      if (typeof obj === "object") {
        const converted: any = {}
        for (const [key, value] of Object.entries(obj)) {
          converted[key] = convertDates(value)
        }
        return converted
      }
      return obj
    }

    const result = convertDates(parsedData)
    console.log("📁 Data loaded from file:", {
      categories: result.categories?.length || 0,
      users: result.users?.length || 0,
      auditLog: result.auditLog?.length || 0,
    })
    return result
  } catch (error) {
    console.log("🔧 No existing data file found, creating default data...")
    const defaultData = getDefaultData()
    await saveData(defaultData)
    return defaultData
  }
}

// Save data to file
async function saveData(data: Partial<KnowledgeBaseData>): Promise<void> {
  try {
    await ensureDataDirectory()

    // Load existing data first
    let existingData: KnowledgeBaseData
    try {
      existingData = await loadData()
    } catch {
      existingData = getDefaultData()
    }

    // Merge with existing data
    const updatedData: KnowledgeBaseData = {
      ...existingData,
      ...data,
      lastUpdated: new Date(),
    }

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(updatedData, null, 2), "utf-8")
    console.log("💾 Data saved successfully to:", DATA_FILE_PATH)
  } catch (error) {
    console.error("❌ Error saving data:", error)
    throw new Error("Failed to save data")
  }
}

export async function GET() {
  try {
    console.log("📖 API: Loading knowledge base data...")
    const data = await loadData()
    console.log("✅ API: Data loaded successfully")
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("❌ API: Error loading data:", error)
    const fallbackData = getDefaultData()
    return NextResponse.json(fallbackData, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("💾 API: Saving knowledge base data...")
    const body = await request.json()
    await saveData(body)
    console.log("✅ API: Data saved successfully")
    return NextResponse.json({ success: true, message: "Data saved successfully" })
  } catch (error) {
    console.error("❌ API: Error saving data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
