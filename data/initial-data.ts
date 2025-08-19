import type { Category } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Basic information to get you started",
    articles: [
      {
        id: "1",
        title: "Welcome to the Knowledge Base",
        content:
          "This is your comprehensive knowledge base system. Here you can browse articles, search for information, and if you have the right permissions, add new content.\n\nFeatures:\n- Browse articles by category\n- Search functionality\n- User authentication\n- Admin dashboard\n- Data import/export\n- Audit logging",
        tags: ["welcome", "introduction", "overview"],
        categoryId: "1",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        author: "System",
      },
      {
        id: "2",
        title: "How to Navigate",
        content:
          "Navigation is simple and intuitive:\n\n1. **Browse Tab**: View all articles organized by categories\n2. **Search**: Use the search bar to find specific content\n3. **Login**: Access admin features with proper credentials\n4. **Add Article**: Create new content (requires login)\n5. **Admin**: Manage users and system settings (admin only)\n6. **Data**: Import/export system data (requires login)",
        tags: ["navigation", "guide", "help"],
        categoryId: "1",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        author: "System",
      },
    ],
    subcategories: [],
  },
  {
    id: "2",
    name: "Technical Documentation",
    description: "Technical guides and documentation",
    articles: [
      {
        id: "3",
        title: "System Architecture",
        content:
          "The knowledge base is built with modern web technologies:\n\n**Frontend:**\n- React with TypeScript\n- Next.js framework\n- Tailwind CSS for styling\n- shadcn/ui components\n\n**Storage:**\n- Local storage for data persistence\n- JSON-based data structure\n- Client-side data management\n\n**Features:**\n- Responsive design\n- Real-time search\n- User authentication\n- Role-based access control\n- Audit logging\n- Data import/export",
        tags: ["architecture", "technical", "development"],
        categoryId: "2",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        author: "System",
      },
    ],
    subcategories: [
      {
        id: "2-1",
        name: "API Documentation",
        description: "API guides and references",
        articles: [
          {
            id: "4",
            title: "Storage API",
            content:
              "The storage utility provides methods for data persistence:\n\n```typescript\n// Get categories\nconst categories = storage.getCategories()\n\n// Save categories\nstorage.saveCategories(updatedCategories)\n\n// Get users\nconst users = storage.getUsers()\n\n// Save users\nstorage.saveUsers(updatedUsers)\n\n// Clear all data\nstorage.clearAll()\n```\n\nAll methods handle errors gracefully and provide fallbacks for missing data.",
            tags: ["api", "storage", "documentation"],
            categoryId: "2",
            subcategoryId: "2-1",
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
            author: "System",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "User Management",
    description: "User accounts and permissions",
    articles: [
      {
        id: "5",
        title: "User Roles",
        content:
          "The system supports three user roles:\n\n**Admin**\n- Full system access\n- User management\n- Category management\n- Data import/export\n- Audit log access\n\n**Editor**\n- Create and edit articles\n- Data import/export\n- Limited admin features\n\n**Viewer**\n- Read-only access\n- Browse and search articles\n- No administrative privileges\n\nDefault credentials:\n- admin/admin123 (Admin)\n- editor/editor123 (Editor)\n- viewer/viewer123 (Viewer)",
        tags: ["users", "roles", "permissions", "access"],
        categoryId: "3",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        author: "System",
      },
    ],
    subcategories: [],
  },
]
