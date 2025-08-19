"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Calendar, User, Tag } from "lucide-react"
import type { Article, Category, User as UserType } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article
  category?: Category
  author?: UserType
  currentUser: UserType | null
  onEdit: () => void
  onBack?: () => void
}

export function ArticleViewer({ article, category, author, currentUser, onEdit, onBack }: ArticleViewerProps) {
  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.id === article.authorId)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <CardTitle className="text-2xl">{article.title}</CardTitle>
          </div>
          {canEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-500">
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
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap">{article.content}</div>
        </div>
      </CardContent>
    </Card>
  )
}
