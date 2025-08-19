"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, Tag, User } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article | null
  categories: Category[]
}

export function ArticleViewer({ article, categories }: ArticleViewerProps) {
  if (!article) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-gray-500">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Article Selected</h3>
            <p>Select an article from the categories to view its content.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.name || "Unknown Category"
  }

  const getSubcategoryName = (categoryId: string, subcategoryId?: string) => {
    if (!subcategoryId) return null
    const category = categories.find((c) => c.id === categoryId)
    const subcategory = category?.subcategories?.find((s) => s.id === subcategoryId)
    return subcategory?.name || "Unknown Subcategory"
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{article.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Created: {formatDate(article.createdAt)}</span>
              </div>
              {article.updatedAt && article.updatedAt !== article.createdAt && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Updated: {formatDate(article.updatedAt)}</span>
                </div>
              )}
              {article.author && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Badge className={getStatusColor(article.status)}>{article.status}</Badge>
            <Badge className={getPriorityColor(article.priority)}>{article.priority} priority</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Category and Subcategory */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{getCategoryName(article.categoryId)}</Badge>
            {article.subcategoryId && (
              <Badge variant="outline">{getSubcategoryName(article.categoryId, article.subcategoryId)}</Badge>
            )}
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{article.content}</div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center space-x-2 mb-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {article.attachments && article.attachments.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Attachments:</span>
              </div>
              <div className="space-y-1">
                {article.attachments.map((attachment, index) => (
                  <div key={index} className="text-sm text-blue-600 hover:text-blue-800">
                    {attachment}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
