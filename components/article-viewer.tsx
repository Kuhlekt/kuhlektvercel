"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, User, Tag } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article | null
  categories: Category[]
}

export function ArticleViewer({ article, categories }: ArticleViewerProps) {
  if (!article) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Article Selected</h3>
          <p className="text-gray-500 text-center max-w-sm">
            Select an article from the category tree to view its content here.
          </p>
        </CardContent>
      </Card>
    )
  }

  const getCategoryPath = (article: Article) => {
    const category = categories.find((cat) => cat.id === article.categoryId)
    if (!category) return "Unknown Category"

    if (article.subcategoryId) {
      const subcategory = category.subcategories?.find((sub) => sub.id === article.subcategoryId)
      return subcategory ? `${category.name} > ${subcategory.name}` : category.name
    }

    return category.name
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{getCategoryPath(article)}</span>
          </div>
          <CardTitle className="text-2xl">{article.title}</CardTitle>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Created {formatDate(article.createdAt)}</span>
            </div>
            {article.author && (
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>By {article.author}</span>
              </div>
            )}
            {article.updatedAt && article.updatedAt !== article.createdAt && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Updated {formatDate(article.updatedAt)}</span>
              </div>
            )}
          </div>
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
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
