import type { Category } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    expanded: false,
    articles: [
      {
        id: "1",
        title: "Welcome to Kuhlekt Knowledge Base",
        content:
          "Welcome to our comprehensive knowledge base! This is your go-to resource for finding answers, guides, and documentation.\n\nHere you'll find:\n- Step-by-step tutorials\n- Troubleshooting guides\n- Best practices\n- FAQ sections\n\nUse the search function or browse categories to find what you need.",
        categoryId: "1",
        tags: ["welcome", "introduction", "getting-started"],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        createdBy: "admin",
        editCount: 0,
      },
      {
        id: "2",
        title: "How to Navigate the Knowledge Base",
        content:
          "Navigation Tips:\n\n1. Use the search bar at the top to find specific topics\n2. Browse categories on the left sidebar\n3. Click on article titles to read full content\n4. Use tags to find related articles\n5. Bookmark frequently accessed articles\n\nThe knowledge base is organized into categories and subcategories for easy browsing.",
        categoryId: "1",
        tags: ["navigation", "tips", "help"],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        createdBy: "admin",
        editCount: 0,
      },
    ],
    subcategories: [
      {
        id: "1-1",
        name: "Quick Start Guide",
        articles: [
          {
            id: "3",
            title: "5-Minute Quick Start",
            content:
              "Get up and running in just 5 minutes:\n\n1. Browse the categories on the left\n2. Click on any article title to read it\n3. Use the search function to find specific topics\n4. Login as admin to add or edit articles\n5. Explore the admin dashboard for management features\n\nThat's it! You're ready to use the knowledge base effectively.",
            categoryId: "1",
            subcategoryId: "1-1",
            tags: ["quick-start", "tutorial", "basics"],
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01"),
            createdBy: "admin",
            editCount: 0,
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Technical Documentation",
    expanded: false,
    articles: [
      {
        id: "4",
        title: "System Requirements",
        content:
          "Minimum System Requirements:\n\n- Modern web browser (Chrome, Firefox, Safari, Edge)\n- JavaScript enabled\n- Internet connection for initial load\n- Local storage support for data persistence\n\nRecommended:\n- Latest browser version\n- High-speed internet connection\n- Desktop or tablet for best experience",
        categoryId: "2",
        tags: ["requirements", "technical", "system"],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        createdBy: "admin",
        editCount: 0,
      },
    ],
    subcategories: [
      {
        id: "2-1",
        name: "API Documentation",
        articles: [
          {
            id: "5",
            title: "Storage API Overview",
            content:
              "The knowledge base uses a local storage API for data persistence:\n\nKey Functions:\n- storage.getCategories() - Retrieve all categories\n- storage.saveCategories() - Save categories to storage\n- storage.getUsers() - Get user data\n- storage.saveUsers() - Save user data\n- storage.addAuditEntry() - Add audit log entry\n\nAll data is stored locally in the browser's localStorage.",
            categoryId: "2",
            subcategoryId: "2-1",
            tags: ["api", "storage", "technical"],
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01"),
            createdBy: "admin",
            editCount: 0,
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Troubleshooting",
    expanded: false,
    articles: [
      {
        id: "6",
        title: "Common Issues and Solutions",
        content:
          "Common Problems and Solutions:\n\n1. Login Issues:\n   - Check username and password\n   - Default admin credentials: admin/admin123\n   - Clear browser cache if needed\n\n2. Articles Not Loading:\n   - Refresh the page\n   - Check browser console for errors\n   - Ensure JavaScript is enabled\n\n3. Search Not Working:\n   - Try different keywords\n   - Check spelling\n   - Browse categories manually\n\n4. Data Not Saving:\n   - Ensure you're logged in as admin\n   - Check browser storage permissions\n   - Try in incognito/private mode",
        categoryId: "3",
        tags: ["troubleshooting", "issues", "solutions", "help"],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        createdBy: "admin",
        editCount: 0,
      },
    ],
    subcategories: [],
  },
]
