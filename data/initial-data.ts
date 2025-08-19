import type { Category } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Essential information for new users",
    articles: [
      {
        id: "1",
        title: "Welcome to the Knowledge Base",
        content:
          "This knowledge base contains important information and procedures for our organization. Use the navigation on the left to browse categories and articles.",
        tags: ["welcome", "introduction", "overview"],
        categoryId: "1",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        author: "System",
        status: "published",
        priority: "high",
      },
      {
        id: "2",
        title: "How to Search",
        content:
          "Use the search bar at the top of the page to find articles quickly. You can search by title, content, or tags.",
        tags: ["search", "help", "tutorial"],
        categoryId: "1",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        author: "System",
        status: "published",
        priority: "medium",
      },
    ],
    subcategories: [
      {
        id: "1-1",
        name: "First Steps",
        description: "Your first steps in the system",
        articles: [
          {
            id: "3",
            title: "Account Setup",
            content: "Learn how to set up your account and configure your preferences.",
            tags: ["account", "setup", "configuration"],
            categoryId: "1",
            subcategoryId: "1-1",
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
            author: "System",
            status: "published",
            priority: "high",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Procedures",
    description: "Standard operating procedures",
    articles: [
      {
        id: "4",
        title: "Emergency Procedures",
        content: "Important emergency procedures that all staff should know.",
        tags: ["emergency", "safety", "procedures"],
        categoryId: "2",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        author: "Safety Team",
        status: "published",
        priority: "high",
      },
    ],
    subcategories: [
      {
        id: "2-1",
        name: "Daily Operations",
        description: "Day-to-day operational procedures",
        articles: [
          {
            id: "5",
            title: "Opening Checklist",
            content: "Complete this checklist when opening the facility each day.",
            tags: ["checklist", "daily", "opening"],
            categoryId: "2",
            subcategoryId: "2-1",
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
            author: "Operations",
            status: "published",
            priority: "medium",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Technical Documentation",
    description: "Technical guides and documentation",
    articles: [],
    subcategories: [
      {
        id: "3-1",
        name: "System Administration",
        description: "System admin guides",
        articles: [
          {
            id: "6",
            title: "Server Maintenance",
            content: "Regular server maintenance procedures and schedules.",
            tags: ["server", "maintenance", "technical"],
            categoryId: "3",
            subcategoryId: "3-1",
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
            author: "IT Team",
            status: "published",
            priority: "medium",
          },
        ],
      },
    ],
  },
]
