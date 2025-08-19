"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Calendar, User, Tag, FolderOpen, FileText } from "lucide-react"
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
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center space-y-4 max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">No Article Selected</h3>
            <p className="text-gray-600">
              Select an article from the sidebar to view its content, or create a new article to get started.
            </p>
          </div>
          {currentUser && (currentUser.role === "admin" || currentUser.role === "editor") && (
            <div className="pt-4">
              <p className="text-sm text-gray-500">You have permission to create and edit articles.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-shrink-0 border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FolderOpen className="w-4 h-4" />
              {category?.name || "Uncategorized"}
            </div>
          </div>
          {canEdit && (
            <Button onClick={onEdit} size="sm" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardHeader className="space-y-4">
              <div className="space-y-3">
                <CardTitle className="text-3xl font-bold leading-tight">{article.title}</CardTitle>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{author?.username || "Unknown Author"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{article.createdAt.toLocaleDateString()}</span>
                  </div>
                  <Badge variant={article.status === "published" ? "default" : "secondary"}>{article.status}</Badge>
                </div>

                {article.tags && article.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-gray-400" />
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
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: article.content.replace(/\n/g, "<br />"),
                }}
              />
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
