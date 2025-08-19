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
  onBack?: () => void
  backButtonText?: string
  onEdit?: (article: Article) => void
  onDelete?: (articleId: string) => void
  onEditArticle?: (article: Article) => void
  onDeleteArticle?: (articleId: string) => void
}

export function ArticleViewer({
  article,
  categories = [],
  onBack,
  backButtonText = "Back",
  onEdit,
  onDelete,
  onEditArticle,
  onDeleteArticle,
}: ArticleViewerProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Handle case where no article is selected
  if (!article) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-gray-500">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold mb-2">Welcome to Kuhlekt Knowledge Base</h2>
            <p className="text-lg mb-4">Select an article from the sidebar to get started</p>
            <div className="text-sm">
              <p>Browse through categories or use the search function to find articles</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get category and subcategory names safely
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
    const deleteHandler = onDelete || onDeleteArticle
    if (deleteHandler) {
      deleteHandler(article.id)
      setShowDeleteConfirm(false)
    }
  }

  const handleEdit = () => {
    const editHandler = onEdit || onEditArticle
    if (editHandler) {
      editHandler(article)
    }
  }

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date
      if (isNaN(dateObj.getTime())) return "Invalid Date"
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "Invalid Date"
    }
  }

  return (
    <Card className="h-full">
      {/* Header */}
      <CardHeader className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between mb-4">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{backButtonText}</span>
            </Button>
          )}

          {(onEdit || onEditArticle || onDelete || onDeleteArticle) && (
            <div className="flex items-center space-x-2">
              {(onEdit || onEditArticle) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="flex items-center space-x-1 bg-transparent"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
              )}
              {(onDelete || onDeleteArticle) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              )}
            </div>
          )}
        </div>

        <CardTitle className="text-3xl font-bold text-gray-900 mb-4">{article.title}</CardTitle>

        {/* Article metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Created {formatDate(article.createdAt)}</span>
          </div>

          {article.updatedAt && new Date(article.updatedAt).getTime() !== new Date(article.createdAt).getTime() && (
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Updated {formatDate(article.updatedAt)}</span>
            </div>
          )}

          {article.author && (
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>By {article.author}</span>
            </div>
          )}

          {typeof article.editCount === "number" && article.editCount > 0 && (
            <div className="flex items-center space-x-1">
              <Edit className="h-4 w-4" />
              <span>
                {article.editCount} edit{article.editCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Category breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <span>{categoryName}</span>
          {subcategoryName && (
            <>
              <span>›</span>
              <span>{subcategoryName}</span>
            </>
          )}
        </div>

        {/* Tags */}
        {Array.isArray(article.tags) && article.tags.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
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
      </CardHeader>

      {/* Content */}
      <CardContent className="p-6">
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">{article.content}</div>
        </div>
      </CardContent>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Article</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{article.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
