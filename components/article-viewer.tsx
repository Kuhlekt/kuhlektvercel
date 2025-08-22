"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash2, Calendar, Tag, User, Clock } from "lucide-react"
import type { Article, Category, User as UserType } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article
  categories: Category[]
  currentUser: UserType | null
  onBack: () => void
  onEdit?: (article: Article) => void
  onDelete?: (articleId: string) => void
}

// Helper function to safely format dates
const formatDate = (date: any): string => {
  try {
    if (!date) return "Unknown"

    let dateObj: Date
    if (date instanceof Date) {
      dateObj = date
    } else if (typeof date === "string") {
      dateObj = new Date(date)
    } else {
      return "Invalid Date"
    }

    if (isNaN(dateObj.getTime())) {
      return "Invalid Date"
    }

    return dateObj.toLocaleDateString() + " at " + dateObj.toLocaleTimeString()
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Date Error"
  }
}

export function ArticleViewer({ article, categories, currentUser, onBack, onEdit, onDelete }: ArticleViewerProps) {
  const getCategoryName = (categoryId: string, subcategoryId?: string): string => {
    for (const category of categories) {
      if (category.id === categoryId) {
        if (subcategoryId && category.subcategories) {
          const subcategory = category.subcategories.find((sub) => sub.id === subcategoryId)
          if (subcategory) {
            return `${category.name} > ${subcategory.name}`
          }
        }
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

  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")
  const canDelete = currentUser && currentUser.role === "admin"

  const formatContent = (content: string): string => {
    // Convert markdown-style formatting to HTML-like formatting for display
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Articles
        </Button>

        {(canEdit || canDelete) && (
          <div className="flex items-center space-x-2">
            {canEdit && onEdit && (
              <Button variant="outline" onClick={() => onEdit(article)} className="flex items-center">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {canDelete && onDelete && (
              <Button variant="destructive" onClick={() => onDelete(article.id)} className="flex items-center">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Article Content */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div>
              <CardTitle className="text-3xl mb-3">{article.title}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created: {formatDate(article.createdAt)}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Updated: {formatDate(article.updatedAt)}
                </span>
                <Badge variant="outline">{getCategoryName(article.categoryId, article.subcategoryId)}</Badge>
              </CardDescription>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <div className="flex flex-wrap gap-2">
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

        <Separator />

        <CardContent className="pt-6">
          <div className="prose prose-gray max-w-none">
            <div
              className="whitespace-pre-wrap leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{
                __html: formatContent(article.content)
                  .replace(/<strong>(.*?)<\/strong>/g, '<span class="font-semibold text-gray-900">$1</span>')
                  .replace(/<em>(.*?)<\/em>/g, '<span class="italic">$1</span>')
                  .replace(
                    /<code>(.*?)<\/code>/g,
                    '<span class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</span>',
                  ),
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Article Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <User className="h-5 w-5 mr-2" />
            Article Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-900">Article ID:</span>
              <span className="ml-2 text-gray-600 font-mono">{article.id}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Category:</span>
              <span className="ml-2 text-gray-600">{getCategoryName(article.categoryId, article.subcategoryId)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Created:</span>
              <span className="ml-2 text-gray-600">{formatDate(article.createdAt)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Last Updated:</span>
              <span className="ml-2 text-gray-600">{formatDate(article.updatedAt)}</span>
            </div>
            {article.tags && article.tags.length > 0 && (
              <div className="md:col-span-2">
                <span className="font-medium text-gray-900">Tags:</span>
                <span className="ml-2 text-gray-600">{article.tags.join(", ")}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
