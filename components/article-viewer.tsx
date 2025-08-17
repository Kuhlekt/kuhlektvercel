"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, User, Tag } from "lucide-react"
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
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Article Selected</h3>
            <p className="text-sm">Select an article from the category tree to view its content</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getCategoryPath = (article: Article) => {
    for (const category of categories) {
      // Check if article is in main category
      if (category.articles?.some((a) => a.id === article.id)) {
        return category.name
      }

      // Check if article is in subcategory
      for (const subcategory of category.subcategories || []) {
        if (subcategory.articles?.some((a) => a.id === article.id)) {
          return `${category.name} > ${subcategory.name}`
        }
      }
    }
    return "Unknown Category"
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{getCategoryPath(article)}</span>
          </div>
          <CardTitle className="text-2xl">{article.title}</CardTitle>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {article.author && (
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
            )}

            {article.createdAt && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="prose prose-sm max-w-none">
          <div
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br>") }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
