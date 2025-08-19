"use client"

import { ArrowLeft, Edit, Calendar, User, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Article, Category, User as UserType } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article
  category: Category | undefined
  author: UserType | undefined
  currentUser: UserType | null
  onEdit: () => void
  onBack: () => void
}

export function ArticleViewer({ article, category, author, currentUser, onEdit, onBack }: ArticleViewerProps) {
  const canEdit =
    currentUser &&
    (currentUser.role === "admin" || (currentUser.role === "editor" && currentUser.id === article.authorId))

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {category && <Badge variant="secondary">{category.name}</Badge>}
        </div>

        {canEdit && (
          <Button onClick={onEdit} size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto p-6">
          <article className="prose prose-lg max-w-none">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
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

                {article.updatedAt && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {article.tags.length > 0 && (
                <div className="flex items-center space-x-2 mb-6">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </header>

            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{article.content}</div>
          </article>
        </div>
      </ScrollArea>
    </div>
  )
}
