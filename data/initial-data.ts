import type { Category } from "../types/knowledge-base"

export const initialData: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Basic information to get you started",
    icon: "BookOpen",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    articles: [
      {
        id: "1",
        title: "Welcome to the Knowledge Base",
        content:
          "This is your first article in the knowledge base. You can edit, delete, or create new articles using the admin interface.\n\nTo get started:\n1. Login with admin/admin123\n2. Navigate to the Admin section\n3. Explore the different management options",
        categoryId: "1",
        subcategoryId: undefined,
        tags: ["welcome", "introduction", "getting-started"],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "2",
        title: "System Requirements",
        content: `# System Requirements

Before getting started, please ensure your system meets the following requirements:

## Minimum Requirements:

- **Operating System**: Windows 10, macOS 10.14, or Linux Ubuntu 18.04+
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 1GB available space
- **Internet**: Broadband connection required

## Recommended Specifications:

- **RAM**: 16GB or more
- **Storage**: SSD with 10GB+ available space
- **Internet**: High-speed broadband (25+ Mbps)

## Browser Settings:

- JavaScript must be enabled
- Cookies must be allowed
- Pop-up blocker should allow our domain

Contact support if you have questions about compatibility.`,
        categoryId: "1",
        subcategoryId: undefined,
        tags: ["requirements", "system", "compatibility"],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    ],
    subcategories: [
      {
        id: "1-1",
        name: "Quick Start",
        description: "Get up and running in minutes",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        articles: [
          {
            id: "3",
            title: "5-Minute Setup Guide",
            content: `# 5-Minute Setup Guide

Get your account set up and ready to use in just 5 minutes!

## Step 1: Create Your Account (1 minute)

1. Click "Sign Up" on the homepage
2. Enter your email address
3. Choose a strong password
4. Verify your email address

## Step 2: Complete Your Profile (2 minutes)

1. Add your name and company information
2. Upload a profile picture (optional)
3. Set your preferences and timezone
4. Choose your notification settings

## Step 3: Explore the Dashboard (2 minutes)

1. Take the guided tour
2. Review the main navigation
3. Check out the quick actions panel
4. Bookmark important sections

## You're Ready!

Congratulations! Your account is now set up and ready to use. Check out our other guides for more advanced features.`,
            categoryId: "1",
            subcategoryId: "1-1",
            tags: ["setup", "quick-start", "guide"],
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01"),
          },
        ],
      },
      {
        id: "2",
        name: "Installation",
        description: "How to install and set up",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        articles: [
          {
            id: "2",
            title: "System Requirements",
            content:
              "Before you begin, make sure your system meets the following requirements:\n\n- Node.js 18 or higher\n- Modern web browser\n- Internet connection for initial setup\n\nThis knowledge base runs entirely in your browser with data stored locally.",
            categoryId: "2",
            subcategoryId: "2",
            tags: ["requirements", "setup", "installation"],
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01"),
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Features",
    description: "Detailed documentation of all platform features",
    icon: "Settings",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    articles: [],
    subcategories: [
      {
        id: "2-1",
        name: "User Management",
        description: "Managing users and permissions",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        articles: [
          {
            id: "4",
            title: "Adding New Users",
            content: `# Adding New Users

Learn how to add new users to your organization and set their permissions.

## Prerequisites

- You must have admin or user management permissions
- The user must have a valid email address

## Steps to Add a User

1. **Navigate to User Management**
   - Go to Admin Dashboard
   - Click on "User Management"

2. **Click Add User**
   - Click the "Add User" button
   - Fill in the required information

3. **Set User Details**
   - Enter username (must be unique)
   - Enter email address
   - Set initial password
   - Choose user role

4. **Assign Permissions**
   - Select appropriate role (Admin, Editor, Viewer)
   - Set specific permissions if needed
   - Review access levels

5. **Send Invitation**
   - Click "Add User" to create the account
   - User will receive an email invitation
   - They can log in with provided credentials

## User Roles

- **Admin**: Full system access
- **Editor**: Can create and edit content
- **Viewer**: Read-only access

## Best Practices

- Use strong passwords
- Assign minimal necessary permissions
- Regularly review user access
- Remove inactive users promptly`,
            categoryId: "2",
            subcategoryId: "2-1",
            tags: ["users", "management", "permissions"],
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01"),
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Troubleshooting",
    description: "Common issues and solutions",
    icon: "AlertCircle",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    articles: [
      {
        id: "5",
        title: "Common Login Issues",
        content: `# Common Login Issues

Having trouble logging in? Here are solutions to the most common login problems.

## Issue: "Invalid username or password"

**Possible Causes:**
- Incorrect username or password
- Caps Lock is enabled
- Account has been deactivated

**Solutions:**
1. Double-check your username and password
2. Ensure Caps Lock is off
3. Try typing your password in a text editor first
4. Contact admin if account is deactivated

## Issue: "Account locked"

**Possible Causes:**
- Too many failed login attempts
- Security policy triggered

**Solutions:**
1. Wait 15 minutes and try again
2. Contact your administrator
3. Use password reset if available

## Issue: Page won't load

**Possible Causes:**
- Internet connection problems
- Browser cache issues
- Server maintenance

**Solutions:**
1. Check your internet connection
2. Clear browser cache and cookies
3. Try a different browser
4. Check our status page for maintenance

## Issue: Two-factor authentication problems

**Possible Causes:**
- Phone time is incorrect
- App not synchronized
- Backup codes not working

**Solutions:**
1. Sync your phone's time
2. Regenerate authentication app
3. Use backup codes
4. Contact support for reset

## Still having issues?

If none of these solutions work, please contact our support team with:
- Your username
- Error message (if any)
- Browser and version
- Steps you tried`,
        categoryId: "3",
        subcategoryId: undefined,
        tags: ["login", "troubleshooting", "authentication"],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "3",
        title: "Common Issues",
        content:
          "Here are some common issues you might encounter:\n\n1. **Login problems** - Check your username and password\n   - Default admin: admin/admin123\n   - Default editor: editor/editor123\n   - Default viewer: viewer/viewer123\n\n2. **Slow loading** - Clear your browser cache\n\n3. **Missing content** - Refresh the page or check the data management section\n\n4. **Import/Export issues** - Ensure you're using valid JSON files",
        categoryId: "3",
        subcategoryId: undefined,
        tags: ["troubleshooting", "issues", "help"],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    ],
    subcategories: [],
  },
]
