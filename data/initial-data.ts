import type { Category } from "../types/knowledge-base"

export const initialData: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Essential guides to get you up and running",
    icon: "BookOpen",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    articles: [
      {
        id: "1",
        title: "Welcome to Kuhlekt Knowledge Base",
        content: `# Welcome to Kuhlekt Knowledge Base

This knowledge base contains comprehensive documentation, guides, and resources to help you get the most out of our platform.

## What you'll find here:

- **Getting Started Guides** - Step-by-step instructions for new users
- **Feature Documentation** - Detailed explanations of all features
- **Troubleshooting** - Solutions to common issues
- **Best Practices** - Tips and recommendations from our experts

## How to navigate:

1. Use the category tree on the left to browse topics
2. Use the search bar to find specific information
3. Click on any article title to read the full content

## Need help?

If you can't find what you're looking for, please contact our support team.`,
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
    description: "Solutions to common problems and issues",
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
    ],
    subcategories: [],
  },
]
