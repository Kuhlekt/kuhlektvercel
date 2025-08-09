'use client'

import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Article } from '../types/knowledge-base'
import { FileText, Calendar, User } from 'lucide-react'

interface SearchResultsProps {
  articles: Article[]
  searchTerm: string
  onArticleSelect: (article: Article) => void
}

export function SearchResults({ articles, searchTerm, onArticleSelect }: SearchResultsProps) {
  const highlightText = (text: string, term: string) => {
    if (!term) return text
    
    const regex = new RegExp(`(${term})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
        <p className="text-gray-600">
          {searchTerm 
            ? `No articles match "${searchTerm}". Try different keywords.`
            : 'No articles available in this category.'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Found {articles.length} article{articles.length !== 1 ? 's' : ''}
        {searchTerm && ` for "${searchTerm}"`}
      </div>
      
      {articles.map(article => (
        <Card 
          key={article.id} 
          className="hover:shadow-md transition-shadow cursor-pointer bg-white/70 backdrop-blur-sm border-0"
          onClick={() => onArticleSelect(article)}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                {highlightText(article.title, searchTerm)}
              </h3>
              <Badge variant="secondary">{article.category}</Badge>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-3">
              {highlightText(
                article.content.substring(0, 200) + (article.content.length > 200 ? '...' : ''),
                searchTerm
              )}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            {article.tags.length > 0 && (
              <div className="flex gap-1 mt-3 flex-wrap">
                {article.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {article.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{article.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
