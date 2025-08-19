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

This comprehensive knowledge base contains all the information you need to get started with our platform.

## What you'll find here:
- Step-by-step guides
- Best practices
- Troubleshooting tips
- API documentation
- Video tutorials

## Getting Help
If you can't find what you're looking for, please contact our support team at support@kuhlekt.com.

We're here to help you succeed!`,
        tags: ["welcome", "introduction", "getting-started"],
        categoryId: "1",
        createdAt: new Date("2024-01-01T10:00:00.000Z"),
        updatedAt: new Date("2024-01-01T10:00:00.000Z"),
        author: "Kuhlekt Team",
      },
      {
        id: "2",
        title: "System Requirements",
        content: `# System Requirements

Before getting started, please ensure your system meets the following requirements:

## Minimum Requirements
- **Operating System**: Windows 10, macOS 10.14, or Ubuntu 18.04+
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB available space
- **Internet**: Broadband connection required

## Browser Requirements
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Mobile Requirements
- iOS 13+ or Android 8+
- Mobile browsers: Chrome Mobile, Safari Mobile

## Network Requirements
- Ports 80 and 443 must be accessible
- WebSocket support required
- JavaScript must be enabled`,
        tags: ["requirements", "system", "technical"],
        categoryId: "1",
        createdAt: new Date("2024-01-01T11:00:00.000Z"),
        updatedAt: new Date("2024-01-01T11:00:00.000Z"),
        author: "Technical Team",
      },
    ],
    subcategories: [
      {
        id: "1-1",
        name: "Quick Start Guide",
        description: "Get up and running in minutes",
        articles: [
          {
            id: "3",
            title: "5-Minute Setup",
            content: `# 5-Minute Setup Guide

Get your Kuhlekt account up and running in just 5 minutes!

## Step 1: Create Your Account
1. Visit [kuhlekt.com/signup](https://kuhlekt.com/signup)
2. Enter your email address
3. Choose a strong password
4. Verify your email

## Step 2: Complete Your Profile
1. Add your company information
2. Upload a profile picture
3. Set your preferences
4. Choose your plan

## Step 3: Invite Your Team
1. Go to Team Settings
2. Click "Invite Members"
3. Enter email addresses
4. Set permissions

## Step 4: Create Your First Project
1. Click "New Project"
2. Choose a template
3. Configure settings
4. Start collaborating!

## Step 5: Explore Features
- Dashboard overview
- Project management tools
- Collaboration features
- Reporting and analytics

You're all set! Welcome to Kuhlekt!`,
            tags: ["setup", "quick-start", "onboarding"],
            categoryId: "1",
            subcategoryId: "1-1",
            createdAt: new Date("2024-01-01T12:00:00.000Z"),
            updatedAt: new Date("2024-01-01T12:00:00.000Z"),
            author: "Onboarding Team",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "User Guide",
    description: "Comprehensive user documentation",
    articles: [
      {
        id: "4",
        title: "Dashboard Overview",
        content: `# Dashboard Overview

Your dashboard is the central hub for all your activities on Kuhlekt.

## Main Sections

### 1. Navigation Bar
- **Home**: Return to dashboard
- **Projects**: View all projects
- **Team**: Manage team members
- **Settings**: Account preferences

### 2. Quick Stats
- Active projects count
- Team members online
- Recent activity feed
- Performance metrics

### 3. Recent Projects
View and access your most recently worked on projects:
- Project name and description
- Last modified date
- Team members involved
- Progress indicators

### 4. Activity Feed
Stay updated with:
- Team member activities
- Project updates
- System notifications
- Deadline reminders

### 5. Quick Actions
- Create new project
- Invite team member
- Generate report
- Access help center

## Customization
You can customize your dashboard by:
- Rearranging widgets
- Hiding/showing sections
- Setting notification preferences
- Choosing display themes`,
        tags: ["dashboard", "overview", "navigation"],
        categoryId: "2",
        createdAt: new Date("2024-01-02T09:00:00.000Z"),
        updatedAt: new Date("2024-01-02T09:00:00.000Z"),
        author: "Product Team",
      },
    ],
    subcategories: [
      {
        id: "2-1",
        name: "Account Management",
        description: "Managing your account settings",
        articles: [
          {
            id: "5",
            title: "Profile Settings",
            content: `# Profile Settings

Manage your personal account information and preferences.

## Personal Information
Update your basic details:
- **Full Name**: Your display name
- **Email Address**: Primary contact email
- **Phone Number**: Optional contact number
- **Time Zone**: For scheduling and notifications
- **Language**: Interface language preference

## Profile Picture
- Upload a professional photo
- Supported formats: JPG, PNG, GIF
- Maximum size: 5MB
- Recommended dimensions: 400x400px

## Security Settings
### Password Management
- Change your password regularly
- Use strong, unique passwords
- Enable two-factor authentication
- Review login history

### Privacy Controls
- Control who can see your profile
- Manage data sharing preferences
- Set notification permissions
- Configure activity visibility

## Notification Preferences
Customize how you receive updates:
- **Email Notifications**: Project updates, mentions, deadlines
- **Push Notifications**: Real-time alerts on mobile
- **In-App Notifications**: Dashboard notifications
- **SMS Alerts**: Critical updates only

## Account Deletion
If you need to delete your account:
1. Contact support@kuhlekt.com
2. Provide account verification
3. Confirm deletion request
4. Data will be permanently removed within 30 days`,
            tags: ["profile", "settings", "account"],
            categoryId: "2",
            subcategoryId: "2-1",
            createdAt: new Date("2024-01-02T10:00:00.000Z"),
            updatedAt: new Date("2024-01-02T10:00:00.000Z"),
            author: "Account Team",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "API Documentation",
    description: "Technical documentation for developers",
    articles: [
      {
        id: "6",
        title: "Authentication",
        content: `# API Authentication

Kuhlekt API uses token-based authentication for secure access.

## Getting Your API Key
1. Log into your Kuhlekt account
2. Navigate to Settings > API Keys
3. Click "Generate New Key"
4. Copy and store your key securely

## Authentication Methods

### Bearer Token
Include your API key in the Authorization header:

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

### Example Request
\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     https://api.kuhlekt.com/v1/projects
\`\`\`

## Rate Limits
- **Free Plan**: 100 requests/hour
- **Pro Plan**: 1,000 requests/hour
- **Enterprise**: 10,000 requests/hour

## Error Responses
### 401 Unauthorized
\`\`\`json
{
  "error": "Invalid API key",
  "code": 401,
  "message": "The provided API key is invalid or expired"
}
\`\`\`

### 429 Rate Limited
\`\`\`json
{
  "error": "Rate limit exceeded",
  "code": 429,
  "message": "Too many requests. Try again in 60 seconds",
  "retry_after": 60
}
\`\`\`

## Best Practices
- Store API keys securely
- Use environment variables
- Implement proper error handling
- Respect rate limits
- Use HTTPS only`,
        tags: ["api", "authentication", "security"],
        categoryId: "3",
        createdAt: new Date("2024-01-03T14:00:00.000Z"),
        updatedAt: new Date("2024-01-03T14:00:00.000Z"),
        author: "API Team",
      },
    ],
    subcategories: [],
  },
  {
    id: "4",
    name: "Troubleshooting",
    description: "Common issues and solutions",
    articles: [
      {
        id: "7",
        title: "Login Issues",
        content: `# Login Issues

Having trouble logging into your Kuhlekt account? Here are common solutions.

## Common Problems

### 1. Forgot Password
**Solution:**
1. Go to the login page
2. Click "Forgot Password"
3. Enter your email address
4. Check your email for reset link
5. Follow the instructions to create a new password

### 2. Account Locked
**Symptoms:** "Account temporarily locked" message
**Solution:**
- Wait 15 minutes and try again
- If still locked, contact support
- Check for suspicious login attempts

### 3. Two-Factor Authentication Issues
**Problem:** Not receiving 2FA codes
**Solutions:**
- Check your phone's time settings
- Ensure good cellular/wifi connection
- Try regenerating backup codes
- Contact support if authenticator app fails

### 4. Browser Issues
**Symptoms:** Login page won't load or form doesn't submit
**Solutions:**
- Clear browser cache and cookies
- Disable browser extensions
- Try incognito/private mode
- Update your browser
- Try a different browser

### 5. Email Not Recognized
**Problem:** "Email not found" error
**Solutions:**
- Check for typos in email address
- Try alternative email addresses
- Contact support to verify account status

## Still Need Help?
If none of these solutions work:
1. Contact support@kuhlekt.com
2. Include your email address
3. Describe the exact error message
4. Mention your browser and operating system`,
        tags: ["login", "troubleshooting", "password"],
        categoryId: "4",
        createdAt: new Date("2024-01-04T16:00:00.000Z"),
        updatedAt: new Date("2024-01-04T16:00:00.000Z"),
        author: "Support Team",
      },
    ],
    subcategories: [],
  },
]
