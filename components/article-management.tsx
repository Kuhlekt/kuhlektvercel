'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react'
import type { Article, Category, User } from '@/types/knowledge-base'
import { formatDate, extractCleanText } from '@/utils/article-utils'

interface ArticleManagementProps {
  articles: Article[]
  categories: Category[]
  currentUser: User
  onArticlesChange: (articles: Article[]) => void
  onAuditLog: (action: string, details: string, targetId?: string) => void
}

export function ArticleManagement({ 
  articles, 
  categories, 
  currentUser, 
  onArticlesChange, 
  onAuditLog 
}: ArticleManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         extractCleanText(article.content).toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || article.categoryId === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleDeleteArticle = (articleId: string) => {
    const article = articles.find(a => a.id === articleId)
    if (article && window.confirm(`Are you sure you want to delete "${article.title}"?`)) {
      const updatedArticles = articles.filter(a => a.id !== articleId)
      onArticlesChange(updatedArticles)
      onAuditLog('delete_article', `Deleted article "${article.title}"`, articleId)
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || 'Unknown Category'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Article Management</h2>
          <p className="text-gray-600">Manage all articles in the knowledge base</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles ({filteredArticles.length})</CardTitle>
          <CardDescription>
            Search and filter articles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{article.title}</h3>
                        <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                          {article.status}
                        </Badge>
                        {article.featured && (
                          <Badge variant="outline">Featured</Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {article.excerpt || extractCleanText(article.content).substring(0, 150) + '...'}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>By {article.author}</span>
                        <span>•</span>
                        <span>{getCategoryName(article.categoryId)}</span>
                        <span>•</span>
                        <span>{formatDate(article.updatedAt)}</span>
                        <span>•</span>
                        <span>{article.viewCount} views</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteArticle(article.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
