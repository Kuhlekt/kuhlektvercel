import type { Category } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "account-menu",
    name: "Account Menu",
    expanded: false,
    articles: [
      {
        id: "acc-1",
        title: "How to Access Account Menu",
        content:
          "<p>The Account Menu provides access to all account-related functions. To access the Account Menu, navigate to the top-right corner of the application and click on your profile icon.</p><p>From here, you can manage your account settings, view account information, and access various account-related features. The interface is designed to be intuitive and user-friendly.</p>",
        categoryId: "account-menu",
        tags: ["navigation", "account", "menu"],
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        createdBy: "admin",
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
              "<p>Credit monitoring helps you track changes to your credit report and score. To set up credit monitoring, go to Account Menu > Credit Monitoring and follow the setup wizard.</p><p>You'll need to provide basic information and verify your identity. The system will then begin monitoring your credit profile for any changes or suspicious activity.</p><h3>Key features include:</h3><ul><li>Real-time alerts</li><li>Monthly credit score updates</li><li>Identity theft protection</li><li>Detailed credit report analysis</li></ul>",
            categoryId: "account-menu",
            subcategoryId: "accounts-credit-monitoring",
            tags: ["credit", "monitoring", "setup"],
            createdAt: new Date("2024-01-20"),
            updatedAt: new Date("2024-01-20"),
            createdBy: "admin",
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
              "<p>Your credit report contains detailed information about your credit history, including payment history, credit accounts, and public records.</p><p>Learn how to read and interpret the different sections of your credit report to better understand your financial standing. Each section provides valuable insights into your creditworthiness and financial behavior.</p>",
            categoryId: "account-menu",
            subcategoryId: "accounts-credit-reports",
            tags: ["credit report", "understanding", "financial"],
            createdAt: new Date("2024-01-18"),
            updatedAt: new Date("2024-01-18"),
            createdBy: "editor",
          },
        ],
      },
      { id: "accounts-details", name: "Accounts Details", articles: [] },
      { id: "accounts-timeline", name: "Accounts Timeline", articles: [] },
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
          "<p>Batch jobs are automated processes that run at scheduled intervals to perform bulk operations. These jobs handle large volumes of data processing, report generation, and system maintenance tasks.</p><p>Learn how to monitor and manage batch job execution. The system provides comprehensive logging and monitoring capabilities to ensure all batch processes complete successfully.</p>",
        categoryId: "batch-jobs",
        tags: ["batch", "automation", "processing"],
        createdAt: new Date("2024-01-22"),
        updatedAt: new Date("2024-01-22"),
        createdBy: "admin",
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
              "<p>Bulk communication activities allow you to send messages to multiple recipients simultaneously. This feature is useful for announcements, notifications, and marketing campaigns.</p><p>Learn how to create, schedule, and monitor bulk communication activities. The system supports various message types including email, SMS, and push notifications.</p>",
            categoryId: "communications",
            subcategoryId: "comms-bulk-activities",
            tags: ["bulk", "communication", "messaging"],
            createdAt: new Date("2024-01-25"),
            updatedAt: new Date("2024-01-25"),
            createdBy: "editor",
          },
        ],
      },
      { id: "comms-dunning", name: "Comms Dunning", articles: [] },
      { id: "comms-statements", name: "Comms Statements", articles: [] },
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
    id: "system-docs",
    name: "System Documentation",
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
      { id: "reports-activities", name: "Reports - Activities", articles: [] },
      { id: "reports-open-items", name: "Reports - Open Items", articles: [] },
      { id: "reports-payments", name: "Reports - Payments", articles: [] },
      { id: "reports-provisioning", name: "Reports - Provisioning", articles: [] },
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
    subcategories: [{ id: "user-set-up", name: "User Set Up", articles: [] }],
  },
]
