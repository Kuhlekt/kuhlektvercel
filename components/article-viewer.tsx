"use client"

import { ArrowLeft, Edit, Calendar, User, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Article, Category, User as UserType } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article | null
  category: Category | null
  author: UserType | undefined
  currentUser: UserType | null
  onEdit: () => void
  onBack: () => void
}

export function ArticleViewer({ article, category, author, currentUser, onEdit, onBack }: ArticleViewerProps) {
  if (!article) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Kuhlekt Knowledge Base</h2>
          <p className="text-gray-600 max-w-md">
            Select a category or article from the sidebar to start reading, or use the search bar to find specific
            content.
          </p>
          {!currentUser && (
            <p className="text-sm text-gray-500 mt-4">
              Log in to access additional features like creating and editing articles.
            </p>
          )}
        </div>
      </div>
    )
  }

  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack} className="p-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Button>
          {canEdit && (
            <Button onClick={onEdit} size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Article
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{article.title}</h1>
            {category && (
              <p className="text-sm text-gray-600 mt-2">
                in <span className="font-medium">{category.name}</span>
              </p>
            )}
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>By {author?.username || article.createdBy}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{article.createdAt.toLocaleDateString()}</span>
            </div>
            {article.updatedAt.getTime() !== article.createdAt.getTime() && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Updated {article.updatedAt.toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {article.tags.length > 0 && (
            <div className="flex items-center space-x-2">
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

          <Badge variant={article.status === "published" ? "default" : "outline"}>{article.status}</Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{
              __html: article.content
                .replace(/\n/g, "<br>")
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\*(.*?)\*/g, "<em>$1</em>"),
            }}
          />
        </div>
      </ScrollArea>
    </div>
  )
}
