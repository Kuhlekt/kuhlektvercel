"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Edit, Calendar, User, Tag } from "lucide-react"
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
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
            <User className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Article Selected</h3>
          <p className="text-gray-600 max-w-sm">
            Select an article from the category tree to view its content, or create a new article to get started.
          </p>
        </div>
      </div>
    )
  }

  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            {category && (
              <Badge variant="secondary" className="text-xs">
                {category.name}
              </Badge>
            )}
          </div>
          {canEdit && (
            <Button onClick={onEdit} size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{author?.username || article.createdBy || "Unknown"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{article.createdAt.toLocaleDateString()}</span>
              </div>
              {article.updatedAt.getTime() !== article.createdAt.getTime() && (
                <div className="flex items-center space-x-1">
                  <span>Updated: {article.updatedAt.toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {article.tags.length > 0 && (
              <div className="flex items-center space-x-2 mb-6">
                <Tag className="h-4 w-4 text-gray-400" />
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

          <div className="prose prose-gray max-w-none">
            <div
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: article.content.replace(/\n/g, "<br />"),
              }}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
