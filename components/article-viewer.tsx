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

// Process article content to handle images and formatting
const processArticleContent = (content: string): string => {
  console.log("Processing article content:", content.substring(0, 200) + "...")

  // If content already contains HTML img tags and no placeholders, return as is
  if (
    content.includes("<img") &&
    !content.includes("https://images.unsplash.com/") &&
    !content.includes("data:image/")
  ) {
    console.log("Content already has processed images, returning as is")
    return content
  }

  let processedContent = content

  // Replace image placeholders with actual images
  // Handle Unsplash URLs
  processedContent = processedContent.replace(/https:\/\/images\.unsplash\.com\/[^\s\n]+/g, (match) => {
    console.log("Converting Unsplash URL to img tag:", match)
    return `<img src="${match}" alt="Article image" style="max-width: 100%; height: auto; margin: 16px 0; border-radius: 8px;" />`
  })

  // Handle standalone data URLs
  processedContent = processedContent.replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g, (match) => {
    console.log("Converting data URL to img tag")
    return `<img src="${match}" alt="Pasted image" style="max-width: 100%; height: auto; margin: 16px 0; border-radius: 8px;" />`
  })

  // Convert line breaks to HTML if content doesn't already have HTML structure
  if (!processedContent.includes("<p>") && !processedContent.includes("<div>") && !processedContent.includes("<img")) {
    processedContent = processedContent.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>")
    processedContent = `<p>${processedContent}</p>`
  } else if (!processedContent.includes("<p>") && !processedContent.includes("<div>")) {
    // Has images but no paragraphs, wrap text in paragraphs while preserving images
    const parts = processedContent.split(/(<img[^>]*>)/g)
    processedContent = parts
      .map((part) => {
        if (part.startsWith("<img")) {
          return part
        } else if (part.trim()) {
          return `<p>${part.replace(/\n/g, "<br>")}</p>`
        }
        return part
      })
      .join("")
  }

  console.log("Final processed content:", processedContent.substring(0, 200) + "...")
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
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: processedContent }} />
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
