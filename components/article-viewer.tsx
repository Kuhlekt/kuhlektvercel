"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Calendar, User, Tag } from "lucide-react"
import type { Article, Category, User as UserType } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article
  categories: Category[]
  currentUser: UserType | null
  onBack: () => void
  onEdit?: (article: Article) => void
  onDelete?: (articleId: string) => void
}

export function ArticleViewer({ article, categories, currentUser, onBack, onEdit, onDelete }: ArticleViewerProps) {
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

  const convertHtmlToPlainText = (html: string): string => {
    // Convert HTML to readable plain text
    const text = html
      // Convert line breaks
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<p[^>]*>/gi, "")
      // Convert headings
      .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, "\n\n$1\n" + "=".repeat(20) + "\n")
      // Convert lists
      .replace(/<li[^>]*>(.*?)<\/li>/gi, "• $1\n")
      .replace(/<\/ul>/gi, "\n")
      .replace(/<ul[^>]*>/gi, "")
      .replace(/<\/ol>/gi, "\n")
      .replace(/<ol[^>]*>/gi, "")
      // Convert links
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "$2 ($1)")
      // Convert images
      .replace(/<img[^>]*alt="([^"]*)"[^>]*>/gi, "[Image: $1]")
      .replace(/<img[^>]*>/gi, "[Image]")
      // Remove all other HTML tags
      .replace(/<[^>]*>/g, "")
      // Clean up whitespace
      .replace(/\n\s*\n\s*\n/g, "\n\n")
      .replace(/^\s+|\s+$/g, "")

    return text
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      onDelete?.(article.id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Articles</span>
        </Button>

        {currentUser && (
          <div className="flex items-center space-x-2">
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(article)} className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                onClick={handleDelete}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:border-red-300 bg-transparent"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Article */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <CardTitle className="text-2xl">{article.title}</CardTitle>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Created: {article.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Updated: {article.updatedAt.toLocaleDateString()}</span>
              </div>
              {article.createdBy && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>By: {article.createdBy}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{getCategoryName(article.categoryId)}</Badge>
              {article.tags.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-lg border">
              {convertHtmlToPlainText(article.content)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
