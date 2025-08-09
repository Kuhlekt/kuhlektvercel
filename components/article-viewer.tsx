'use client'

import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Article } from '../types/knowledge-base'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'

interface ArticleViewerProps {
  article: Article
  onBack: () => void
}

export function ArticleViewer({ article, onBack }: ArticleViewerProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Articles
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
        
        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
          </div>
          <Badge variant="secondary">{article.category}</Badge>
        </div>
        
        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <Tag className="h-4 w-4 text-gray-500" />
            <div className="flex gap-1 flex-wrap">
              {article.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div className="whitespace-pre-wrap leading-relaxed">
          {article.content}
        </div>
      </div>
    </div>
  )
}
