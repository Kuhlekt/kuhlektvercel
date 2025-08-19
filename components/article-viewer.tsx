"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, Calendar, User, Tag, AlertCircle } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article | null
  categories: Category[]
}

export function ArticleViewer({ article, categories }: ArticleViewerProps) {
  if (!article) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-gray-500">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Article Selected</h3>
            <p>Select an article from the categories on the left to view its content.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getCategoryPath = () => {
    const category = categories.find((c) => c.id === article.categoryId)
    if (!category) return "Unknown Category"

    if (article.subcategoryId) {
      const subcategory = category.subcategories?.find((s) => s.id === article.subcategoryId)
      return subcategory ? `${category.name} > ${subcategory.name}` : category.name
    }

    return category.name
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "default"
      case "draft":
        return "secondary"
      case "archived":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              {article.author && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500 mb-3">{getCategoryPath()}</div>
          </div>
          <div className="flex flex-col space-y-2">
            <Badge variant={getPriorityColor(article.priority)} className="text-xs">
              {article.priority.charAt(0).toUpperCase() + article.priority.slice(1)} Priority
            </Badge>
            <Badge variant={getStatusColor(article.status)} className="text-xs">
              {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
            </Badge>
          </div>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="flex items-center space-x-2 flex-wrap">
            <Tag className="h-4 w-4 text-gray-500" />
            {article.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{article.content}</div>
        </div>

        {article.attachments && article.attachments.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-3 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Attachments
            </h4>
            <div className="space-y-2">
              {article.attachments.map((attachment, index) => (
                <div key={index} className="text-sm text-blue-600 hover:underline cursor-pointer">
                  {attachment}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Created: {new Date(article.createdAt).toLocaleString()}</span>
            <span>Updated: {new Date(article.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
