-- Insert default categories
INSERT INTO categories (id, name, description, is_active, created_at, updated_at) VALUES
('1', 'Getting Started', 'Basic information and setup guides', true, NOW(), NOW()),
('2', 'Documentation', 'Technical documentation and guides', true, NOW(), NOW()),
('3', 'FAQ', 'Frequently asked questions', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert default users
INSERT INTO users (id, username, password, email, role, is_active, created_at) VALUES
('1', 'admin', 'admin123', 'admin@kuhlekt.com', 'admin', true, NOW()),
('2', 'editor', 'editor123', 'editor@kuhlekt.com', 'editor', true, NOW()),
('3', 'viewer', 'viewer123', 'viewer@kuhlekt.com', 'viewer', true, NOW())
ON CONFLICT (username) DO NOTHING;

-- Insert default articles
INSERT INTO articles (id, title, content, category_id, author, tags, is_published, views, created_at, updated_at) VALUES
('1', 'Welcome to the Knowledge Base', 
'# Welcome to the Knowledge Base

This is your comprehensive knowledge management system. Here you can find articles, guides, and documentation organized by categories.

## Features

- 📚 Browse articles by category
- 🔍 Search through content
- 👥 User management with different roles
- 📝 Create and edit articles
- 📊 Admin dashboard with analytics

## Getting Started

1. **Browse Articles**: Use the category tree on the left to navigate
2. **Search**: Use the search bar to find specific content
3. **Login**: Click the login button to access editing features
4. **Admin Panel**: Admins can manage users and view analytics

## Demo Accounts

- **admin** / admin123 - Full administrative access
- **editor** / editor123 - Can create and edit articles
- **viewer** / viewer123 - Read-only access

Enjoy exploring the knowledge base!', 
'1', 'System', ARRAY['welcome', 'introduction', 'getting-started'], true, 0, NOW(), NOW()),

('2', 'How to Search Articles',
'# How to Search Articles

The knowledge base provides powerful search functionality to help you find the information you need quickly.

## Search Methods

### 1. Quick Search
Use the search bar at the top of the page to search across all articles:
- Search by **title**
- Search by **content**
- Search by **tags**

### 2. Category Browsing
Navigate using the category tree on the left sidebar:
- Click on categories to filter articles
- Expand subcategories for more specific content
- View article counts for each category

### 3. Advanced Filtering
- Filter by author
- Sort by date created or updated
- Filter by tags

## Search Tips

- Use specific keywords for better results
- Try different variations of your search terms
- Use tags to find related content
- Browse categories if you''re not sure what to search for

Happy searching! 🔍',
'2', 'System', ARRAY['search', 'navigation', 'help'], true, 0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert initial audit log entry
INSERT INTO audit_log (id, action, performed_by, timestamp, details) VALUES
('1', 'system_init', 'System', NOW(), 'Knowledge base initialized with default data')
ON CONFLICT (id) DO NOTHING;
