"use client"

import type { Article, Category } from "@/types/knowledge-base"

export const initialArticles: Article[] = [
  {
    id: "1",
    title: "Getting Started with Kuhlekt Knowledge Base",
    content: `# Welcome to Kuhlekt Knowledge Base

This is your comprehensive knowledge management system. Here's how to get started:

## Features
- **Article Management**: Create, edit, and organize articles
- **Category System**: Organize content with hierarchical categories
- **Search Functionality**: Find information quickly
- **User Management**: Control access with role-based permissions
- **Audit Logging**: Track all system activities

## Quick Start
1. Login with your credentials
2. Browse existing articles or create new ones
3. Use the search function to find specific information
4. Organize content with categories

## Admin Features
- User management
- System configuration
- Data export/import
- Audit log monitoring

Get started by exploring the articles or logging in to access admin features!`,
    category: "getting-started",
    tags: ["welcome", "tutorial", "basics"],
    author: "System",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    views: 0,
    featured: true,
  },
  {
    id: "2",
    title: "User Management Guide",
    content: `# User Management

Learn how to manage users in the Kuhlekt Knowledge Base system.

## User Roles
- **Admin**: Full system access
- **Editor**: Can create and edit articles
- **Viewer**: Read-only access

## Managing Users
1. Access the Admin Dashboard
2. Navigate to User Management
3. Add, edit, or remove users as needed

## Best Practices
- Assign appropriate roles based on responsibilities
- Regularly review user access
- Monitor user activity through audit logs`,
    category: "administration",
    tags: ["users", "admin", "roles"],
    author: "Admin",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
    views: 0,
  },
  {
    id: "3",
    title: "Article Creation Best Practices",
    content: `# Article Creation Best Practices

Guidelines for creating effective knowledge base articles.

## Structure Your Content
- Use clear, descriptive titles
- Include a brief introduction
- Use headings to organize sections
- Add relevant tags for discoverability

## Writing Tips
- Write in clear, simple language
- Use bullet points and numbered lists
- Include examples when helpful
- Keep articles focused on specific topics

## Maintenance
- Review and update articles regularly
- Remove outdated information
- Monitor article usage through analytics`,
    category: "content-creation",
    tags: ["writing", "best-practices", "content"],
    author: "Editor",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
    views: 0,
  },
  {
    id: "4",
    title: "Getting Started with React Hooks",
    content: `# Getting Started with React Hooks

React Hooks revolutionized how we write React components by allowing us to use state and other React features in functional components. This comprehensive guide covers everything you need to know about hooks.

## What are React Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 and have become the standard way to write React components.

## The useState Hook

The most commonly used hook is useState, which lets you add state to functional components:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## The useEffect Hook

useEffect lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined:

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## Custom Hooks

You can create your own hooks to reuse stateful logic between components:

\`\`\`javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}
\`\`\`

## Best Practices

1. Always call hooks at the top level of your React function
2. Only call hooks from React functions
3. Use the ESLint plugin for hooks to catch common mistakes
4. Keep effects focused and split them when necessary
5. Use custom hooks to extract component logic

React Hooks provide a more direct API to the React concepts you already know, making your code more readable and maintainable.`,
    category: "Development",
    tags: ["React", "JavaScript", "Hooks", "Frontend"],
    author: "Admin",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    views: 2847,
    featured: true,
  },
  {
    id: "5",
    title: "Database Optimization Strategies",
    content: `# Database Optimization Strategies

Database performance is crucial for any application's success. This guide covers essential optimization strategies that can dramatically improve your database performance.

## Understanding Database Performance

Database optimization involves improving query performance, reducing resource consumption, and ensuring scalability. The key areas to focus on include:

### 1. Query Optimization

Write efficient queries by:
- Using appropriate WHERE clauses
- Avoiding SELECT * statements
- Using JOINs instead of subqueries when possible
- Limiting result sets with LIMIT clauses

### 2. Indexing Strategies

Indexes are crucial for query performance:

\`\`\`sql
-- Create an index on frequently queried columns
CREATE INDEX idx_user_email ON users(email);

-- Composite index for multiple column queries
CREATE INDEX idx_order_date_status ON orders(order_date, status);
\`\`\`

### 3. Database Schema Design

Proper normalization and denormalization:
- Normalize to reduce redundancy
- Denormalize for read-heavy workloads
- Use appropriate data types
- Consider partitioning for large tables

### 4. Connection Pooling

Implement connection pooling to:
- Reduce connection overhead
- Limit concurrent connections
- Improve resource utilization

### 5. Caching Strategies

Implement caching at multiple levels:
- Query result caching
- Application-level caching
- Database-level caching
- CDN for static content

### 6. Monitoring and Analysis

Regular monitoring helps identify bottlenecks:
- Use EXPLAIN plans to analyze queries
- Monitor slow query logs
- Track database metrics
- Set up alerts for performance issues

## Performance Testing

Always test your optimizations:
- Use realistic data volumes
- Test under load conditions
- Measure before and after changes
- Consider different usage patterns

Remember, optimization is an iterative process. Start with the biggest bottlenecks and measure the impact of each change.`,
    category: "Database",
    tags: ["SQL", "Performance", "Optimization", "Indexing"],
    author: "Admin",
    createdAt: "2024-01-12T14:30:00Z",
    updatedAt: "2024-01-12T14:30:00Z",
    views: 1923,
  },
  {
    id: "6",
    title: "API Security Best Practices",
    content: `# API Security Best Practices

API security is paramount in today's interconnected world. This comprehensive guide covers essential security practices to protect your APIs from common threats.

## Authentication and Authorization

### JWT Tokens
JSON Web Tokens provide a secure way to transmit information:

\`\`\`javascript
const jwt = require('jsonwebtoken');

// Generate token
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
\`\`\`

### OAuth 2.0
Implement OAuth for third-party authentication:
- Use established providers (Google, GitHub, etc.)
- Implement proper scope management
- Secure token storage and refresh

## Input Validation and Sanitization

Always validate and sanitize input data:

\`\`\`javascript
const Joi = require('joi');

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  age: Joi.number().integer().min(18).max(120)
});

const { error, value } = schema.validate(req.body);
\`\`\`

## Rate Limiting

Implement rate limiting to prevent abuse:

\`\`\`javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
\`\`\`

## HTTPS and Security Headers

### Force HTTPS
Always use HTTPS in production:
- Obtain SSL certificates
- Redirect HTTP to HTTPS
- Use HSTS headers

### Security Headers
Implement essential security headers:

\`\`\`javascript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  next();
});
\`\`\`

## Error Handling

Never expose sensitive information in error messages:

\`\`\`javascript
app.use((err, req, res, next) => {
  // Log the full error for debugging
  console.error(err);
  
  // Send generic error message to client
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong'
  });
});
\`\`\`

## API Versioning

Implement proper API versioning:
- Use URL versioning (/api/v1/)
- Maintain backward compatibility
- Deprecate old versions gracefully

## Monitoring and Logging

Implement comprehensive logging:
- Log all API requests
- Monitor for suspicious activity
- Set up alerts for security events
- Regular security audits

Remember: Security is not a one-time implementation but an ongoing process. Stay updated with the latest security practices and regularly audit your APIs.`,
    category: "Security",
    tags: ["API", "Security", "Authentication", "JWT", "HTTPS"],
    author: "Admin",
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
    views: 3156,
    featured: true,
  },
  {
    id: "7",
    title: "Modern CSS Grid Layouts",
    content: `# Modern CSS Grid Layouts

CSS Grid is a powerful layout system that allows you to create complex, responsive layouts with ease. This guide covers everything from basic concepts to advanced techniques.

## Grid Fundamentals

CSS Grid introduces a two-dimensional layout system:

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}
\`\`\`

## Grid Template Areas

Named grid areas make layouts more readable:

\`\`\`css
.layout {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
\`\`\`

## Responsive Grid Layouts

Create responsive layouts without media queries:

\`\`\`css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
\`\`\`

## Advanced Grid Techniques

### Subgrid
Use subgrid for nested layouts:

\`\`\`css
.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.child {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: span 3;
}
\`\`\`

### Grid Auto-Placement
Let CSS Grid automatically place items:

\`\`\`css
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 200px;
  gap: 1rem;
}
\`\`\`

CSS Grid provides unprecedented control over layout design, making it easier than ever to create complex, responsive interfaces.`,
    category: "Design",
    tags: ["CSS", "Grid", "Layout", "Responsive"],
    author: "Admin",
    createdAt: "2024-01-18T16:45:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
    views: 1456,
  },
  {
    id: "8",
    title: "Node.js Performance Optimization",
    content: `# Node.js Performance Optimization

Node.js performance optimization is crucial for building scalable applications. This guide covers key strategies to improve your Node.js application performance.

## Event Loop Optimization

Understanding the event loop is key to Node.js performance:

\`\`\`javascript
// Avoid blocking the event loop
const fs = require('fs').promises;

// Good: Non-blocking
async function readFileAsync() {
  try {
    const data = await fs.readFile('large-file.txt', 'utf8');
    return data;
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

// Bad: Blocking
function readFileSync() {
  return fs.readFileSync('large-file.txt', 'utf8');
}
\`\`\`

## Memory Management

Proper memory management prevents memory leaks:

\`\`\`javascript
// Use streams for large data processing
const fs = require('fs');
const readline = require('readline');

async function processLargeFile() {
  const fileStream = fs.createReadStream('large-file.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    // Process line by line instead of loading entire file
    processLine(line);
  }
}
\`\`\`

## Clustering

Use clustering to utilize multiple CPU cores:

\`\`\`javascript
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(\`Worker \${worker.process.pid} died\`);
    cluster.fork();
  });
} else {
  // Worker process
  require('./app.js');
}
\`\`\`

## Caching Strategies

Implement effective caching:

\`\`\`javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

function getCachedData(key) {
  const cachedResult = cache.get(key);
  if (cachedResult) {
    return cachedResult;
  }

  const result = expensiveOperation();
  cache.set(key, result);
  return result;
}
\`\`\`

## Database Connection Pooling

Use connection pooling for database operations:

\`\`\`javascript
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'mydb',
  connectionLimit: 10,
  queueLimit: 0
});
\`\`\`

Performance optimization is an ongoing process. Profile your application regularly and optimize based on actual bottlenecks.`,
    category: "Development",
    tags: ["Node.js", "Performance", "Optimization", "Backend"],
    author: "Admin",
    createdAt: "2024-01-16T11:20:00Z",
    updatedAt: "2024-01-16T11:20:00Z",
    views: 2234,
  },
]

