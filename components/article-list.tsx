"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Tag } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface ArticleListProps {
  articles: Article[]
  categories: Category[]
  onArticleSelect: (article: Article) => void
  title: string
}

export function ArticleList({ articles, categories, onArticleSelect, title }: ArticleListProps) {
  const getCategoryName = (categoryId: string): string => {
    for (const category of categories) {
      if (category.id === categoryId) {
        return category.name
      }
      for (const subcategory of category.subcategories) {
        if (subcategory.id === categoryId) {
          return `${category.name} > ${subcategory.name}`
        }
      }
    }
    return "Unknown"
  }

  const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, "").trim()
  }

  const getPreview = (content: string): string => {
    const plainText = stripHtml(content)
    return plainText.length > 150 ? plainText.substring(0, 150) + "..." : plainText
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">{articles.length} articles</span>
      </div>

      {articles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 text-lg">No articles found.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or category filter.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onArticleSelect(article)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg hover:text-blue-600 transition-colors">{article.title}</CardTitle>
                  <Badge variant="secondary" className="ml-2 shrink-0">
                    {getCategoryName(article.categoryId)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 mb-4 line-clamp-2">{getPreview(article.content)}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{article.createdAt.toLocaleDateString()}</span>
                    </div>
                    {article.createdBy && (
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{article.createdBy}</span>
                      </div>
                    )}
                  </div>

                  {article.tags.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Tag className="h-3 w-3" />
                      <div className="flex space-x-1">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
