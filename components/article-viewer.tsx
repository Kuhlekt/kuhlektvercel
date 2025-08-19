"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Edit, Calendar, User, Tag, Folder } from "lucide-react"
import type { Article, Category, User as UserType } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article
  category?: Category
  author?: UserType
  currentUser: UserType | null
  onEdit: () => void
  onBack: () => void
}

export function ArticleViewer({ article, category, author, currentUser, onEdit, onBack }: ArticleViewerProps) {
  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{article.title}</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>Updated {article.updatedAt.toLocaleDateString()}</span>
                </div>
                {author && (
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>by {author.username}</span>
                  </div>
                )}
                {category && (
                  <div className="flex items-center space-x-1">
                    <Folder className="h-3 w-3" />
                    <span>{category.name}</span>
                  </div>
                )}
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

        {article.tags.length > 0 && (
          <div className="flex items-center space-x-2 mt-4">
            <Tag className="h-4 w-4 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </ScrollArea>
    </div>
  )
}
