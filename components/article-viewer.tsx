"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, User, Calendar, Clock } from "lucide-react"
import type { Article, Category, User as UserType } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article
  categories: Category[]
  currentUser: UserType | null
  onBack: () => void
  onEdit?: (article: Article) => void
  onDelete?: (articleId: string) => void
}

export function ArticleViewer({ article, categories, currentUser, onBack, onEdit, onDelete }: ArticleViewerProps) {
  const getCategoryName = (categoryId: string | null, subcategoryId?: string | null) => {
    if (!categoryId) return "Uncategorized"

    const category = categories.find((c) => c.id === categoryId)
    if (!category) return "Unknown Category"

    if (subcategoryId) {
      const subcategory = category.subcategories.find((s) => s.id === subcategoryId)
      return subcategory ? `${category.name} > ${subcategory.name}` : category.name
    }

    return category.name
  }

  const stripHtml = (html: string) => {
    const temp = document.createElement("div")
    temp.innerHTML = html
    return temp.textContent || temp.innerText || ""
  }

  const plainTextContent = stripHtml(article.content)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Articles</span>
        </Button>

        {currentUser && (
          <div className="flex items-center space-x-2">
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(article)} className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                onClick={() => onDelete(article.id)}
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
          <div className="space-y-2">
            <CardTitle className="text-2xl">{article.title}</CardTitle>

            <div className="flex items-center justify-between">
              <Badge variant="outline">{getCategoryName(article.categoryId, article.subcategoryId)}</Badge>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{article.createdBy || "Unknown"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Created {new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              {article.updatedAt && new Date(article.updatedAt).getTime() !== new Date(article.createdAt).getTime() && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="prose max-w-none">
            <div className="bg-gray-50 p-6 rounded-lg border">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
                {plainTextContent}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
