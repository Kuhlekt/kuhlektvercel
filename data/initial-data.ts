import type { Category } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "1",
    name: "Getting Started",
    description: "Basic information to get you started",
    articles: [
      {
        id: "1",
        title: "Welcome to Kuhlekt Knowledge Base",
        content:
          "This is your comprehensive knowledge base. Here you can find all the information you need to get started with our platform.",
        tags: ["welcome", "introduction"],
        categoryId: "1",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        author: "System",
      },
      {
        id: "2",
        title: "How to Navigate",
        content:
          "Use the category tree on the left to browse articles. You can also use the search function to find specific content.",
        tags: ["navigation", "help"],
        categoryId: "1",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        author: "System",
      },
    ],
    subcategories: [
      {
        id: "1-1",
        name: "First Steps",
        description: "Your first steps with the platform",
        articles: [
          {
            id: "3",
            title: "Creating Your First Project",
            content:
              "Learn how to create your first project in our platform. This guide will walk you through the entire process step by step.",
            tags: ["project", "tutorial"],
            categoryId: "1",
            subcategoryId: "1-1",
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
            updatedAt: new Date("2024-01-01T00:00:00.000Z"),
            author: "System",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Technical Documentation",
    description: "Technical guides and API documentation",
    articles: [
      {
        id: "4",
        title: "API Overview",
        content:
          "Our API provides a comprehensive set of endpoints for integrating with our platform. This overview covers the basics of authentication and common usage patterns.",
        tags: ["api", "technical"],
        categoryId: "2",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        author: "System",
      },
    ],
    subcategories: [
      {
        id: "2-1",
        name: "API Reference",
        description: "Detailed API documentation",
        articles: [
          {
            id: "5",
            title: "Authentication",
            content:
              "Learn how to authenticate with our API using API keys and OAuth tokens. This guide covers all supported authentication methods.",
            tags: ["api", "authentication", "security"],
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
    name: "Troubleshooting",
    description: "Common issues and their solutions",
    articles: [
      {
        id: "6",
        title: "Common Issues",
        content:
          "This article covers the most common issues users encounter and provides step-by-step solutions for resolving them.",
        tags: ["troubleshooting", "help"],
        categoryId: "3",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        author: "System",
      },
    ],
    subcategories: [],
  },
]
