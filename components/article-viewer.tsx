'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, User, Eye, Calendar } from 'lucide-react'
import type { Category, Article } from '@/types/knowledge-base'
import { extractCleanText, formatDate, getArticleReadTime } from '@/utils/article-utils'

interface ArticleViewerProps {
  article: Article
  categories: Category[]
  onBack: () => void
}

export function ArticleViewer({ article, categories, onBack }: ArticleViewerProps) {
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || 'Unknown Category'
  }

  const getSubcategoryName = (categoryId: string, subcategoryId?: string) => {
    if (!subcategoryId) return null
    const category = categories.find(c => c.id === categoryId)
    const subcategory = category?.subcategories.find(s => s.id === subcategoryId)
    return subcategory?.name || null
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Articles
      </Button>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <CardTitle className="text-3xl font-bold leading-tight">
              {article.title}
            </CardTitle>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>By {article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Updated {formatDate(article.updatedAt)}</span>
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

            <div className="flex flex-wrap gap-2">
              {article.featured && (
                <Badge variant="default">
                  Featured
                </Badge>
              )}
              <Badge variant="outline">
                {getCategoryName(article.categoryId)}
              </Badge>
              {article.subcategoryId && (
                <Badge variant="outline" className="text-xs">
                  {getSubcategoryName(article.categoryId, article.subcategoryId)}
                </Badge>
              )}
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base">
              {extractCleanText(article.content)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
