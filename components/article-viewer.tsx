"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Calendar, User, Tag } from "lucide-react"
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
  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.id === article.authorId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        {canEdit && (
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Article
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <CardTitle className="text-2xl">{article.title}</CardTitle>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
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

              <Badge variant={article.status === "published" ? "default" : "secondary"}>{article.status}</Badge>
            </div>

            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{article.content}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
