"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit, Trash2, ArrowLeft, Calendar, User, Tag, Hash, Clock } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article
  categories: Category[]
  onEdit?: (article: Article) => void
  onDelete?: (articleId: string) => void
  onBack: () => void
  backButtonText?: string
}

// Function to process content and render images properly
function processArticleContent(content: string): string {
  let processedContent = content

  console.log("Processing article content:", content)

  // If content is already HTML with img tags, return it as-is
  if (content.includes("<img") && !content.includes("[IMAGE:")) {
    console.log("Content already contains HTML img tags, returning as-is")
    return processedContent
  }

  // Replace image placeholders with actual images
  processedContent = processedContent.replace(/\[IMAGE:([^:]+):([^\]]+)\]/g, (match, id, filename) => {
    // Check if we have stored images in global reference
    const storedImages = (window as any).textareaImages || (window as any).editingImages || []
    const imageData = storedImages.find((img: any) => img.id === id || img.placeholder === match)

    console.log("Looking for image:", { id, filename, match, storedImages })

    if (imageData && imageData.dataUrl) {
      console.log("Found image data:", imageData)
      return `<img src="${imageData.dataUrl}" alt="${filename}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block;" />`
    }

    // If no stored image found, return a placeholder div
    console.log("No image data found for:", { id, filename })
    return `<div style="padding: 20px; border: 2px dashed #ccc; text-align: center; margin: 10px 0; border-radius: 8px; background-color: #f9f9f9;">
      <p style="margin: 0; color: #666;">📷 Image: ${filename}</p>
    </div>`
  })

  // Convert URLs to actual images (handle both HTTP and data URLs)
  processedContent = processedContent.replace(
    /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg))/gi,
    '<img src="$1" alt="Image" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block;" />',
  )

  // Convert standalone data URLs to images
  processedContent = processedContent.replace(
    /(?<!src=["'])(data:image\/[^;]+;base64,[^\s"'<>]+)(?!["'])/gi,
    '<img src="$1" alt="Embedded Image" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block;" />',
  )

  // Convert line breaks to proper HTML if content doesn't already have HTML structure
  if (!processedContent.includes("<p>") && !processedContent.includes("<div>") && !processedContent.includes("<br>")) {
    processedContent = processedContent.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>")
    if (processedContent && !processedContent.startsWith("<p>")) {
      processedContent = "<p>" + processedContent + "</p>"
    }
  }

  console.log("Final processed content:", processedContent)
  return processedContent
}

export function ArticleViewer({
  article,
  categories,
  onEdit,
  onDelete,
  onBack,
  backButtonText = "Back to Articles",
}: ArticleViewerProps) {
  const [currentArticle, setCurrentArticle] = useState(article)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    setCurrentArticle(article)
  }, [article])

  useEffect(() => {
    console.log("ArticleViewer received article:", currentArticle)
    console.log("Article content:", currentArticle.content)
    console.log("Current stored images:", (window as any).textareaImages)
  }, [currentArticle])

  const category = categories.find((cat) => cat.id === currentArticle.categoryId)
  const subcategory = category?.subcategories.find((sub) => sub.id === currentArticle.subcategoryId)

  const handleDelete = () => {
    if (onDelete) {
      onDelete(currentArticle.id)
      setShowDeleteDialog(false)
    }
  }

  const processedContent = processArticleContent(currentArticle.content)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>{backButtonText}</span>
        </Button>

        {(onEdit || onDelete) && (
          <div className="flex space-x-2">
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(currentArticle)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
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
            <CardTitle className="text-2xl">{currentArticle.title}</CardTitle>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {currentArticle.createdBy && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>By {currentArticle.createdBy}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Created {currentArticle.createdAt.toLocaleDateString()}</span>
              </div>
              {currentArticle.updatedAt.getTime() !== currentArticle.createdAt.getTime() && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Updated {currentArticle.updatedAt.toLocaleDateString()}</span>
                </div>
              )}
              {currentArticle.editCount && currentArticle.editCount > 0 && (
                <div className="flex items-center space-x-1">
                  <Hash className="h-4 w-4" />
                  <span>
                    {currentArticle.editCount} edit{currentArticle.editCount !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {currentArticle.lastEditedBy && (
                <div className="flex items-center space-x-1">
                  <Edit className="h-4 w-4" />
                  <span>Last edited by {currentArticle.lastEditedBy}</span>
                </div>
              )}
            </div>

            {/* Categories and Tags */}
            <div className="flex flex-wrap gap-2">
              {category && <Badge variant="secondary">{category.name}</Badge>}
              {subcategory && <Badge variant="outline">{subcategory.name}</Badge>}
              {currentArticle.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div
            className="prose max-w-none text-gray-800 leading-relaxed"
            style={{
              lineHeight: "1.7",
              fontSize: "16px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent aria-describedby="delete-article-description">
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription id="delete-article-description">
              Are you sure you want to delete "{currentArticle.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
