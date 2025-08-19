"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Calendar, User, Tag } from "lucide-react"
import type { Article, Category, User as UserType } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article
  category?: Category | null
  author?: UserType | null
  currentUser: UserType | null
  onEdit: () => void
  onBack: () => void
}

export function ArticleViewer({ article, category, author, currentUser, onEdit, onBack }: ArticleViewerProps) {
  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.id === article.authorId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Articles</span>
        </Button>

        {canEdit && (
          <Button onClick={onEdit} className="flex items-center space-x-2">
            <Edit className="h-4 w-4" />
            <span>Edit Article</span>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div>
              <CardTitle className="text-2xl mb-2">{article.title}</CardTitle>
              {category && (
                <Badge variant="secondary" className="flex items-center space-x-1 w-fit">
                  <span>{category.name}</span>
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Created {new Date(article.createdAt).toLocaleDateString()}</span>
              </div>

              {author && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>By {author.username}</span>
                </div>
              )}

              <Badge variant={article.status === "published" ? "default" : "secondary"}>{article.status}</Badge>
            </div>

            {article.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-gray-500" />
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
