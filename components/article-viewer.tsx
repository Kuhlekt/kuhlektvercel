"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, User, BookOpen } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article | null
  categories: Category[]
}

export function ArticleViewer({ article, categories = [] }: ArticleViewerProps) {
  if (!article) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-96 text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to the Knowledge Base</h3>
          <p className="text-gray-500 mb-4">Select an article from the categories to start reading.</p>
        </CardContent>
      </Card>
    )
  }

  const getCategoryPath = (articleId: string): string => {
    if (!Array.isArray(categories)) return "Unknown Category"

    for (const category of categories) {
      if (Array.isArray(category.articles) && category.articles.some((a) => a.id === articleId)) {
        return category.name
      }

      if (Array.isArray(category.subcategories)) {
        for (const subcategory of category.subcategories) {
          if (Array.isArray(subcategory.articles) && subcategory.articles.some((a) => a.id === articleId)) {
            return `${category.name} > ${subcategory.name}`
          }
        }
      }
    }

    return "Unknown Category"
  }

  const formatDate = (date: Date | string): string => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date
      if (isNaN(dateObj.getTime())) return "Invalid Date"
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return "Invalid Date"
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl mb-2 flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span>{article.title}</span>
        </CardTitle>

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
          <Badge variant="outline" className="text-xs">
            {getCategoryPath(article.id)}
          </Badge>

          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Created: {formatDate(article.createdAt)}</span>
          </div>

          {article.author && (
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{article.author}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{article.content}</div>
        </div>
      </CardContent>
    </Card>
  )
}
