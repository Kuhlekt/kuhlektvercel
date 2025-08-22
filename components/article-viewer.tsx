"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Edit, Trash2, Tag, User, Folder } from "lucide-react"
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
    return dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString()
  }

  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")
  const canDelete = currentUser && currentUser.role === "admin"

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Articles
        </Button>

        {currentUser && (
          <div className="flex items-center space-x-2">
            {canEdit && onEdit && (
              <Button variant="outline" onClick={() => onEdit(article)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {canDelete && onDelete && (
              <Button variant="destructive" onClick={() => onDelete(article.id)} size="sm">
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
          <CardTitle className="text-2xl">{article.title}</CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center">
              <Folder className="h-3 w-3 mr-1" />
              {getCategoryName(article.categoryId, article.subcategoryId)}
            </span>
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Created: {formatDate(article.createdAt)}
            </span>
            {article.updatedAt !== article.createdAt && (
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Updated: {formatDate(article.updatedAt)}
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">{article.content}</div>
          </div>
        </CardContent>
      </Card>

      {/* Article Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center">
            <User className="h-4 w-4 mr-2" />
            Article Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium text-gray-600">Article ID</label>
              <p className="text-gray-900 font-mono">{article.id}</p>
            </div>
            <div>
              <label className="font-medium text-gray-600">Category</label>
              <p className="text-gray-900">{getCategoryName(article.categoryId, article.subcategoryId)}</p>
            </div>
            <div>
              <label className="font-medium text-gray-600">Created</label>
              <p className="text-gray-900">{formatDate(article.createdAt)}</p>
            </div>
            <div>
              <label className="font-medium text-gray-600">Last Updated</label>
              <p className="text-gray-900">{formatDate(article.updatedAt)}</p>
            </div>
            <div>
              <label className="font-medium text-gray-600">Word Count</label>
              <p className="text-gray-900">{article.content.split(/\s+/).length} words</p>
            </div>
            <div>
              <label className="font-medium text-gray-600">Character Count</label>
              <p className="text-gray-900">{article.content.length} characters</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
