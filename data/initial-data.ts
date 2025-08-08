import type { Article, Category } from '@/types/knowledge-base'

const sampleArticles: Article[] = [
  {
    id: '1',
    title: 'Getting Started with React Hooks',
    content: `<h2>Introduction to React Hooks</h2>
    <p>React Hooks are a powerful feature that allows you to use state and other React features without writing a class component. They were introduced in React 16.8 and have revolutionized how we write React applications.</p>
    
    <h3>What are Hooks?</h3>
    <p>Hooks are functions that let you "hook into" React state and lifecycle features from function components. They allow you to reuse stateful logic between components without changing your component hierarchy.</p>
    
    <h3>Basic Hooks</h3>
    <ul>
      <li><strong>useState</strong> - Manages local state in functional components</li>
      <li><strong>useEffect</strong> - Performs side effects in functional components</li>
      <li><strong>useContext</strong> - Consumes context values</li>
    </ul>
    
    <h3>Example: useState Hook</h3>
    <pre><code>
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
    </code></pre>
    
    <p>This example shows how to use the useState hook to manage a simple counter state.</p>`,
    excerpt: 'Learn the fundamentals of React Hooks and how they can simplify your React components.',
    author: 'John Doe',
    categoryId: '1',
    tags: ['React', 'JavaScript', 'Frontend', 'Hooks'],
    status: 'published',
    featured: true,
    viewCount: 1250,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    content: `<h2>Advanced TypeScript Patterns</h2>
    <p>TypeScript offers powerful type system features that can help you write more robust and maintainable code. This article explores some advanced patterns and techniques.</p>
    
    <h3>Generic Types</h3>
    <p>Generics allow you to create reusable components that work with multiple types while maintaining type safety.</p>
    
    <pre><code>
    function identity<T>(arg: T): T {
      return arg;
    }
    
    let output = identity<string>("myString");
    </code></pre>
    
    <h3>Conditional Types</h3>
    <p>Conditional types help you create types that depend on a condition, making your type definitions more flexible.</p>
    
    <pre><code>
    type ApiResponse<T> = T extends string 
      ? { message: T } 
      : { data: T };
    </code></pre>
    
    <h3>Mapped Types</h3>
    <p>Mapped types allow you to create new types by transforming properties of existing types.</p>
    
    <pre><code>
    type Readonly<T> = {
      readonly [P in keyof T]: T[P];
    };
    </code></pre>`,
    excerpt: 'Explore advanced TypeScript patterns including generics, conditional types, and mapped types.',
    author: 'Jane Smith',
    categoryId: '1',
    tags: ['TypeScript', 'JavaScript', 'Types', 'Advanced'],
    status: 'published',
    featured: false,
    viewCount: 890,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    title: 'Building RESTful APIs with Node.js',
    content: `<h2>Building RESTful APIs with Node.js</h2>
    <p>REST (Representational State Transfer) is an architectural style for designing networked applications. This guide will show you how to build RESTful APIs using Node.js and Express.</p>
    
    <h3>Setting Up Express</h3>
    <p>First, let's set up a basic Express server:</p>
    
    <pre><code>
    const express = require('express');
    const app = express();
    const port = 3000;
    
    app.use(express.json());
    
    app.listen(port, () => {
      console.log(\`Server running at http://localhost:\${port}\`);
    });
    </code></pre>
    
    <h3>Creating Routes</h3>
    <p>RESTful APIs use HTTP methods to perform different operations:</p>
    
    <ul>
      <li><strong>GET</strong> - Retrieve data</li>
      <li><strong>POST</strong> - Create new data</li>
      <li><strong>PUT</strong> - Update existing data</li>
      <li><strong>DELETE</strong> - Remove data</li>
    </ul>
    
    <h3>Example Routes</h3>
    <pre><code>
    // GET all users
    app.get('/api/users', (req, res) => {
      res.json(users);
    });
    
    // POST new user
    app.post('/api/users', (req, res) => {
      const newUser = req.body;
      users.push(newUser);
      res.status(201).json(newUser);
    });
    </code></pre>`,
    excerpt: 'Learn how to create RESTful APIs using Node.js and Express with practical examples.',
    author: 'Mike Johnson',
    categoryId: '2',
    tags: ['Node.js', 'Express', 'API', 'Backend', 'REST'],
    status: 'published',
    featured: true,
    viewCount: 2100,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '4',
    title: 'Database Design Best Practices',
    content: `<h2>Database Design Best Practices</h2>
    <p>Good database design is crucial for building scalable and maintainable applications. This article covers essential principles and best practices for designing relational databases.</p>
    
    <h3>Normalization</h3>
    <p>Database normalization is the process of organizing data to reduce redundancy and improve data integrity.</p>
    
    <h4>First Normal Form (1NF)</h4>
    <ul>
      <li>Each column contains atomic values</li>
      <li>No repeating groups</li>
      <li>Each row is unique</li>
    </ul>
    
    <h4>Second Normal Form (2NF)</h4>
    <ul>
      <li>Must be in 1NF</li>
      <li>No partial dependencies on composite primary keys</li>
    </ul>
    
    <h4>Third Normal Form (3NF)</h4>
    <ul>
      <li>Must be in 2NF</li>
      <li>No transitive dependencies</li>
    </ul>
    
    <h3>Indexing Strategies</h3>
    <p>Proper indexing can significantly improve query performance:</p>
    
    <ul>
      <li>Create indexes on frequently queried columns</li>
      <li>Use composite indexes for multi-column queries</li>
      <li>Avoid over-indexing as it can slow down writes</li>
    </ul>
    
    <h3>Relationships</h3>
    <p>Understanding and properly implementing relationships is key:</p>
    
    <ul>
      <li><strong>One-to-One</strong> - Each record relates to exactly one record in another table</li>
      <li><strong>One-to-Many</strong> - One record can relate to multiple records in another table</li>
      <li><strong>Many-to-Many</strong> - Multiple records can relate to multiple records (requires junction table)</li>
    </ul>`,
    excerpt: 'Essential principles and best practices for designing efficient and scalable relational databases.',
    author: 'Sarah Wilson',
    categoryId: '2',
    tags: ['Database', 'SQL', 'Design', 'Normalization', 'Performance'],
    status: 'published',
    featured: false,
    viewCount: 1680,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: '5',
    title: 'CSS Grid Layout Guide',
    content: `<h2>CSS Grid Layout Guide</h2>
    <p>CSS Grid Layout is a powerful two-dimensional layout system that allows you to create complex layouts with ease. This comprehensive guide covers everything you need to know about CSS Grid.</p>
    
    <h3>Basic Grid Setup</h3>
    <p>To create a grid container, use the display: grid property:</p>
    
    <pre><code>
    .container {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: auto;
      gap: 20px;
    }
    </code></pre>
    
    <h3>Grid Template Areas</h3>
    <p>You can define named grid areas for more semantic layouts:</p>
    
    <pre><code>
    .container {
      display: grid;
      grid-template-areas: 
        "header header header"
        "sidebar main main"
        "footer footer footer";
    }
    
    .header { grid-area: header; }
    .sidebar { grid-area: sidebar; }
    .main { grid-area: main; }
    .footer { grid-area: footer; }
    </code></pre>
    
    <h3>Responsive Grids</h3>
    <p>Create responsive layouts using auto-fit and minmax:</p>
    
    <pre><code>
    .container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    </code></pre>
    
    <h3>Grid Item Placement</h3>
    <p>Control where items are placed in the grid:</p>
    
    <pre><code>
    .item {
      grid-column: 1 / 3;
      grid-row: 2 / 4;
    }
    </code></pre>`,
    excerpt: 'Master CSS Grid Layout with this comprehensive guide covering basic concepts to advanced techniques.',
    author: 'Alex Chen',
    categoryId: '3',
    tags: ['CSS', 'Grid', 'Layout', 'Responsive', 'Frontend'],
    status: 'published',
    featured: true,
    viewCount: 1420,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-25')
  }
]

