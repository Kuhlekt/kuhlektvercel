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
          "This is your comprehensive knowledge base system. Here you can browse articles, search for information, and manage content.",
        categoryId: "1",
        tags: ["welcome", "introduction"],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        status: "published",
        priority: "high",
      },
    ],
    subcategories: [],
  },
  {
    id: "2",
    name: "Technical Documentation",
    description: "Technical guides and documentation",
    articles: [],
    subcategories: [
      {
        id: "2-1",
        name: "API Documentation",
        description: "API guides and references",
        articles: [
          {
            id: "2",
            title: "API Getting Started",
            content: "Learn how to use our API endpoints effectively.",
            categoryId: "2",
            subcategoryId: "2-1",
            tags: ["api", "development"],
            createdAt: new Date("2024-01-02"),
            updatedAt: new Date("2024-01-02"),
            status: "published",
            priority: "medium",
          },
        ],
      },
    ],
  },
]
