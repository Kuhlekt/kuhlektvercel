"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Edit, Calendar, User, Tag, Clock, Plus, CheckCircle, AlertCircle, Eye, BookOpen } from "lucide-react"

import type { Article, Category, User as KBUser } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article | null
  categories: Category[]
  currentUser: KBUser | null
  onEditArticle: (article: Article) => void
  onAddToSelected: (article: Article) => void
  selectedArticles: Article[]
}

export function ArticleViewer({
  article,
  categories = [],
  currentUser,
  onEditArticle,
  onAddToSelected,
  selectedArticles = [],
}: ArticleViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!article) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-96 text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to the Knowledge Base</h3>
          <p className="text-gray-500 mb-4">Select an article from the categories on the left to start reading.</p>
          <div className="text-sm text-gray-400">
            <p>• Browse through categories to find articles</p>
            <p>• Use the search bar to find specific content</p>
            <p>• Add articles to your selected list for easy access</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isSelected = Array.isArray(selectedArticles) && selectedArticles.some((a) => a.id === article.id)

  const getCategoryPath = (articleId: string): string => {
    if (!Array.isArray(categories)) return "Unknown Category"

    for (const category of categories) {
      // Check main category articles
      if (Array.isArray(category.articles) && category.articles.some((a) => a.id === articleId)) {
        return category.name
      }

      // Check subcategory articles
      if (Array.isArray(category.subcategories)) {
        for (const subcategory of category.subcategories) {
          if (Array.isArray(subcategory.articles) && subcategory.articles.some((a) => a.id === articleId)) {
            return `${category.name} > ${subcategory.name}`
          }
        }
      }
    }

    return "Unknown Category"
  }

  const formatDate = (date: Date | string): string => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date
      if (isNaN(dateObj.getTime())) return "Invalid Date"
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Invalid Date"
    }
  }

  const shouldTruncateContent = article.content.length > 500
  const displayContent =
    shouldTruncateContent && !isExpanded ? article.content.substring(0, 500) + "..." : article.content

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>{article.title}</span>
            </CardTitle>

            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
              <Badge variant="outline" className="text-xs">
                {getCategoryPath(article.id)}
              </Badge>

              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Created: {formatDate(article.createdAt)}</span>
              </div>

              {article.updatedAt && article.updatedAt !== article.createdAt && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Updated: {formatDate(article.updatedAt)}</span>
                </div>
              )}

              {article.author && (
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{article.author}</span>
                </div>
              )}

              {typeof article.editCount === "number" && article.editCount > 0 && (
                <div className="flex items-center space-x-1">
                  <Edit className="h-3 w-3" />
                  <span>{article.editCount} edits</span>
                </div>
              )}
            </div>

            {Array.isArray(article.tags) && article.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 mb-3">
                <Tag className="h-3 w-3 text-gray-400" />
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onAddToSelected(article)}
              disabled={isSelected}
              className="flex items-center space-x-1"
            >
              {isSelected ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Selected</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add to Selected</span>
                </>
              )}
            </Button>

            {currentUser && (
              <Button variant="outline" size="sm" onClick={() => onEditArticle(article)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Separator className="mb-4" />

        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{displayContent}</div>

          {shouldTruncateContent && (
            <div className="mt-4">
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="text-blue-600">
                <Eye className="h-4 w-4 mr-1" />
                {isExpanded ? "Show Less" : "Read More"}
              </Button>
            </div>
          )}
        </div>

        {article.content.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>This article appears to be empty.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
