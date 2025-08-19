"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User, Tag, FileText } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article | null
  categories: Category[]
}

export function ArticleViewer({ article, categories }: ArticleViewerProps) {
  if (!article) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-gray-500">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Article Selected</h3>
            <p>Select an article from the category tree to view its content.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getCategoryPath = (article: Article) => {
    const category = categories.find((c) => c.id === article.categoryId)
    if (!category) return "Unknown Category"

    if (article.subcategoryId) {
      const subcategory = category.subcategories?.find((s) => s.id === article.subcategoryId)
      return subcategory ? `${category.name} > ${subcategory.name}` : category.name
    }

    return category.name
  }

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split("\n")
      .map((line, index) => {
        // Headers
        if (line.startsWith("# ")) {
          return (
            <h1 key={index} className="text-2xl font-bold mt-6 mb-4 first:mt-0">
              {line.substring(2)}
            </h1>
          )
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={index} className="text-xl font-semibold mt-5 mb-3">
              {line.substring(3)}
            </h2>
          )
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={index} className="text-lg font-medium mt-4 mb-2">
              {line.substring(4)}
            </h3>
          )
        }

        // Lists
        if (line.startsWith("- ")) {
          return (
            <li key={index} className="ml-4 mb-1">
              {line.substring(2)}
            </li>
          )
        }

        // Code blocks
        if (line.startsWith("```")) {
          return <div key={index} className="my-2" />
        }

        // Empty lines
        if (line.trim() === "") {
          return <br key={index} />
        }

        // Regular paragraphs
        return (
          <p key={index} className="mb-3 leading-relaxed">
            {line}
          </p>
        )
      })
      .filter(Boolean)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              {article.author && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
              )}
              <Badge variant="outline" className="text-xs">
                {getCategoryPath(article)}
              </Badge>
            </div>
          </div>
          <Badge variant={article.status === "published" ? "default" : "secondary"}>{article.status}</Badge>
        </div>

        {Array.isArray(article.tags) && article.tags.length > 0 && (
          <div className="flex items-center space-x-2 pt-2">
            <Tag className="h-4 w-4 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="prose prose-sm max-w-none">{formatContent(article.content)}</div>

        {article.updatedAt && new Date(article.updatedAt) > new Date(article.createdAt) && (
          <div className="mt-6 pt-4 border-t text-xs text-gray-500">
            Last updated: {new Date(article.updatedAt).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
