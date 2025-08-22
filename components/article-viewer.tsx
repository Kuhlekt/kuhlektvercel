"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Calendar, User, Tag, Clock } from "lucide-react"
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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")
  const canDelete = currentUser && currentUser.role === "admin"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Articles
        </Button>

        {canEdit && (
          <div className="flex space-x-2">
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(article)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {canDelete && onDelete && (
              <Button
                variant="outline"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this article?")) {
                    onDelete(article.id)
                  }
                }}
                className="text-red-600 hover:text-red-700"
              >
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
            <CardTitle className="text-2xl">{article.title}</CardTitle>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Created {formatDate(article.createdAt)}
              </div>

              {article.updatedAt && new Date(article.updatedAt).getTime() !== new Date(article.createdAt).getTime() && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Updated {formatDate(article.updatedAt)}
                </div>
              )}

              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {getCategoryName(article.categoryId)}
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
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
            <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">{article.content}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
