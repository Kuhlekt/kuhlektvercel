"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, X, FileText, Calendar, User } from "lucide-react"
import type { Article } from "../types/knowledge-base"

interface SelectedArticlesProps {
  articles: Article[]
  onArticleSelect: (article: Article) => void
  onRemoveFromSelected: (articleId: string) => void
  onBack: () => void
}

export function SelectedArticles({
  articles = [],
  onArticleSelect,
  onRemoveFromSelected,
  onBack,
}: SelectedArticlesProps) {
  const safeArticles = Array.isArray(articles) ? articles : []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Browse</span>
        </Button>

        <div className="flex items-center space-x-2">
          <Star className="h-6 w-6 text-amber-500 fill-current" />
          <h2 className="text-2xl font-bold">Selected Articles</h2>
          <Badge variant="outline">{safeArticles.length} articles</Badge>
        </div>
      </div>

      {/* Articles List */}
      {safeArticles.length > 0 ? (
        <div className="grid gap-4">
          {safeArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 cursor-pointer" onClick={() => onArticleSelect(article)}>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold hover:text-blue-600 transition-colors">{article.title}</h3>
                      {!article.isPublished && <Badge variant="secondary">Draft</Badge>}
                    </div>

                    <p className="text-gray-600 mb-3">{truncateContent(article.content)}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(article.updatedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>{article.views || 0} views</span>
                      </div>
                    </div>

                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
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
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFromSelected(article.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Star className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No selected articles</h3>
              <p className="text-gray-600 mb-6">Star articles while browsing to add them to your selection</p>
              <Button onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Browse Articles</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {safeArticles.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {safeArticles.length} article{safeArticles.length !== 1 ? "s" : ""} selected
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Export Selection
                </Button>
                <Button variant="outline" size="sm">
                  Share Selection
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    safeArticles.forEach((article) => onRemoveFromSelected(article.id))
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
