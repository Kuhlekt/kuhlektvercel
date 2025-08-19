"use client"

import { ArrowLeft, Edit, Calendar, User, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
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
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {canEdit && (
            <Button onClick={onEdit} size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

        <div className="flex items-center space-x-6 text-sm text-gray-600">
          {category && (
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              {category.name}
            </div>
          )}
          {author && (
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {author.username}
            </div>
          )}
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {article.createdAt.toLocaleDateString()}
          </div>
        </div>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br>") }} />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
