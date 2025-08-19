"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User, Tag, FileText } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"
import type React from "react" // Import React to declare JSX

interface ArticleViewerProps {
  article: Article | null
  categories: Category[]
}

export function ArticleViewer({ article, categories }: ArticleViewerProps) {
  if (!article) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No Article Selected</h3>
          <p className="text-gray-400 text-center">Select an article from the category tree to view its content</p>
        </CardContent>
      </Card>
    )
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category?.name || "Unknown Category"
  }

  const getSubcategoryName = (categoryId: string, subcategoryId?: string) => {
    if (!subcategoryId) return null
    const category = categories.find((cat) => cat.id === categoryId)
    const subcategory = category?.subcategories?.find((sub) => sub.id === subcategoryId)
    return subcategory?.name || "Unknown Subcategory"
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    const lines = content.split("\n")
    const elements: React.JSX.Element[] = [] // Declare JSX type explicitly
    let currentIndex = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={currentIndex++} className="text-3xl font-bold mb-4 text-gray-900">
            {line.substring(2)}
          </h1>,
        )
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={currentIndex++} className="text-2xl font-semibold mb-3 text-gray-800 mt-6">
            {line.substring(3)}
          </h2>,
        )
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={currentIndex++} className="text-xl font-semibold mb-2 text-gray-700 mt-4">
            {line.substring(4)}
          </h3>,
        )
      } else if (line.startsWith("- ")) {
        // Handle bullet points
        const listItems = []
        let j = i
        while (j < lines.length && lines[j].startsWith("- ")) {
          listItems.push(lines[j].substring(2))
          j++
        }
        elements.push(
          <ul key={currentIndex++} className="list-disc list-inside mb-4 space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>,
        )
        i = j - 1
      } else if (line.match(/^\d+\. /)) {
        // Handle numbered lists
        const listItems = []
        let j = i
        while (j < lines.length && lines[j].match(/^\d+\. /)) {
          listItems.push(lines[j].replace(/^\d+\. /, ""))
          j++
        }
        elements.push(
          <ol key={currentIndex++} className="list-decimal list-inside mb-4 space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-gray-700">
                {item}
              </li>
            ))}
          </ol>,
        )
        i = j - 1
      } else if (line.startsWith("```")) {
        // Handle code blocks
        const codeLines = []
        let j = i + 1
        while (j < lines.length && !lines[j].startsWith("```")) {
          codeLines.push(lines[j])
          j++
        }
        elements.push(
          <pre key={currentIndex++} className="bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
            <code className="text-sm">{codeLines.join("\n")}</code>
          </pre>,
        )
        i = j
      } else if (line.trim() === "") {
        // Empty line
        elements.push(<div key={currentIndex++} className="mb-2" />)
      } else {
        // Regular paragraph
        if (line.trim()) {
          elements.push(
            <p key={currentIndex++} className="mb-4 text-gray-700 leading-relaxed">
              {line}
            </p>,
          )
        }
      }
    }

    return elements
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <CardTitle className="text-2xl">{article.title}</CardTitle>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
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

            {article.author && (
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{getCategoryName(article.categoryId)}</Badge>

            {article.subcategoryId && (
              <Badge variant="outline">{getSubcategoryName(article.categoryId, article.subcategoryId)}</Badge>
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
        <div className="prose max-w-none">{renderContent(article.content)}</div>
      </CardContent>
    </Card>
  )
}
