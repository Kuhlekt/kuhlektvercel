"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, User, Tag, Eye, Edit } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface ArticleListProps {
  articles: Article[]
  categories: Category[]
  onArticleSelect: (article: Article) => void
  title?: string
}

export function ArticleList({ articles, categories, onArticleSelect, title = "Articles" }: ArticleListProps) {
  const getCategoryName = (categoryId: string) => {
    for (const category of categories) {
      if (category.id === categoryId) {
        return category.name
      }
      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          if (subcategory.id === categoryId) {
            return `${category.name} > ${subcategory.name}`
          }
        }
      }
    }
    return "Unknown Category"
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          {title}
          <Badge variant="secondary" className="ml-2">
            {articles.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {articles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No articles found.</p>
            <p className="text-sm">Try adjusting your search or browse different categories.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onArticleSelect(article)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 hover:text-blue-600">{article.title}</h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {article.content.length > 150 ? `${article.content.substring(0, 150)}...` : article.content}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(article.createdAt)}
                      </div>

                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {getCategoryName(article.categoryId)}
                      </div>

                      {article.updatedAt &&
                        new Date(article.updatedAt).getTime() !== new Date(article.createdAt).getTime() && (
                          <div className="flex items-center">
                            <Edit className="h-3 w-3 mr-1" />
                            Updated {formatDate(article.updatedAt)}
                          </div>
                        )}
                    </div>

                    {article.tags && article.tags.length > 0 && (
                      <div className="flex items-center mt-3 gap-2">
                        <Tag className="h-3 w-3 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 3).map((tag) => (
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
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-4 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      onArticleSelect(article)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
