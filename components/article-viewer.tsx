"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, User, Tag, BookOpen } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article | null
  categories: Category[]
}

export function ArticleViewer({ article, categories }: ArticleViewerProps) {
  if (!article) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-gray-500">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Welcome to the Knowledge Base</h3>
            <p>Select an article from the categories to start reading</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Find category and subcategory names
  const getCategoryInfo = () => {
    if (!Array.isArray(categories)) return { categoryName: "Unknown", subcategoryName: null }

    for (const category of categories) {
      // Check main category articles
      if (Array.isArray(category.articles) && category.articles.some((a) => a.id === article.id)) {
        return { categoryName: category.name, subcategoryName: null }
      }

      // Check subcategory articles
      if (Array.isArray(category.subcategories)) {
        for (const subcategory of category.subcategories) {
          if (Array.isArray(subcategory.articles) && subcategory.articles.some((a) => a.id === article.id)) {
            return { categoryName: category.name, subcategoryName: subcategory.name }
          }
        }
      }
    }

    return { categoryName: "Unknown", subcategoryName: null }
  }

  const { categoryName, subcategoryName } = getCategoryInfo()

  // Process content to handle images and formatting
  const processContent = (content: string) => {
    // Handle data URLs for images
    const processedContent = content.replace(
      /data:image\/[^;]+;base64,[^"'\s)]+/g,
      (match) => `<img src="${match}" alt="Article image" style="max-width: 100%; height: auto; margin: 1rem 0;" />`,
    )

    return processedContent
  }

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="space-y-2">
          <CardTitle className="text-2xl leading-tight">{article.title}</CardTitle>

          {/* Category breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Badge variant="secondary">{categoryName}</Badge>
            {subcategoryName && (
              <>
                <span>→</span>
                <Badge variant="outline">{subcategoryName}</Badge>
              </>
            )}
          </div>
        </div>

        {/* Article metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 border-t pt-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Updated: {article.updatedAt.toLocaleDateString()}</span>
          </div>

          {article.createdBy && (
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>by {article.createdBy}</span>
            </div>
          )}

          {article.editCount !== undefined && article.editCount > 0 && (
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>
                {article.editCount} edit{article.editCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {Array.isArray(article.tags) && article.tags.length > 0 && (
          <div className="flex items-center space-x-2">
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
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: processContent(article.content) }}
        />
      </CardContent>
    </Card>
  )
}
