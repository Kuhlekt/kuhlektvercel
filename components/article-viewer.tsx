"use client"

import { Calendar, User, Tag, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Article, Category, User as UserType } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article
  category: Category | undefined
  author: UserType | undefined
  currentUser: UserType | null
  onEdit: (article: Article) => void
}

export function ArticleViewer({ article, category, author, currentUser, onEdit }: ArticleViewerProps) {
  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.id === article.authorId)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{article.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
            {author && (
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{author.username}</span>
              </div>
            )}
            {category && <Badge variant="secondary">{category.name}</Badge>}
          </div>
        </div>
        {canEdit && (
          <Button onClick={() => onEdit(article)} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )}
      </div>

      <div className="prose max-w-none mb-6">
        <div className="whitespace-pre-wrap text-gray-700">{article.content}</div>
      </div>

      {article.tags.length > 0 && (
        <div className="flex items-center space-x-2">
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
  )
}
