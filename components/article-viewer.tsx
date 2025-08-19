"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, Calendar, User, Tag, Folder } from "lucide-react"
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
            <p>Select an article from the category tree to view its content</p>
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatContent = (content: string) => {
    return content.split("\n").map((line, index) => {
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-2xl font-bold mt-6 mb-4">
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
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={index} className="font-semibold mt-3 mb-2">
            {line.slice(2, -2)}
          </p>
        )
      }
      if (line.startsWith("- ")) {
        return (
          <li key={index} className="ml-4 mb-1">
            {line.substring(2)}
          </li>
        )
      }
      if (line.match(/^\d+\. /)) {
        return (
          <li key={index} className="ml-4 mb-1 list-decimal">
            {line.replace(/^\d+\. /, "")}
          </li>
        )
      }
      if (line.startsWith("```")) {
        return null // Skip code block markers for now
      }
      if (line.trim() === "") {
        return <br key={index} />
      }
      return (
        <p key={index} className="mb-2 leading-relaxed">
          {line}
        </p>
      )
    })
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Folder className="h-4 w-4" />
                <span>{getCategoryPath(article)}</span>
              </div>
              {article.author && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Created: {formatDate(article.createdAt)}</span>
            </div>
            {article.updatedAt && article.updatedAt !== article.createdAt && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Updated: {formatDate(article.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="flex items-center space-x-2 pt-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <div className="flex flex-wrap gap-1">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />
      </CardHeader>

      <CardContent>
        <div className="prose prose-sm max-w-none">{formatContent(article.content)}</div>
      </CardContent>
    </Card>
  )
}
