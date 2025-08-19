import type { Category, Article } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Basic information to get you started",
    createdAt: new Date("2024-01-01"),
    createdBy: "admin",
  },
  {
    id: "2",
    name: "User Guides",
    description: "Step-by-step user guides",
    createdAt: new Date("2024-01-01"),
    createdBy: "admin",
  },
  {
    id: "3",
    name: "Technical Documentation",
    description: "Technical specifications and API documentation",
    createdAt: new Date("2024-01-01"),
    createdBy: "admin",
  },
  {
    id: "4",
    name: "FAQ",
    description: "Frequently asked questions",
    createdAt: new Date("2024-01-01"),
    createdBy: "admin",
  },
  {
    id: "5",
    name: "Installation",
    description: "Installation guides",
    parentId: "1",
    createdAt: new Date("2024-01-01"),
    createdBy: "admin",
  },
  {
    id: "6",
    name: "Configuration",
    description: "Configuration guides",
    parentId: "1",
    createdAt: new Date("2024-01-01"),
    createdBy: "admin",
  },
]

export const initialArticles: Article[] = [
  {
    id: "1",
    title: "Welcome to Kuhlekt Knowledge Base",
    content: `# Welcome to Kuhlekt Knowledge Base

This is your comprehensive knowledge management system. Here you can:

- Browse articles by category
- Search for specific information
- Create and edit articles (with proper permissions)
- Manage users and categories (admin only)

## Getting Started

1. **Browse Categories**: Use the left sidebar to navigate through different categories
2. **Search**: Use the search bar in the top navigation to find specific articles
3. **Login**: Click the login button to access additional features based on your role

## User Roles

- **Viewer**: Can read all published articles
- **Editor**: Can create and edit articles
- **Admin**: Full access to all features including user management

## Features

- Rich text editing with image support
- Category-based organization
- Full-text search
- User role management
- Audit logging
- Data export/import

Start exploring by clicking on any category in the sidebar!`,
    categoryId: "1",
    authorId: "1",
    createdBy: "admin",
    tags: ["welcome", "getting-started", "overview"],
    status: "published",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    title: "How to Install the System",
    content: `# Installation Guide

Follow these steps to install the Kuhlekt Knowledge Base system:

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Modern web browser

## Installation Steps

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/kuhlekt/knowledge-base.git
   cd knowledge-base
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to \`http://localhost:3000\`

## Configuration

The system uses localStorage for data persistence in development. For production, you may want to integrate with a proper database.

## Default Users

The system comes with three default users:
- admin/admin123 (Administrator)
- editor/editor123 (Editor)
- viewer/viewer123 (Viewer)

You can change these credentials after logging in as an administrator.`,
    categoryId: "5",
    authorId: "1",
    createdBy: "admin",
    tags: ["installation", "setup", "guide"],
    status: "published",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    title: "User Management Guide",
    content: `# User Management

This guide explains how to manage users in the Kuhlekt Knowledge Base system.

## Accessing User Management

Only administrators can access user management features:

1. Log in as an administrator
2. Click the "Admin Panel" button in the top navigation
3. Select the "User Management" tab

## User Roles

### Administrator
- Full system access
- Can create, edit, and delete users
- Can manage categories and articles
- Access to audit logs and system settings

### Editor
- Can create and edit articles
- Can view all categories
- Cannot manage users or system settings

### Viewer
- Read-only access to published articles
- Can search and browse content
- Cannot create or edit content

## Creating New Users

1. In the User Management tab, click "Add User"
2. Fill in the required information:
   - Username (must be unique)
   - Email address
   - Password
   - Role selection
3. Click "Create User"

## Editing Users

1. Find the user in the user list
2. Click the "Edit" button
3. Modify the desired fields
4. Click "Save Changes"

## Security Best Practices

- Use strong passwords
- Regularly review user access
- Remove inactive users
- Monitor the audit log for suspicious activity`,
    categoryId: "2",
    authorId: "1",
    createdBy: "admin",
    tags: ["users", "management", "admin", "security"],
    status: "published",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    title: "Frequently Asked Questions",
    content: `# Frequently Asked Questions

## General Questions

### Q: How do I reset my password?
A: Contact your system administrator to reset your password. Password reset functionality will be added in a future update.

### Q: Can I change my username?
A: Usernames can only be changed by administrators through the user management interface.

### Q: How do I search for articles?
A: Use the search bar in the top navigation. It searches through article titles, content, and tags.

## Technical Questions

### Q: Where is my data stored?
A: In the current version, data is stored in your browser's localStorage. For production use, consider integrating with a proper database.

### Q: Can I export my data?
A: Yes, administrators can export all system data through the Admin Panel > Data Management section.

### Q: How do I backup the system?
A: Use the export feature in the Admin Panel to create regular backups of your data.

## Troubleshooting

### Q: I can't log in
A: Check that you're using the correct username and password. Contact your administrator if the problem persists.

### Q: Articles aren't saving
A: Ensure you have the proper permissions (Editor or Admin role) and that your browser allows localStorage.

### Q: Images aren't displaying
A: Make sure images are properly uploaded and that your browser supports the image format.

## Feature Requests

### Q: Can you add feature X?
A: Feature requests can be submitted through the appropriate channels. Common requested features include:
- Email notifications
- Advanced search filters
- Document versioning
- Integration with external systems`,
    categoryId: "4",
    authorId: "2",
    createdBy: "editor",
    tags: ["faq", "help", "troubleshooting"],
    status: "published",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
]
