"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Trash2, Calendar, User, Tag, FolderOpen } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article
  categories: Category[]
  onBack: () => void
  backButtonText?: string
  onEdit?: (article: Article) => void
  onDelete?: (articleId: string) => void
}

// Process article content to display clean, readable text with proper formatting
const processArticleContent = (content: string): string => {
  console.log("Processing article content for display...")

  let processedContent = content

  // First, handle any existing HTML img tags - preserve them
  const imgTags: string[] = []
  processedContent = processedContent.replace(/<img[^>]*>/g, (match) => {
    const placeholder = `__IMG_PLACEHOLDER_${imgTags.length}__`
    imgTags.push(match)
    return placeholder
  })

  // Remove any other HTML tags except for basic formatting
  processedContent = processedContent
    .replace(/<script[^>]*>.*?<\/script>/gi, "") // Remove scripts
    .replace(/<style[^>]*>.*?<\/style>/gi, "") // Remove styles
    .replace(/<[^>]*>/g, "") // Remove all other HTML tags
    .replace(/&nbsp;/g, " ") // Replace non-breaking spaces
    .replace(/&amp;/g, "&") // Replace HTML entities
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')

  // Clean up whitespace
  processedContent = processedContent
    .replace(/\s+/g, " ") // Multiple spaces to single space
    .replace(/\n\s*\n/g, "\n\n") // Multiple newlines to double newline
    .trim()

  // Convert to proper paragraphs
  const paragraphs = processedContent.split(/\n\s*\n/).filter((p) => p.trim())
  processedContent = paragraphs.map((p) => `<p>${p.trim()}</p>`).join("")

  // Restore image tags
  imgTags.forEach((imgTag, index) => {
    const placeholder = `__IMG_PLACEHOLDER_${index}__`
    processedContent = processedContent.replace(placeholder, imgTag)
  })

  // Handle any remaining image URLs that aren't in img tags
  processedContent = processedContent.replace(
    /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg))/gi,
    '<img src="$1" alt="Image" style="max-width: 100%; height: auto; margin: 16px 0; border-radius: 8px;" />',
  )

  // Handle data URLs
  processedContent = processedContent.replace(
    /(data:image\/[^;]+;base64,[A-Za-z0-9+/=]+)/g,
    '<img src="$1" alt="Embedded image" style="max-width: 100%; height: auto; margin: 16px 0; border-radius: 8px;" />',
  )

  console.log("Content processed for clean display")
  return processedContent
}

export function ArticleViewer({
  article,
  categories,
  onBack,
  backButtonText = "Back to Articles",
  onEdit,
  onDelete,
}: ArticleViewerProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Get category and subcategory names
  const getCategoryInfo = () => {
    const category = categories.find((c) => c.id === article.categoryId)
    if (!category) return { categoryName: "Unknown", subcategoryName: undefined }

    if (article.subcategoryId) {
      const subcategory = category.subcategories.find((s) => s.id === article.subcategoryId)
      return {
        categoryName: category.name,
        subcategoryName: subcategory?.name || "Unknown Subcategory",
      }
    }

    return { categoryName: category.name, subcategoryName: undefined }
  }

  const { categoryName, subcategoryName } = getCategoryInfo()

  const handleDelete = () => {
    if (onDelete) {
      onDelete(article.id)
      setShowDeleteConfirm(false)
    }
  }

  const processedContent = processArticleContent(article.content)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
                className="flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Article Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{article.title}</CardTitle>

          {/* Article Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pt-2">
            <div className="flex items-center space-x-1">
              <FolderOpen className="h-4 w-4" />
              <span>{categoryName}</span>
              {subcategoryName && (
                <>
                  <span>→</span>
                  <span>{subcategoryName}</span>
                </>
              )}
            </div>

            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Created {article.createdAt.toLocaleDateString()}</span>
            </div>

            {article.updatedAt && article.updatedAt.getTime() !== article.createdAt.getTime() && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Updated {article.updatedAt.toLocaleDateString()}</span>
              </div>
            )}

            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>By {article.createdBy}</span>
            </div>

            {article.editCount && article.editCount > 0 && <Badge variant="secondary">Edit #{article.editCount}</Badge>}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center space-x-2 pt-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <div className="flex flex-wrap gap-1">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div
            className="prose prose-lg max-w-none text-gray-800"
            style={{
              lineHeight: "1.7",
              fontSize: "16px",
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-lg">Confirm Delete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
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
