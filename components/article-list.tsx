"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Tag, FileText } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface ArticleListProps {
  articles?: Article[]
  categories?: Category[]
  onArticleSelect: (article: Article) => void
  title?: string
}

export function ArticleList({ articles = [], categories = [], onArticleSelect, title = "Articles" }: ArticleListProps) {
  const formatDate = (dateInput: string | Date) => {
    try {
      const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
      return date.toLocaleDateString()
    } catch {
      return "Unknown date"
    }
  }

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

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
        <p className="text-gray-500">
          {title === "All Articles" ? "No articles have been created yet." : `No articles found in "${title}".`}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">
          {articles.length} article{articles.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid gap-4">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onArticleSelect(article)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {article.content.replace(/<[^>]*>/g, "").substring(0, 150)}
                    {article.content.length > 150 ? "..." : ""}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{article.author || "Unknown"}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(article.createdAt)}</span>
                  </div>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{getCategoryName(article.categoryId)}</span>
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
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

              <div className="mt-3 pt-3 border-t">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Read Article →
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
