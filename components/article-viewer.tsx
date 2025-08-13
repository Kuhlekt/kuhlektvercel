"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Calendar, User, Hash, Clock, Tag } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article | null
  categories: Category[]
  onEdit?: (article: Article) => void
  canEdit?: boolean
}

// Function to process article content and display images properly
function processArticleContent(content: string): string {
  let processedContent = content

  // Convert image placeholders to actual images
  processedContent = processedContent.replace(/\[IMAGE:([^:]+):([^\]]+)\]/g, (match, id, filename) => {
    // Check if we have stored images
    const storedImages = (window as any).textareaImages || (window as any).editingImages || []
    const imageData = storedImages.find((img: any) => img.id === id || img.placeholder === match)

    if (imageData && imageData.dataUrl) {
      return `<img src="${imageData.dataUrl}" alt="${filename}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block;" />`
    }

    return `<div style="padding: 20px; border: 2px dashed #ccc; text-align: center; margin: 10px 0; border-radius: 8px; background-color: #f9f9f9;">
      <p style="margin: 0; color: #666;">📷 Image: ${filename}</p>
    </div>`
  })

  // Convert URLs to images
  processedContent = processedContent.replace(
    /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg))/gi,
    '<img src="$1" alt="Image" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block;" />',
  )

  // Convert data URLs to images
  processedContent = processedContent.replace(
    /(data:image\/[^;]+;base64,[^\s"'<>]+)/gi,
    '<img src="$1" alt="Embedded Image" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block;" />',
  )

  return processedContent
}

export function ArticleViewer({ article, categories, onEdit, canEdit = false }: ArticleViewerProps) {
  const [displayedArticle, setDisplayedArticle] = useState<Article | null>(null)

  useEffect(() => {
    if (article) {
      console.log("ArticleViewer received article:", article.title)
      setDisplayedArticle(article)
    }
  }, [article])

  if (!displayedArticle) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Select an article to view its content</p>
        </CardContent>
      </Card>
    )
  }

  const category = categories.find((cat) => cat.id === displayedArticle.categoryId)
  const subcategory = category?.subcategories?.find((sub) => sub.id === displayedArticle.subcategoryId)

  const processedContent = processArticleContent(displayedArticle.content)

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-2xl font-bold leading-tight">{displayedArticle.title}</CardTitle>
          {canEdit && onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(displayedArticle)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        {/* Article Metadata */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Created: {displayedArticle.createdAt.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Updated: {displayedArticle.updatedAt.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <User className="h-3 w-3" />
            <span>By: {displayedArticle.createdBy}</span>
          </div>
          {displayedArticle.editCount !== undefined && displayedArticle.editCount > 0 && (
            <div className="flex items-center space-x-1">
              <Hash className="h-3 w-3" />
              <span>Edits: {displayedArticle.editCount}</span>
            </div>
          )}
          {displayedArticle.lastEditedBy && (
            <div className="flex items-center space-x-1">
              <Edit className="h-3 w-3" />
              <span>Last edited by: {displayedArticle.lastEditedBy}</span>
            </div>
          )}
        </div>

        {/* Categories and Tags */}
        <div className="flex flex-wrap gap-2">
          {category && <Badge variant="secondary">{category.name}</Badge>}
          {subcategory && <Badge variant="outline">{subcategory.name}</Badge>}
          {displayedArticle.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              <Tag className="h-2 w-2 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: processedContent }} />
      </CardContent>
    </Card>
  )
}
