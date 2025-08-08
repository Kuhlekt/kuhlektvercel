'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, User, Eye, Search } from 'lucide-react'
import type { Category, Article } from '@/types/knowledge-base'
import { extractCleanText, highlightSearchTerm, formatDate, getArticleReadTime } from '@/utils/article-utils'

interface SearchResultsProps {
  articles: Article[]
  categories: Category[]
  searchQuery: string
  onArticleSelect: (article: Article) => void
}

export function SearchResults({ articles, categories, searchQuery, onArticleSelect }: SearchResultsProps) {
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || 'Unknown Category'
  }

  const getPreview = (content: string) => {
    const cleanText = extractCleanText(content)
    return cleanText.length > 200 ? cleanText.substring(0, 200) + '...' : cleanText
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Results
          </CardTitle>
          <p className="text-gray-600">
            Found {articles.length} article{articles.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </p>
        </CardHeader>
      </Card>

      {articles.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No articles found</h3>
            <p className="text-gray-500">
              No articles found matching your search. Try different keywords or browse categories.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <Card 
              key={article.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onArticleSelect(article)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2"
                      dangerouslySetInnerHTML={{ __html: highlightSearchTerm(article.title, searchQuery) }}
                    />
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(article.updatedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{article.viewCount} views</span>
                      </div>
                    </div>
                  </div>
                  {article.featured && (
                    <Badge variant="default" className="ml-4">
                      Featured
                    </Badge>
                  )}
                </div>

                <p 
                  className="text-gray-700 mb-4 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightSearchTerm(
                      article.excerpt || getPreview(article.content), 
                      searchQuery
                    ) 
                  }}
                />

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {getCategoryName(article.categoryId)}
                    </Badge>
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <span dangerouslySetInnerHTML={{ __html: highlightSearchTerm(tag, searchQuery) }} />
                      </Badge>
                    ))}
                    {article.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {getArticleReadTime(article.content)} min read
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
