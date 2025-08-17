"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Calendar, User, Tag } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"
import type { JSX } from "react"

interface ArticleViewerProps {
  article: Article
  categories: Category[]
  onBack: () => void
  backButtonText: string
  onEdit?: (article: Article) => void
  onDelete?: (articleId: string) => void
}

// Helper function to clean HTML content and convert to readable text
const cleanContent = (htmlContent: string): string => {
  if (!htmlContent) return ""

  // Create a temporary div to parse HTML
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = htmlContent

  // Get text content while preserving some structure
  let cleanText = tempDiv.textContent || tempDiv.innerText || ""

  // Clean up extra whitespace and normalize line breaks
  cleanText = cleanText
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, "\n\n") // Preserve paragraph breaks
    .trim()

  return cleanText
}

// Helper function to extract and preserve images from HTML content
const extractImages = (htmlContent: string): string[] => {
  if (!htmlContent) return []

  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = htmlContent
  const images = tempDiv.querySelectorAll("img")

  return Array.from(images)
    .map((img) => img.src)
    .filter((src) => src && src.trim() !== "")
}

// Helper function to format content with proper paragraphs
const formatContent = (content: string): JSX.Element[] => {
  if (!content) return []

  const paragraphs = content.split("\n\n").filter((p) => p.trim() !== "")

  return paragraphs.map((paragraph, index) => (
    <p key={index} className="mb-4 leading-relaxed">
      {paragraph.trim()}
    </p>
  ))
}

export function ArticleViewer({ article, categories, onBack, backButtonText, onEdit, onDelete }: ArticleViewerProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Get category and subcategory names
  const category = categories.find((c) => c.id === article.categoryId)
  const subcategory = category?.subcategories.find((s) => s.id === article.subcategoryId)

  // Clean the article content
  const cleanedContent = cleanContent(article.content)
  const images = extractImages(article.content)
  const formattedContent = formatContent(cleanedContent)

  const handleDelete = () => {
    if (onDelete) {
      onDelete(article.id)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
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
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              )}
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

        {/* Article metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Created {article.createdAt.toLocaleDateString()}</span>
          </div>

          {article.updatedAt.getTime() !== article.createdAt.getTime() && (
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Updated {article.updatedAt.toLocaleDateString()}</span>
            </div>
          )}

          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>By {article.createdBy}</span>
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

        {/* Category breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <span>{category?.name || "Unknown Category"}</span>
          {subcategory && (
            <>
              <span>›</span>
              <span>{subcategory.name}</span>
            </>
          )}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
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
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Images */}
        {images.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((src, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <img
                    src={src || "/placeholder.svg"}
                    alt={`Article image ${index + 1}`}
                    className="w-full h-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Article content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-800 leading-relaxed font-serif">
            {formattedContent.length > 0 ? (
              formattedContent
            ) : (
              <p className="text-gray-500 italic">No content available</p>
            )}
          </div>
        </div>
      </div>

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
    </div>
  )
}
