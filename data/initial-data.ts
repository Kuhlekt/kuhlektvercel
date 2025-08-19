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
          "This is your comprehensive knowledge base system. Here you can browse articles, search for information, and if you have the right permissions, add and manage content.",
        categoryId: "1",
        tags: ["welcome", "introduction"],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
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
            title: "REST API Overview",
            content:
              "Our REST API provides programmatic access to all knowledge base functionality. This guide covers authentication, endpoints, and common usage patterns.",
            categoryId: "2",
            subcategoryId: "2-1",
            tags: ["api", "rest", "documentation"],
            createdAt: new Date("2024-01-02"),
            updatedAt: new Date("2024-01-02"),
          },
        ],
      },
    ],
  },
  {
    id: "account-menu",
    name: "Account Menu",
    expanded: false,
    articles: [
      {
        id: "acc-1",
        title: "How to Access Account Menu",
        content:
          "The Account Menu provides access to all account-related functions. To access the Account Menu, navigate to the top-right corner of the application and click on your profile icon.\n\nhttps://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop\n\nFrom here, you can manage your account settings, view account information, and access various account-related features. The interface is designed to be intuitive and user-friendly.",
        categoryId: "account-menu",
        tags: ["navigation", "account", "menu"],
        createdAt: new Date("2024-01-15T00:00:00.000Z"),
        updatedAt: new Date("2024-01-15T00:00:00.000Z"),
        createdBy: "admin",
        editCount: 0,
      },
    ],
    subcategories: [
      {
        id: "accounts-credit-monitoring",
        name: "Accounts Credit Monitoring",
        articles: [
          {
            id: "acm-1",
            title: "Setting Up Credit Monitoring",
            content:
              "Credit monitoring helps you track changes to your credit report and score. To set up credit monitoring, go to Account Menu > Credit Monitoring and follow the setup wizard.\n\nhttps://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop\n\nYou'll need to provide basic information and verify your identity. The system will then begin monitoring your credit profile for any changes or suspicious activity.\n\nKey features include:\n• Real-time alerts\n• Monthly credit score updates\n• Identity theft protection\n• Detailed credit report analysis",
            categoryId: "account-menu",
            subcategoryId: "accounts-credit-monitoring",
            tags: ["credit", "monitoring", "setup"],
            createdAt: new Date("2024-01-20T00:00:00.000Z"),
            updatedAt: new Date("2024-01-20T00:00:00.000Z"),
            createdBy: "admin",
            editCount: 0,
          },
        ],
      },
      {
        id: "accounts-credit-reports",
        name: "Accounts Credit Reports",
        articles: [
          {
            id: "acr-1",
            title: "Understanding Your Credit Report",
            content:
              "Your credit report contains detailed information about your credit history, including payment history, credit accounts, and public records.\n\nhttps://images.unsplash.com/photo-1554224154-26032fced8bd?w=600&h=400&fit=crop\n\nLearn how to read and interpret the different sections of your credit report to better understand your financial standing. Each section provides valuable insights into your creditworthiness and financial behavior.",
            categoryId: "account-menu",
            subcategoryId: "accounts-credit-reports",
            tags: ["credit report", "understanding", "financial"],
            createdAt: new Date("2024-01-18T00:00:00.000Z"),
            updatedAt: new Date("2024-01-18T00:00:00.000Z"),
            createdBy: "editor",
            editCount: 0,
          },
        ],
      },
      {
        id: "accounts-details",
        name: "Accounts Details",
        articles: [],
      },
      {
        id: "accounts-timeline",
        name: "Accounts Timeline",
        articles: [],
      },
    ],
  },
  {
    id: "batch-jobs",
    name: "Batch Jobs",
    expanded: false,
    articles: [
      {
        id: "bj-1",
        title: "Understanding Batch Job Processing",
        content:
          "Batch jobs are automated processes that run at scheduled intervals to perform bulk operations. These jobs handle large volumes of data processing, report generation, and system maintenance tasks.\n\nhttps://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=400&fit=crop\n\nLearn how to monitor and manage batch job execution. The system provides comprehensive logging and monitoring capabilities to ensure all batch processes complete successfully.",
        categoryId: "batch-jobs",
        tags: ["batch", "automation", "processing"],
        createdAt: new Date("2024-01-22T00:00:00.000Z"),
        updatedAt: new Date("2024-01-22T00:00:00.000Z"),
        createdBy: "admin",
        editCount: 0,
      },
    ],
    subcategories: [],
  },
  {
    id: "communications",
    name: "Communications",
    expanded: true,
    articles: [],
    subcategories: [
      {
        id: "comms-bulk-activities",
        name: "Comms Bulk Activities",
        articles: [
          {
            id: "cba-1",
            title: "Managing Bulk Communication Activities",
            content:
              "Bulk communication activities allow you to send messages to multiple recipients simultaneously. This feature is useful for announcements, notifications, and marketing campaigns.\n\nhttps://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop\n\nLearn how to create, schedule, and monitor bulk communication activities. The system supports various message types including email, SMS, and push notifications.",
            categoryId: "communications",
            subcategoryId: "comms-bulk-activities",
            tags: ["bulk", "communication", "messaging"],
            createdAt: new Date("2024-01-25T00:00:00.000Z"),
            updatedAt: new Date("2024-01-25T00:00:00.000Z"),
            createdBy: "editor",
            editCount: 0,
          },
        ],
      },
      {
        id: "comms-dunning",
        name: "Comms Dunning",
        articles: [],
      },
      {
        id: "comms-statements",
        name: "Comms Statements",
        articles: [],
      },
    ],
  },
  {
    id: "data-load",
    name: "Data Load",
    expanded: false,
    articles: [],
    subcategories: [],
  },
  {
    id: "disputes",
    name: "Disputes",
    expanded: false,
    articles: [],
    subcategories: [],
  },
  {
    id: "kuhlekt",
    name: "Kuhlekt",
    expanded: false,
    articles: [],
    subcategories: [],
  },
  {
    id: "metrics",
    name: "Metrics",
    expanded: false,
    articles: [],
    subcategories: [],
  },
  {
    id: "regions",
    name: "Regions",
    expanded: false,
    articles: [],
    subcategories: [],
  },
  {
    id: "reports",
    name: "Reports",
    expanded: false,
    articles: [],
    subcategories: [
      {
        id: "reports-activities",
        name: "Reports - Activities",
        articles: [],
      },
      {
        id: "reports-open-items",
        name: "Reports - Open Items",
        articles: [],
      },
      {
        id: "reports-payments",
        name: "Reports - Payments",
        articles: [],
      },
      {
        id: "reports-provisioning",
        name: "Reports - Provisioning",
        articles: [],
      },
    ],
  },
  {
    id: "system",
    name: "System",
    expanded: false,
    articles: [],
    subcategories: [],
  },
  {
    id: "system-audit-logs",
    name: "System Audit Logs",
    expanded: false,
    articles: [],
    subcategories: [],
  },
  {
    id: "tables",
    name: "Tables",
    expanded: false,
    articles: [],
    subcategories: [],
  },
  {
    id: "to-do",
    name: "To-Do",
    expanded: false,
    articles: [],
    subcategories: [],
  },
  {
    id: "users",
    name: "Users",
    expanded: false,
    articles: [],
    subcategories: [
      {
        id: "user-set-up",
        name: "User Set Up",
        articles: [],
      },
    ],
  },
]
