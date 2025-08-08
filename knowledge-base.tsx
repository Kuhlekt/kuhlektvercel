'use client'

import React, { useState, useMemo } from 'react'
import { Search, BookOpen, Clock, Eye, Tag, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Types
interface Article {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  readTime: number
  views: number
  featured: boolean
  lastUpdated: string
}

interface Category {
  name: string
  count: number
  color: string
}

// Sample data
const articles: Article[] = [
  {
    id: '1',
    title: 'Getting Started with React Hooks',
    content: `React Hooks revolutionized how we write React components by allowing us to use state and other React features in functional components.

## What are React Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components. They don't work inside classes — they let you use React without classes.

## Basic Hooks

### useState
The useState hook lets you add state to functional components:

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

### useEffect
The useEffect hook lets you perform side effects in function components:

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

## Best Practices

1. **Only call hooks at the top level** - Don't call hooks inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - Call them from React function components or custom hooks
3. **Use the ESLint plugin** - Install eslint-plugin-react-hooks to catch common mistakes

## Custom Hooks

You can create your own hooks to reuse stateful logic:

\`\`\`javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}
\`\`\`

React Hooks provide a more direct API to the React concepts you already know, making your code more readable and maintainable.`,
    category: 'Development',
    tags: ['React', 'JavaScript', 'Frontend'],
    readTime: 8,
    views: 1247,
    featured: true,
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    title: 'Database Optimization Techniques',
    content: `Database optimization is crucial for application performance. Here are key techniques to improve your database performance.

## Indexing Strategies

### Primary Indexes
Every table should have a primary key with an associated index:

\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Composite Indexes
For queries that filter on multiple columns:

\`\`\`sql
CREATE INDEX idx_user_status_created 
ON users (status, created_at);
\`\`\`

## Query Optimization

### Use EXPLAIN
Always analyze your query execution plans:

\`\`\`sql
EXPLAIN ANALYZE 
SELECT * FROM users 
WHERE status = 'active' 
AND created_at > '2024-01-01';
\`\`\`

### Avoid SELECT *
Only select the columns you need:

\`\`\`sql
-- Bad
SELECT * FROM users WHERE id = 1;

-- Good
SELECT id, email, name FROM users WHERE id = 1;
\`\`\`

## Connection Pooling

Use connection pooling to manage database connections efficiently:

\`\`\`javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'username',
  host: 'localhost',
  database: 'mydb',
  password: 'password',
  port: 5432,
  max: 20, // maximum number of connections
  idleTimeoutMillis: 30000,
});
\`\`\`

## Caching Strategies

1. **Query Result Caching** - Cache frequently accessed query results
2. **Application-Level Caching** - Use Redis or Memcached
3. **Database-Level Caching** - Configure your database's built-in caching

## Monitoring and Maintenance

- Monitor slow queries regularly
- Update table statistics
- Rebuild indexes periodically
- Archive old data

These optimization techniques can significantly improve your database performance and application responsiveness.`,
    category: 'Database',
    tags: ['SQL', 'Performance', 'Optimization'],
    readTime: 12,
    views: 892,
    featured: false,
    lastUpdated: '2024-01-10'
  },
  {
    id: '3',
    title: 'API Security Best Practices',
    content: `API security is critical for protecting your applications and user data. Here are essential security practices every developer should implement.

## Authentication and Authorization

### JWT Tokens
Use JSON Web Tokens for stateless authentication:

\`\`\`javascript
const jwt = require('jsonwebtoken');

// Generate token
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
\`\`\`

### OAuth 2.0
Implement OAuth for third-party authentication:

\`\`\`javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  // Handle user authentication
  return done(null, profile);
}));
\`\`\`

## Input Validation

### Sanitize Input
Always validate and sanitize user input:

\`\`\`javascript
const validator = require('validator');
const xss = require('xss');

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const sanitizeInput = (input) => {
  return xss(input.trim());
};
\`\`\`

### Use Schema Validation
Implement schema validation with libraries like Joi:

\`\`\`javascript
const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(2).max(50).required()
});

const { error, value } = userSchema.validate(req.body);
if (error) {
  return res.status(400).json({ error: error.details[0].message });
}
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

\`\`\`javascript
const helmet = require('helmet');

app.use(helmet({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
\`\`\`

### CORS Configuration
Configure CORS properly:

\`\`\`javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
\`\`\`

## Error Handling

Never expose sensitive information in error messages:

\`\`\`javascript
app.use((error, req, res, next) => {
  console.error(error.stack);
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({
    error: isDevelopment ? error.message : 'Internal server error',
    ...(isDevelopment && { stack: error.stack })
  });
});
\`\`\`

## Security Checklist

- ✅ Use HTTPS everywhere
- ✅ Implement proper authentication
- ✅ Validate all input
- ✅ Use rate limiting
- ✅ Set security headers
- ✅ Keep dependencies updated
- ✅ Log security events
- ✅ Regular security audits

Following these practices will significantly improve your API security posture.`,
    category: 'Security',
    tags: ['API', 'Security', 'Authentication'],
    readTime: 15,
    views: 1156,
    featured: true,
    lastUpdated: '2024-01-12'
  },
  {
    id: '4',
    title: 'Modern CSS Grid Layout',
    content: `CSS Grid Layout is a powerful tool for creating complex, responsive layouts with ease. Let's explore its capabilities and best practices.

## Grid Basics

### Creating a Grid Container
Start by defining a grid container:

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}
\`\`\`

### Grid Items
Grid items are automatically placed:

\`\`\`css
.grid-item {
  background: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
}
\`\`\`

## Advanced Grid Techniques

### Named Grid Lines
Use named lines for better readability:

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 
    [sidebar-start] 250px 
    [sidebar-end main-start] 1fr 
    [main-end];
  grid-template-rows: 
    [header-start] 60px 
    [header-end content-start] 1fr 
    [content-end];
}

.header {
  grid-column: sidebar-start / main-end;
  grid-row: header-start / header-end;
}

.sidebar {
  grid-column: sidebar-start / sidebar-end;
  grid-row: content-start / content-end;
}

.main {
  grid-column: main-start / main-end;
  grid-row: content-start / content-end;
}
\`\`\`

### Grid Areas
Define layout areas for semantic layouts:

\`\`\`css
.page-layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
\`\`\`

## Responsive Grid Layouts

### Auto-Fit and Auto-Fill
Create responsive grids without media queries:

\`\`\`css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
\`\`\`

### Media Query Enhancements
Combine with media queries for fine control:

\`\`\`css
.adaptive-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .adaptive-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .adaptive-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
\`\`\`

## Grid vs Flexbox

### When to Use Grid
- Two-dimensional layouts
- Complex overlapping designs
- When you need precise control over both rows and columns

### When to Use Flexbox
- One-dimensional layouts
- Component-level layouts
- When you need items to grow/shrink dynamically

## Practical Examples

### Card Layout
\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 24px;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-4px);
}
\`\`\`

### Dashboard Layout
\`\`\`css
.dashboard {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main widgets"
    "sidebar main widgets";
  grid-template-columns: 250px 1fr 300px;
  grid-template-rows: 60px 1fr;
  height: 100vh;
  gap: 16px;
  padding: 16px;
}
\`\`\`

## Browser Support and Fallbacks

CSS Grid has excellent modern browser support. For older browsers, provide fallbacks:

\`\`\`css
.grid-fallback {
  /* Flexbox fallback */
  display: flex;
  flex-wrap: wrap;
}

.grid-fallback > * {
  flex: 1 1 300px;
  margin: 10px;
}

/* Grid enhancement */
@supports (display: grid) {
  .grid-fallback {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .grid-fallback > * {
    margin: 0;
  }
}
\`\`\`

CSS Grid Layout provides unprecedented control over web layouts, making complex designs simple and maintainable.`,
    category: 'Design',
    tags: ['CSS', 'Layout', 'Responsive'],
    readTime: 10,
    views: 743,
    featured: false,
    lastUpdated: '2024-01-08'
  },
  {
    id: '5',
    title: 'TypeScript Advanced Types',
    content: `TypeScript's advanced type system enables powerful type safety and developer experience improvements. Let's explore advanced patterns and techniques.

## Utility Types

### Built-in Utility Types
TypeScript provides many useful utility types:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Partial - makes all properties optional
type PartialUser = Partial<User>;

// Pick - select specific properties
type UserProfile = Pick<User, 'id' | 'name' | 'email'>;

// Omit - exclude specific properties
type CreateUser = Omit<User, 'id'>;

// Required - makes all properties required
type RequiredUser = Required<PartialUser>;
\`\`\`

### Custom Utility Types
Create your own utility types:

\`\`\`typescript
// Make specific properties optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type UserWithOptionalEmail = PartialBy<User, 'email'>;

// Deep readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
\`\`\`

## Conditional Types

### Basic Conditional Types
Types that depend on conditions:

\`\`\`typescript
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false

// More practical example
type ApiResponse<T> = T extends string 
  ? { message: T } 
  : { data: T };

type StringResponse = ApiResponse<string>; // { message: string }
type DataResponse = ApiResponse<User>; // { data: User }
\`\`\`

### Distributive Conditional Types
Conditional types distribute over union types:

\`\`\`typescript
type ToArray<T> = T extends any ? T[] : never;

type StringOrNumberArray = ToArray<string | number>; // string[] | number[]

// Non-distributive version
type ToArrayNonDistributive<T> = [T] extends [any] ? T[] : never;

type Combined = ToArrayNonDistributive<string | number>; // (string | number)[]
\`\`\`

## Mapped Types

### Basic Mapped Types
Transform existing types:

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};

// With key remapping
type Getters<T> = {
  [P in keyof T as \`get\${Capitalize<string & P>}\`]: () => T[P];
};

type UserGetters = Getters<User>;
// {
//   getId: () => number;
//   getName: () => string;
//   getEmail: () => string;
//   getPassword: () => string;
// }
\`\`\`

### Template Literal Types
Create types from string patterns:

\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`;

type UserEvents = EventName<'click' | 'hover' | 'focus'>;
// 'onClick' | 'onHover' | 'onFocus'

// More complex patterns
type CSSProperty = 'margin' | 'padding';
type CSSDirection = 'top' | 'right' | 'bottom' | 'left';

type CSSProperties = \`\${CSSProperty}-\${CSSDirection}\`;
// 'margin-top' | 'margin-right' | 'margin-bottom' | 'margin-left' | 
// 'padding-top' | 'padding-right' | 'padding-bottom' | 'padding-left'
\`\`\`

## Advanced Patterns

### Function Overloads
Define multiple function signatures:

\`\`\`typescript
function createElement(tag: 'div'): HTMLDivElement;
function createElement(tag: 'span'): HTMLSpanElement;
function createElement(tag: 'input'): HTMLInputElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

const div = createElement('div'); // HTMLDivElement
const span = createElement('span'); // HTMLSpanElement
\`\`\`

### Branded Types
Create distinct types from primitives:

\`\`\`typescript
type Brand<T, B> = T & { __brand: B };

type UserId = Brand<number, 'UserId'>;
type ProductId = Brand<number, 'ProductId'>;

const createUserId = (id: number): UserId => id as UserId;
const createProductId = (id: number): ProductId => id as ProductId;

const userId = createUserId(123);
const productId = createProductId(456);

// This would cause a type error:
// const invalid: UserId = productId;
\`\`\`

### Recursive Types
Types that reference themselves:

\`\`\`typescript
type JSONValue = 
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

interface TreeNode<T> {
  value: T;
  children: TreeNode<T>[];
}

// Recursive utility type
type Paths<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | \`\${K}.\${Paths<T[K]>}\`
          : K
        : never;
    }[keyof T]
  : never;

type UserPaths = Paths<User>; // 'id' | 'name' | 'email' | 'password'
\`\`\`

## Type Guards and Assertions

### Custom Type Guards
Runtime type checking:

\`\`\`typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'email' in obj
  );
}

// Usage
function processValue(value: unknown) {
  if (isString(value)) {
    // value is now typed as string
    console.log(value.toUpperCase());
  }
  
  if (isUser(value)) {
    // value is now typed as User
    console.log(value.name);
  }
}
\`\`\`

### Assertion Functions
Functions that assert types:

\`\`\`typescript
function assertIsNumber(value: unknown): asserts value is number {
  if (typeof value !== 'number') {
    throw new Error('Expected number');
  }
}

function processNumber(value: unknown) {
  assertIsNumber(value);
  // value is now typed as number
  return value * 2;
}
\`\`\`

## Best Practices

1. **Use strict mode** - Enable strict TypeScript settings
2. **Prefer type over interface** for unions and computed types
3. **Use const assertions** for immutable data
4. **Leverage utility types** instead of manual type manipulation
5. **Document complex types** with comments
6. **Use branded types** for domain-specific primitives

TypeScript's advanced type system enables building robust, maintainable applications with excellent developer experience and compile-time safety.`,
    category: 'Development',
    tags: ['TypeScript', 'Types', 'Advanced'],
    readTime: 18,
    views: 654,
    featured: false,
    lastUpdated: '2024-01-05'
  }
]

const categories: Category[] = [
  { name: 'All', count: articles.length, color: 'bg-gray-500' },
  { name: 'Development', count: articles.filter(a => a.category === 'Development').length, color: 'bg-blue-500' },
  { name: 'Database', count: articles.filter(a => a.category === 'Database').length, color: 'bg-green-500' },
  { name: 'Security', count: articles.filter(a => a.category === 'Security').length, color: 'bg-red-500' },
  { name: 'Design', count: articles.filter(a => a.category === 'Design').length, color: 'bg-purple-500' }
]

export default function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [articleViews, setArticleViews] = useState<Record<string, number>>(
    articles.reduce((acc, article) => ({ ...acc, [article.id]: article.views }), {})
  )

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article)
    setArticleViews(prev => ({
      ...prev,
      [article.id]: prev[article.id] + 1
    }))
  }

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-4 text-gray-800">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-4 mb-3 text-gray-700">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(.+)$/gm, '<p class="mb-4">$1</p>')
  }

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="gradient-bg text-white p-6">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedArticle(null)}
              className="text-white hover:bg-white/20 mb-4"
            >
              ← Back to Knowledge Base
            </Button>
            <h1 className="text-4xl font-bold mb-4">{selectedArticle.title}</h1>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{selectedArticle.readTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{articleViews[selectedArticle.id]} views</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {selectedArticle.category}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: formatContent(selectedArticle.content) }}
            />
            
            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-wrap gap-2">
                {selectedArticle.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="gradient-bg text-white">
        <div className="glass-effect">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Kuhlekt Knowledge Base</h1>
            </div>
            
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/90 backdrop-blur-sm border-white/20"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === category.name
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${category.color}`} />
                      {category.name}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {category.name === 'All' ? articles.length : category.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedCategory === 'All' ? 'All Articles' : selectedCategory}
              </h2>
              <p className="text-gray-600">
                {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="grid gap-6">
              {filteredArticles.map(article => (
                <Card 
                  key={article.id} 
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-white/20"
                  onClick={() => handleArticleClick(article)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{article.category}</Badge>
                          {article.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </CardTitle>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-4 line-clamp-3">
                      {article.content.substring(0, 200)}...
                    </CardDescription>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{article.readTime} min read</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{articleViews[article.id]} views</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
                <p className="text-gray-500">Try adjusting your search terms or category filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