const sampleCategories: Category[] = [
  {
    id: '1',
    name: 'Frontend Development',
    description: 'Articles about frontend technologies and frameworks',
    articles: [],
    subcategories: [
      {
        id: '1-1',
        name: 'React',
        description: 'React framework and ecosystem',
        articles: []
      },
      {
        id: '1-2',
        name: 'Vue.js',
        description: 'Vue.js framework and tools',
        articles: []
      }
    ]
  },
  {
    id: '2',
    name: 'Backend Development',
    description: 'Server-side development and databases',
    articles: [],
    subcategories: [
      {
        id: '2-1',
        name: 'Node.js',
        description: 'Node.js runtime and frameworks',
        articles: []
      },
      {
        id: '2-2',
        name: 'Databases',
        description: 'Database design and management',
        articles: []
      }
    ]
  },
  {
    id: '3',
    name: 'Web Design',
    description: 'UI/UX design and CSS techniques',
    articles: [],
    subcategories: [
      {
        id: '3-1',
        name: 'CSS',
        description: 'CSS techniques and frameworks',
        articles: []
      },
      {
        id: '3-2',
        name: 'UI/UX',
        description: 'User interface and experience design',
        articles: []
      }
    ]
  }
]

export const initialData = {
  articles: sampleArticles,
  categories: sampleCategories
}

// Export individual arrays for backward compatibility
export const articles = sampleArticles
export const categories = sampleCategories
