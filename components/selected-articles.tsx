'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Calendar, User, Clock } from 'lucide-react'
import type { Article, Category } from '@/types/knowledge-base'
import { formatDate, extractCleanText, getArticleReadTime } from '@/utils/article-utils'

interface SelectedArticlesProps {
  articles: Article[]
  categories: Category[]
  selectedCategoryId: string
  onArticleSelect: (article: Article) => void
}

export function SelectedArticles({ 
  articles, 
  categories, 
  selectedCategoryId,
  onArticleSelect
}: SelectedArticlesProps) {
  const category = categories.find(c => c.id === selectedCategoryId)
  const categoryName = category?.name || 'Unknown Category'

  // Ensure articles is always an array
  const safeArticles = Array.isArray(articles) ? articles : []

  if (safeArticles.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No articles found</h3>
          <p className="text-gray-500">
            There are no articles in the "{categoryName}" category yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{categoryName}</h2>
        <p className="text-gray-600">
          {safeArticles.length} article{safeArticles.length !== 1 ? 's' : ''} in this category
        </p>
      </div>

      <div className="grid gap-6">
        {safeArticles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2 hover:text-blue-600 cursor-pointer">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-base line-clamp-3">
                    {article.excerpt || extractCleanText(article.content).substring(0, 200) + '...'}
                  </CardDescription>
                </div>
                {article.featured && (
                  <Badge variant="default" className="ml-4">
                    Featured
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.updatedAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{article.viewCount} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{getArticleReadTime(article.content)} min read</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {article.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {article.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{article.tags.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <Button onClick={() => onArticleSelect(article)}>
                  Read Article
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
