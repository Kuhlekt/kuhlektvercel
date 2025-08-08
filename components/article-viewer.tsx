"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from 'lucide-react'
import type { Article, Category } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article
  categories: Category[]
  onBack: () => void
}

export function ArticleViewer({ article, categories, onBack }: ArticleViewerProps) {
  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || "Unknown"
  }

  const getSubcategoryName = (categoryId: string, subcategoryId?: string) => {
    if (!subcategoryId) return null
    const category = categories.find((cat) => cat.id === categoryId)
    return category?.subcategories.find((sub) => sub.id === subcategoryId)?.name
  }

  const subcategoryName = getSubcategoryName(article.categoryId, article.subcategoryId)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-2xl">{article.title}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{getCategoryName(article.categoryId)}</Badge>
              {subcategoryName && <Badge variant="outline">{subcategoryName}</Badge>}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Created: {article.createdAt.toLocaleDateString()}
            {article.updatedAt.getTime() !== article.createdAt.getTime() && (
              <span> • Updated: {article.updatedAt.toLocaleDateString()}</span>
            )}
            {article.createdBy && <span> • by {article.createdBy}</span>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
              style={{
                lineHeight: "1.6",
                fontSize: "16px",
                color: "#374151",
              }}
            />
          </div>

          {article.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-1">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
