"use client"

import { Calendar, User, Tag, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Article, Category } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article | null
  articles: Article[]
  categories: Category[]
}

export function ArticleViewer({ article, articles, categories }: ArticleViewerProps) {
  if (!article) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Kuhlekt Knowledge Base</h2>
          <p className="text-gray-600 mb-6">
            Select an article from the sidebar to start reading, or use the search bar to find specific content.
          </p>
          <div className="text-sm text-gray-500">
            <p>📚 {articles.length} articles available</p>
            <p>📁 {categories.length} categories</p>
          </div>
        </div>
      </div>
    )
  }

  const category = categories.find((c) => c.id === article.categoryId)

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
          {category && (
            <div className="flex items-center space-x-1">
              <Tag className="w-4 h-4" />
              <span>{category.name}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{article.createdBy}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{article.createdAt.toLocaleDateString()}</span>
          </div>
          <Badge variant={article.status === "published" ? "default" : "secondary"}>{article.status}</Badge>
        </div>

        {article.tags.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Tags:</span>
            <div className="flex flex-wrap gap-1">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{article.content}</div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
