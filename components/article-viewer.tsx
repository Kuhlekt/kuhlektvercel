"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, User, Tag, Eye, FileText } from "lucide-react"
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
            <p>Select an article from the categories to view its content</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getCategoryName = (categoryId: string, subcategoryId?: string) => {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return "Unknown Category"

    if (subcategoryId) {
      const subcategory = category.subcategories?.find((s) => s.id === subcategoryId)
      return subcategory ? `${category.name} > ${subcategory.name}` : category.name
    }

    return category.name
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="space-y-4">
          <div>
            <CardTitle className="text-2xl mb-2">{article.title}</CardTitle>
            {article.summary && <p className="text-gray-600">{article.summary}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Created {formatDate(article.createdAt)}</span>
            </div>

            {article.author && (
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
            )}

            {article.viewCount !== undefined && (
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{article.viewCount} views</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{getCategoryName(article.categoryId, article.subcategoryId)}</Badge>

            {Array.isArray(article.tags) &&
              article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                  <Tag className="h-3 w-3" />
                  <span>{tag}</span>
                </Badge>
              ))}

            {article.isPublished && <Badge className="bg-green-100 text-green-800">Published</Badge>}
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <div className="prose prose-sm max-w-none">
          <div
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: article.content
                .replace(/\n/g, "<br>")
                .replace(/#{3}\s(.+)/g, "<h3>$1</h3>")
                .replace(/#{2}\s(.+)/g, "<h2>$1</h2>")
                .replace(/#{1}\s(.+)/g, "<h1>$1</h1>")
                .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                .replace(/\*(.+?)\*/g, "<em>$1</em>")
                .replace(/`(.+?)`/g, "<code>$1</code>")
                .replace(/```(\w+)?\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>"),
            }}
          />
        </div>

        {article.createdAt !== article.updatedAt && (
          <div className="mt-8 pt-4 border-t text-sm text-gray-500">Last updated: {formatDate(article.updatedAt)}</div>
        )}
      </CardContent>
    </Card>
  )
}
