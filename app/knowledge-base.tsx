'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Search, LogIn, User, FileText, BookOpen, Users, Eye, Plus, Edit, Trash2, ArrowLeft, Star, Clock, TrendingUp, Code, Database, Shield, Zap } from 'lucide-react'
import { Navigation } from '../components/navigation'
import { CategoryTree } from '../components/category-tree'
import { SearchResults } from '../components/search-results'
import { ArticleViewer } from '../components/article-viewer'
import { LoginModal } from '../components/login-modal'
import { AdminDashboard } from '../components/admin-dashboard'
import { getArticles, getCategories, getCurrentUser, setCurrentUser, initializeStorage } from '../utils/storage'
import { Article, Category, User } from '../types/knowledge-base'

// Types
interface Article {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  views: number
  lastUpdated: string
  readTime: number
  featured?: boolean
  author: string
  status: 'published' | 'draft'
}

interface User {
  id: string
  username: string
  password: string
  name: string
  role: 'admin' | 'editor'
}

// Initial data
const initialArticles: Article[] = [
  {
    id: '1',
    title: 'Getting Started with React Hooks',
    content: `React Hooks revolutionized how we write React components by allowing us to use state and other React features in functional components. This comprehensive guide covers everything you need to know about hooks.

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
    category: 'Development',
    tags: ['React', 'JavaScript', 'Hooks', 'Frontend'],
    views: 2847,
    lastUpdated: '2024-01-15',
    readTime: 8,
    featured: true,
    author: 'John Doe',
    status: 'published'
  },
  {
    id: '2',
    title: 'Database Optimization Strategies',
    content: `Database performance is crucial for any application's success. This guide covers essential optimization strategies that can dramatically improve your database performance.

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
    category: 'Database',
    tags: ['SQL', 'Performance', 'Optimization', 'Indexing'],
    views: 1923,
    lastUpdated: '2024-01-12',
    readTime: 12,
    author: 'Jane Smith',
    status: 'published'
  },
  {
    id: '3',
    title: 'API Security Best Practices',
    content: `API security is paramount in today's interconnected world. This comprehensive guide covers essential security practices to protect your APIs from common threats.

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
    category: 'Security',
    tags: ['API', 'Security', 'Authentication', 'JWT', 'HTTPS'],
    views: 3156,
    lastUpdated: '2024-01-20',
    readTime: 15,
    featured: true,
    author: 'Mike Johnson',
    status: 'published'
  }
]

const initialUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin'
  },
  {
    id: '2',
    username: 'editor',
    password: 'editor123',
    name: 'Content Editor',
    role: 'editor'
  }
]

const categoryIcons = {
  'Development': Code,
  'Database': Database,
  'Security': Shield,
  'Design': Zap
}

export default function KnowledgeBase() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [currentUser, setCurrentUserState] = useState<User | null>(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)

  useEffect(() => {
    initializeStorage()
    loadData()
    setCurrentUserState(getCurrentUser())
  }, [])

  const loadData = () => {
    setArticles(getArticles())
    setCategories(getCategories())
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === '' || article.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const getArticleCount = (categoryName: string) => {
    return articles.filter(article => article.category === categoryName).length
  }

  const handleLogin = (user: User) => {
    setCurrentUserState(user)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentUserState(null)
    setShowAdminDashboard(false)
  }

  const handleAdminClick = () => {
    if (currentUser) {
      setShowAdminDashboard(true)
    }
  }

  const handleBackToKnowledgeBase = () => {
    setShowAdminDashboard(false)
    loadData() // Refresh data when returning from admin
  }

  if (showAdminDashboard && currentUser) {
    return (
      <div>
        <AdminDashboard 
          currentUser={currentUser} 
          onLogout={handleLogout}
        />
        <div className="fixed bottom-4 right-4">
          <button
            onClick={handleBackToKnowledgeBase}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
          >
            Back to Knowledge Base
          </button>
        </div>
      </div>
    )
  }

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navigation
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          currentUser={currentUser}
          onLoginClick={() => setIsLoginModalOpen(true)}
          onAdminClick={handleAdminClick}
        />
        <div className="container mx-auto px-6 py-8">
          <ArticleViewer
            article={selectedArticle}
            onBack={() => setSelectedArticle(null)}
          />
        </div>
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentUser={currentUser}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onAdminClick={handleAdminClick}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border-0 sticky top-24">
              <CategoryTree
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
                getArticleCount={getArticleCount}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <SearchResults
              articles={filteredArticles}
              searchTerm={searchTerm}
              onArticleSelect={setSelectedArticle}
            />
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  )
}
