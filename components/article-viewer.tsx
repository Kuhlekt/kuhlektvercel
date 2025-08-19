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
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-blue-600 font-bold text-xl">KB</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Kuhlekt Knowledge Base</h2>
          <p className="text-gray-600 mb-6">
            Select a category from the sidebar to browse articles, or use the search bar to find specific content.
          </p>
          {!currentUser && (
            <p className="text-sm text-gray-500">
              Login to access additional features like creating and editing articles.
            </p>
          )}
        </div>
      </div>
    )
  }

  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.id === article.authorId)

  return (
    <div className="flex-1 bg-white">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{article.title}</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                {category && (
                  <div className="flex items-center space-x-1">
                    <Tag className="h-4 w-4" />
                    <span>{category.name}</span>
                  </div>
                )}
                {author && (
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{author.username}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{article.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {canEdit && (
            <Button onClick={onEdit} size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{article.content}</div>
          </div>

          {article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
