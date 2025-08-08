import type { Category } from "../types/knowledge-base"

export const initialCategories: Category[] = [
  {
    id: "kuhlekt",
    name: "Kuhlekt",
    expanded: true,
    articles: [],
    subcategories: [
      {
        id: "account-menu",
        name: "Account Menu",
        articles: [
          {
            id: "access-account-menu",
            title: "How to Access Account Menu",
            content: `<div class="space-y-4">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop" alt="Account Menu Interface" class="w-full h-48 object-cover rounded-lg mb-4" />
              
              <h2 class="text-xl font-semibold">Accessing Your Account Menu</h2>
              <p>The Account Menu is your central hub for managing all account-related settings and preferences. Here's how to access it:</p>
              
              <h3 class="text-lg font-medium">Step 1: Login to Your Dashboard</h3>
              <p>Navigate to the main dashboard after logging into your Kuhlekt account. The Account Menu icon is located in the top-right corner of the interface.</p>
              
              <h3 class="text-lg font-medium">Step 2: Click the Profile Icon</h3>
              <p>Look for the circular profile icon or your initials in the navigation bar. This will open a dropdown menu with various account options.</p>
              
              <h3 class="text-lg font-medium">Available Options</h3>
              <ul class="list-disc pl-6 space-y-2">
                <li><strong>Profile Settings:</strong> Update your personal information and preferences</li>
                <li><strong>Security:</strong> Manage passwords and two-factor authentication</li>
                <li><strong>Billing:</strong> View subscription details and payment methods</li>
                <li><strong>Notifications:</strong> Configure email and system notifications</li>
                <li><strong>API Keys:</strong> Generate and manage API access tokens</li>
              </ul>
              
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-blue-800"><strong>Pro Tip:</strong> You can also use the keyboard shortcut Ctrl+Shift+A (Cmd+Shift+A on Mac) to quickly access the Account Menu from anywhere in the application.</p>
              </div>
            </div>`,
            categoryId: "kuhlekt",
            subcategoryId: "account-menu",
            tags: ["account", "menu", "navigation", "profile"],
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-01-15T10:00:00Z",
            createdBy: "admin"
          },
          {
            id: "credit-monitoring-setup",
            title: "Setting Up Credit Monitoring",
            content: `<div class="space-y-4">
              <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop" alt="Credit Monitoring Dashboard" class="w-full h-48 object-cover rounded-lg mb-4" />
              
              <h2 class="text-xl font-semibold">Credit Monitoring Setup Guide</h2>
              <p>Kuhlekt's credit monitoring feature helps you track changes to your credit profile in real-time. Follow these steps to enable comprehensive monitoring:</p>
              
              <h3 class="text-lg font-medium">Initial Setup</h3>
              <ol class="list-decimal pl-6 space-y-2">
                <li>Navigate to the Account Menu and select "Credit Monitoring"</li>
                <li>Click "Enable Monitoring" to begin the setup process</li>
                <li>Verify your identity using the secure verification system</li>
                <li>Select your monitoring preferences and alert settings</li>
              </ol>
              
              <h3 class="text-lg font-medium">Monitoring Features</h3>
              <ul class="list-disc pl-6 space-y-2">
                <li><strong>Real-time Alerts:</strong> Instant notifications for credit changes</li>
                <li><strong>Score Tracking:</strong> Monthly credit score updates from all three bureaus</li>
                <li><strong>Identity Protection:</strong> Dark web monitoring for personal information</li>
                <li><strong>Account Monitoring:</strong> Track new accounts opened in your name</li>
                <li><strong>Inquiry Alerts:</strong> Notifications when someone checks your credit</li>
              </ul>
              
              <h3 class="text-lg font-medium">Alert Configuration</h3>
              <p>Customize your alert preferences to receive notifications via:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li>Email notifications (recommended)</li>
                <li>SMS text messages</li>
                <li>Push notifications through the mobile app</li>
                <li>In-app dashboard alerts</li>
              </ul>
              
              <div class="bg-green-50 p-4 rounded-lg">
                <p class="text-green-800"><strong>Security Note:</strong> All credit monitoring data is encrypted and stored securely. Kuhlekt never stores your full SSN or sensitive financial information on our servers.</p>
              </div>
            </div>`,
            categoryId: "kuhlekt",
            subcategoryId: "account-menu",
            tags: ["credit", "monitoring", "alerts", "security"],
            createdAt: "2024-01-16T14:30:00Z",
            updatedAt: "2024-01-16T14:30:00Z",
            createdBy: "admin"
          },
          {
            id: "understanding-credit-report",
            title: "Understanding Your Credit Report",
            content: `<div class="space-y-4">
              <img src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=400&fit=crop" alt="Credit Report Analysis" class="w-full h-48 object-cover rounded-lg mb-4" />
              
              <h2 class="text-xl font-semibold">Decoding Your Credit Report</h2>
              <p>Your credit report is a detailed record of your credit history. Understanding each section helps you make informed financial decisions and identify areas for improvement.</p>
              
              <h3 class="text-lg font-medium">Personal Information Section</h3>
              <p>This section contains your identifying information:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li>Full name and any name variations</li>
                <li>Current and previous addresses</li>
                <li>Social Security number</li>
                <li>Date of birth</li>
                <li>Employment information</li>
              </ul>
              
              <h3 class="text-lg font-medium">Account Information</h3>
              <p>Details about your credit accounts, including:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li><strong>Account Type:</strong> Credit cards, loans, mortgages</li>
                <li><strong>Account Status:</strong> Open, closed, paid off</li>
                <li><strong>Credit Limit:</strong> Maximum amount you can borrow</li>
                <li><strong>Balance:</strong> Current amount owed</li>
                <li><strong>Payment History:</strong> Record of on-time and late payments</li>
                <li><strong>Date Opened:</strong> When the account was established</li>
              </ul>
              
              <h3 class="text-lg font-medium">Payment History</h3>
              <p>This is the most important factor in your credit score (35% of FICO score). It shows:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li>On-time payment records</li>
                <li>Late payments (30, 60, 90+ days)</li>
                <li>Accounts sent to collections</li>
                <li>Bankruptcies, foreclosures, or liens</li>
              </ul>
              
              <h3 class="text-lg font-medium">Credit Inquiries</h3>
              <p>Two types of inquiries appear on your report:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li><strong>Hard Inquiries:</strong> When you apply for credit (affects your score)</li>
                <li><strong>Soft Inquiries:</strong> Background checks or pre-approved offers (no score impact)</li>
              </ul>
              
              <h3 class="text-lg font-medium">Public Records</h3>
              <p>Legal matters that affect your creditworthiness:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li>Bankruptcies</li>
                <li>Tax liens</li>
                <li>Civil judgments</li>
                <li>Foreclosures</li>
              </ul>
              
              <div class="bg-yellow-50 p-4 rounded-lg">
                <p class="text-yellow-800"><strong>Important:</strong> Review your credit report regularly for errors or fraudulent activity. You're entitled to one free credit report annually from each bureau through annualcreditreport.com.</p>
              </div>
              
              <h3 class="text-lg font-medium">Improving Your Credit Report</h3>
              <ol class="list-decimal pl-6 space-y-2">
                <li>Pay all bills on time, every time</li>
                <li>Keep credit utilization below 30% (ideally under 10%)</li>
                <li>Don't close old credit accounts</li>
                <li>Limit new credit applications</li>
                <li>Dispute any errors you find</li>
                <li>Consider becoming an authorized user on someone else's account</li>
              </ol>
            </div>`,
            categoryId: "kuhlekt",
            subcategoryId: "account-menu",
            tags: ["credit report", "credit score", "financial", "analysis"],
            createdAt: "2024-01-17T09:15:00Z",
            updatedAt: "2024-01-17T09:15:00Z",
            createdBy: "admin"
          }
        ]
      },
      {
        id: "batch-jobs",
        name: "Batch Jobs",
        articles: [
          {
            id: "batch-job-processing",
            title: "Understanding Batch Job Processing",
            content: `<div class="space-y-4">
              <img src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop" alt="Data Processing Center" class="w-full h-48 object-cover rounded-lg mb-4" />
              
              <h2 class="text-xl font-semibold">Batch Job Processing in Kuhlekt</h2>
              <p>Batch jobs are automated processes that handle large volumes of data efficiently. Understanding how they work helps you optimize your data processing workflows.</p>
              
              <h3 class="text-lg font-medium">What are Batch Jobs?</h3>
              <p>Batch jobs are scheduled processes that execute without user interaction, typically during off-peak hours. They're designed to:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li>Process large datasets efficiently</li>
                <li>Perform routine maintenance tasks</li>
                <li>Generate reports and analytics</li>
                <li>Synchronize data between systems</li>
                <li>Execute data transformations</li>
              </ul>
              
              <h3 class="text-lg font-medium">Types of Batch Jobs</h3>
              
              <h4 class="font-medium">1. Data Import Jobs</h4>
              <p>These jobs import data from external sources:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li>Credit bureau data updates</li>
                <li>Bank transaction imports</li>
                <li>Third-party API data synchronization</li>
                <li>File-based data ingestion</li>
              </ul>
              
              <h4 class="font-medium">2. Processing Jobs</h4>
              <p>Transform and analyze imported data:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li>Credit score calculations</li>
                <li>Risk assessment algorithms</li>
                <li>Data validation and cleansing</li>
                <li>Duplicate detection and merging</li>
              </ul>
              
              <h4 class="font-medium">3. Report Generation Jobs</h4>
              <p>Create scheduled reports and analytics:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li>Monthly credit reports</li>
                <li>Compliance reports</li>
                <li>Performance dashboards</li>
                <li>Customer statements</li>
              </ul>
              
              <h4 class="font-medium">4. Maintenance Jobs</h4>
              <p>Keep the system running smoothly:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li>Database optimization</li>
                <li>Log file cleanup</li>
                <li>Cache refresh</li>
                <li>Backup operations</li>
              </ul>
              
              <h3 class="text-lg font-medium">Job Scheduling</h3>
              <p>Batch jobs can be scheduled in various ways:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li><strong>Time-based:</strong> Daily, weekly, monthly schedules</li>
                <li><strong>Event-driven:</strong> Triggered by specific events</li>
                <li><strong>Dependency-based:</strong> Run after other jobs complete</li>
                <li><strong>Manual:</strong> Started by administrators when needed</li>
              </ul>
              
              <h3 class="text-lg font-medium">Monitoring Batch Jobs</h3>
              <p>The Kuhlekt dashboard provides comprehensive job monitoring:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li>Real-time job status updates</li>
                <li>Execution history and logs</li>
                <li>Performance metrics and timing</li>
                <li>Error notifications and alerts</li>
                <li>Resource utilization tracking</li>
              </ul>
              
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-blue-800"><strong>Best Practice:</strong> Monitor batch job performance regularly and set up alerts for failed jobs. This ensures data processing continues smoothly and issues are addressed quickly.</p>
              </div>
              
              <h3 class="text-lg font-medium">Troubleshooting Common Issues</h3>
              
              <h4 class="font-medium">Job Failures</h4>
              <ul class="list-disc pl-6 space-y-1">
                <li>Check error logs for specific failure reasons</li>
                <li>Verify data source availability</li>
                <li>Ensure sufficient system resources</li>
                <li>Validate input data format and quality</li>
              </ul>
              
              <h4 class="font-medium">Performance Issues</h4>
              <ul class="list-disc pl-6 space-y-1">
                <li>Review job execution times and trends</li>
                <li>Optimize database queries and indexes</li>
                <li>Consider breaking large jobs into smaller chunks</li>
                <li>Schedule resource-intensive jobs during off-peak hours</li>
              </ul>
              
              <h4 class="font-medium">Data Quality Problems</h4>
              <ul class="list-disc pl-6 space-y-1">
                <li>Implement data validation rules</li>
                <li>Set up data quality monitoring</li>
                <li>Create data cleansing procedures</li>
                <li>Establish data governance policies</li>
              </ul>
            </div>`,
            categoryId: "kuhlekt",
            subcategoryId: "batch-jobs",
            tags: ["batch", "processing", "automation", "data"],
            createdAt: "2024-01-18T11:45:00Z",
            updatedAt: "2024-01-18T11:45:00Z",
            createdBy: "admin"
          }
        ]
      },
      {
        id: "communications",
        name: "Communications",
        articles: [
          {
            id: "bulk-communication-activities",
            title: "Managing Bulk Communication Activities",
            content: `<div class="space-y-4">
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop" alt="Communication Center" class="w-full h-48 object-cover rounded-lg mb-4" />
              
              <h2 class="text-xl font-semibold">Bulk Communication Management</h2>
              <p>Kuhlekt's bulk communication system enables you to send targeted messages to large groups of customers efficiently while maintaining compliance and personalization.</p>
              
              <h3 class="text-lg font-medium">Communication Channels</h3>
              
              <h4 class="font-medium">Email Communications</h4>
              <ul class="list-disc pl-6 space-y-1">
                <li><strong>Marketing Campaigns:</strong> Promotional offers and product updates</li>
                <li><strong>Transactional Emails:</strong> Account notifications and confirmations</li>
                <li><strong>Educational Content:</strong> Credit tips and financial guidance</li>
                <li><strong>Compliance Notices:</strong> Required legal and regulatory communications</li>
              </ul>
              
              <h4 class="font-medium">SMS Messaging</h4>
              <ul class="list-disc pl-6 space-y-1">
                <li><strong>Alert Notifications:</strong> Credit score changes and account alerts</li>
                <li><strong>Appointment Reminders:</strong> Consultation and meeting notifications</li>
                <li><strong>Payment Reminders:</strong> Due date and overdue notifications</li>
                <li><strong>Security Alerts:</strong> Login attempts and security notifications</li>
              </ul>
              
              <h4 class="font-medium">Push Notifications</h4>
              <ul class="list-disc pl-6 space-y-1">
                <li><strong>Real-time Alerts:</strong> Immediate credit monitoring notifications</li>
                <li><strong>App Updates:</strong> New feature announcements</li>
                <li><strong>Engagement Messages:</strong> Tips and educational content</li>
              </ul>
              
              <h3 class="text-lg font-medium">Campaign Creation Process</h3>
              
              <h4 class="font-medium">Step 1: Audience Segmentation</h4>
              <p>Define your target audience using various criteria:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li>Credit score ranges</li>
                <li>Account status and activity</li>
                <li>Geographic location</li>
                <li>Demographic information</li>
                <li>Behavioral patterns</li>
                <li>Communication preferences</li>
              </ul>
              
              <h4 class="font-medium">Step 2: Content Development</h4>
              <p>Create compelling and compliant content:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li>Personalized messaging using customer data</li>
                <li>Clear and actionable call-to-actions</li>
                <li>Mobile-optimized formatting</li>
                <li>Compliance with regulations (CAN-SPAM, TCPA)</li>
                <li>A/B testing variations</li>
              </ul>
              
              <h4 class="font-medium">Step 3: Scheduling and Delivery</h4>
              <p>Optimize timing for maximum engagement:</p>
              <ul class="list-disc pl-6 space-y-1">
                <li>Time zone considerations</li>
                <li>Optimal send times based on audience behavior</li>
                <li>Frequency capping to prevent over-communication</li>
                <li>Delivery rate limiting for system performance</li>
              </ul>
              
              <h3 class="text-lg font-medium">Personalization Features</h3>
              
              <h4 class="font-medium">Dynamic Content</h4>
              <ul class="list-disc pl-6 space-y-1">
                <li>Customer name and account information</li>
                <li>Credit score and recent changes</li>
                <li>Personalized recommendations</li>
                <li>Account-specific offers and promotions</li>
              </ul>
              
              <h4 class="font-medium">Behavioral Triggers</h4>
              <ul class="list-disc pl-6 space-y-1">
                <li>Welcome series for new customers</li>
                <li>Re-engagement campaigns for inactive users</li>
                <li>Milestone celebrations (credit score improvements)</li>
                <li>Abandoned application follow-ups</li>
              </ul>
              
              <h3 class="text-lg font-medium">Compliance and Regulations</h3>
              
              <h4 class="font-medium">CAN-SPAM Act Compliance</h4>
              <ul class="list-disc pl-6 space-y-1">
                <li>Clear sender identification</li>
                <li>Truthful subject lines</li>
                <li>Easy unsubscribe options</li>
                <li>Physical address disclosure</li>
                <li>Prompt unsubscribe processing</li>
              </ul>
              
              <h4 class="font-medium">TCPA Compliance (SMS)</h4>
              <ul class="list-disc pl-6 space-y-1">
                <li>Express written consent for marketing messages</li>
                <li>Clear opt-out instructions (STOP keyword)</li>
                <li>Time restrictions (8 AM - 9 PM local time)</li>
                <li>Consent record keeping</li>
              </ul>
              
              <h4 class="font-medium">GDPR and Privacy</h4>
              <ul class="list-disc pl-6 space-y-1">
                <li>Lawful basis for processing</li>
                <li>Data minimization principles</li>
                <li>Right to be forgotten</li>
                <li>Consent management</li>
              </ul>
              
              <h3 class="text-lg font-medium">Performance Monitoring</h3>
              
              <h4 class="font-medium">Key Metrics</h4>
              <ul class="list-disc pl-6 space-y-1">
                <li><strong>Delivery Rate:</strong> Percentage of messages successfully delivered</li>
                <li><strong>Open Rate:</strong> Percentage of recipients who opened the message</li>
                <li><strong>Click-through Rate:</strong> Percentage who clicked on links</li>
                <li><strong>Conversion Rate:</strong> Percentage who completed desired actions</li>
                <li><strong>Unsubscribe Rate:</strong> Percentage who opted out</li>
                <li><strong>Bounce Rate:</strong> Percentage of undeliverable messages</li>
              </ul>
              
              <h4 class="font-medium">Reporting and Analytics</h4>
              <ul class="list-disc pl-6 space-y-1">
                <li>Real-time campaign performance dashboards</li>
                <li>Detailed engagement analytics</li>
                <li>Audience behavior insights</li>
                <li>ROI and revenue attribution</li>
                <li>Comparative analysis across campaigns</li>
              </ul>
              
              <div class="bg-green-50 p-4 rounded-lg">
                <p class="text-green-800"><strong>Success Tip:</strong> Regularly analyze campaign performance and customer feedback to continuously improve your communication strategy. Focus on providing value to your audience rather than just promoting products.</p>
              </div>
              
              <h3 class="text-lg font-medium">Best Practices</h3>
              
              <h4 class="font-medium">Content Strategy</h4>
              <ul class="list-disc pl-6 space-y-1">
                <li>Maintain a consistent brand voice and tone</li>
                <li>Provide clear value in every communication</li>
                <li>Use compelling subject lines and preview text</li>
                <li>Include clear calls-to-action</li>
                <li>Test different content variations</li>
              </ul>
              
              <h4 class="font-medium">List Management</h4>
              <ul class="list-disc pl-6 space-y-1">
                <li>Regularly clean and update contact lists</li>
                <li>Segment audiences for targeted messaging</li>
                <li>Honor unsubscribe requests promptly</li>
                <li>Maintain preference centers for customer control</li>
                <li>Monitor and manage bounce rates</li>
              </ul>
              
              <h4 class="font-medium">Timing and Frequency</h4>
              <ul class="list-disc pl-6 space-y-1">
                <li>Test optimal send times for your audience</li>
                <li>Avoid over-communication fatigue</li>
                <li>Consider customer time zones</li>
                <li>Respect quiet hours for SMS messages</li>
                <li>Plan campaigns around holidays and events</li>
              </ul>
            </div>`,
            categoryId: "kuhlekt",
            subcategoryId: "communications",
            tags: ["communication", "email", "sms", "marketing", "compliance"],
            createdAt: "2024-01-19T16:20:00Z",
            updatedAt: "2024-01-19T16:20:00Z",
            createdBy: "admin"
          }
        ]
      }
    ]
  }
]
