"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, Tag } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface ArticleListProps {
  articles: Article[]
  categories: Category[]
  onArticleSelect: (article: Article) => void
  title: string
}

export function ArticleList({ articles, categories, onArticleSelect, title }: ArticleListProps) {
  const getCategoryName = (categoryId: string, subcategoryId?: string): string => {
    const category = categories.find((cat) => cat.id === categoryId)
    if (!category) return "Unknown Category"

    if (subcategoryId) {
      const subcategory = category.subcategories?.find((sub) => sub.id === subcategoryId)
      if (subcategory) {
        return `${category.name} > ${subcategory.name}`
      }
    }

    return category.name
  }

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">
          {articles.length === 0
            ? "No articles found"
            : `${articles.length} article${articles.length === 1 ? "" : "s"} found`}
        </p>
      </div>

      {articles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Articles Found</h3>
            <p className="text-gray-500">
              {title.includes("Search")
                ? "Try adjusting your search terms or browse all articles"
                : "No articles have been added to this category yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(article.updatedAt)}
                      </span>
                      <span>{getCategoryName(article.categoryId, article.subcategoryId)}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {article.content.substring(0, 200)}
                  {article.content.length > 200 && "..."}
                </p>

                {article.tags && article.tags.length > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
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

                <Button onClick={() => onArticleSelect(article)} variant="default" size="sm" className="w-full">
                  Read Article
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