export const initialCategories: Category[] = [
  {
    id: "getting-started",
    name: "Getting Started",
    description: "Essential information for new users",
    color: "#3B82F6",
    articleCount: 1,
  },
  {
    id: "administration",
    name: "Administration",
    description: "System administration and management",
    color: "#EF4444",
    articleCount: 1,
  },
  {
    id: "content-creation",
    name: "Content Creation",
    description: "Guidelines for creating and managing content",
    color: "#10B981",
    articleCount: 1,
  },
  {
    id: "development",
    name: "Development",
    description: "Programming languages, frameworks, and development tools",
    color: "#8B5CF6",
    articleCount: 2,
  },
  {
    id: "database",
    name: "Database",
    description: "Database design, optimization, and management",
    color: "#10B981",
    articleCount: 1,
  },
  {
    id: "security",
    name: "Security",
    description: "Security best practices and implementation guides",
    color: "#EF4444",
    articleCount: 1,
  },
  {
    id: "design",
    name: "Design",
    description: "UI/UX design principles and CSS techniques",
    color: "#8B5CF6",
    articleCount: 1,
  },
  {
    id: "technical",
    name: "Technical",
    description: "Technical documentation and guides",
    color: "#F59E0B",
    articleCount: 0,
  },
  {
    id: "policies",
    name: "Policies",
    description: "Company policies and procedures",
    color: "#F59E0B",
    articleCount: 0,
  },
]
