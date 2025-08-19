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

// Function to convert HTML content to plain readable text
function convertToPlainText(content: string): string {
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = content

  // Remove script and style elements
  const scripts = tempDiv.querySelectorAll("script, style")
  scripts.forEach((el) => el.remove())

  // Handle images - replace with [Image: filename] notation
  const images = tempDiv.querySelectorAll("img")
  images.forEach((img) => {
    const alt = img.getAttribute("alt") || "Image"
    const textNode = document.createTextNode(`[Image: ${alt}]`)
    img.parentNode?.replaceChild(textNode, img)
  })

  // Handle links - keep text but add URL in parentheses
  const links = tempDiv.querySelectorAll("a")
  links.forEach((link) => {
    const href = link.getAttribute("href")
    const text = link.textContent || ""
    if (href && href !== text) {
      link.textContent = `${text} (${href})`
    }
  })

  // Handle lists - add bullet points or numbers
  const listItems = tempDiv.querySelectorAll("li")
  listItems.forEach((li, index) => {
    const parent = li.parentElement
    const isOrdered = parent?.tagName.toLowerCase() === "ol"
    const prefix = isOrdered ? `${index + 1}. ` : "• "
    li.textContent = prefix + (li.textContent || "")
  })

  // Handle headings - add line breaks and emphasis
  const headings = tempDiv.querySelectorAll("h1, h2, h3, h4, h5, h6")
  headings.forEach((heading) => {
    const text = heading.textContent || ""
    heading.textContent = `\n\n${text.toUpperCase()}\n`
  })

  // Handle paragraphs - add line breaks
  const paragraphs = tempDiv.querySelectorAll("p")
  paragraphs.forEach((p) => {
    const text = p.textContent || ""
    if (text.trim()) {
      p.textContent = text + "\n\n"
    }
  })

  // Handle line breaks
  const breaks = tempDiv.querySelectorAll("br")
  breaks.forEach((br) => {
    br.parentNode?.replaceChild(document.createTextNode("\n"), br)
  })

  // Get the final plain text
  let plainText = tempDiv.textContent || tempDiv.innerText || ""

  // Clean up multiple line breaks and spaces
  plainText = plainText
    .replace(/\n\s*\n\s*\n/g, "\n\n") // Replace multiple line breaks with double
    .replace(/[ \t]+/g, " ") // Replace multiple spaces/tabs with single space
    .trim()

  // Handle image placeholders from our editor
  plainText = plainText.replace(/\[IMAGE:([^:]+):([^\]]+)\]/g, "[Image: $2]")

  return plainText
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

  const category = categories.find((cat) => cat.id === currentArticle.categoryId)
  const subcategory = category?.subcategories.find((sub) => sub.id === currentArticle.subcategoryId)

  const handleDelete = () => {
    if (onDelete) {
      onDelete(currentArticle.id)
      setShowDeleteDialog(false)
    }
  }

  const plainTextContent = convertToPlainText(currentArticle.content)

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
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg border">
            {plainTextContent}
          </div>
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
