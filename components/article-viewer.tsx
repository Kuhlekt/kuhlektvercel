"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Trash2, Calendar, User, Tag, FileText } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article | null
  categories?: Category[]
  onBack: () => void
  backButtonText?: string
  onEdit?: (article: Article) => void
  onDelete?: (articleId: string) => void
}

export function ArticleViewer({
  article,
  categories = [],
  onBack,
  backButtonText = "Back to Articles",
  onEdit,
  onDelete,
}: ArticleViewerProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!article) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Kuhlekt Knowledge Base</h3>
          <p className="text-gray-600 mb-4">
            Select an article from the categories on the left or use the search function to find what you're looking
            for.
          </p>
          <div className="text-sm text-gray-500">
            <p>Browse through our comprehensive collection of technical documentation and guides.</p>
          </div>
        </div>
      </div>
    )
  }

  // Find category and subcategory names
  const getCategoryInfo = () => {
    if (!Array.isArray(categories)) return { categoryName: "Unknown", subcategoryName: undefined }

    for (const category of categories) {
      // Check if article is in main category
      if (Array.isArray(category.articles) && category.articles.some((a) => a.id === article.id)) {
        return { categoryName: category.name, subcategoryName: undefined }
      }

      // Check subcategories
      if (Array.isArray(category.subcategories)) {
        for (const subcategory of category.subcategories) {
          if (Array.isArray(subcategory.articles) && subcategory.articles.some((a) => a.id === article.id)) {
            return { categoryName: category.name, subcategoryName: subcategory.name }
          }
        }
      }
    }

    return { categoryName: "Unknown", subcategoryName: undefined }
  }

  const { categoryName, subcategoryName } = getCategoryInfo()

  const handleDelete = () => {
    if (onDelete) {
      onDelete(article.id)
      setShowDeleteConfirm(false)
    }
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>{backButtonText}</span>
          </Button>

          {(onEdit || onDelete) && (
            <div className="flex items-center space-x-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(article)}
                  className="flex items-center space-x-1"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              )}
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Created {formatDate(article.createdAt)}</span>
          </div>
          {article.updatedAt && article.updatedAt.getTime() !== article.createdAt.getTime() && (
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Updated {formatDate(article.updatedAt)}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>By {article.author}</span>
          </div>
          {article.editCount && article.editCount > 0 && (
            <div className="flex items-center space-x-1">
              <Edit className="h-4 w-4" />
              <span>
                {article.editCount} edit{article.editCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Category and Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {categoryName}
            {subcategoryName && ` → ${subcategoryName}`}
          </Badge>
          {Array.isArray(article.tags) &&
            article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="flex items-center space-x-1">
                <Tag className="h-3 w-3" />
                <span>{tag}</span>
              </Badge>
            ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html: article.content.replace(/\n/g, "<br>"),
          }}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-red-600">Delete Article</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "{article.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
