"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, User, Edit, Tag, FileText } from "lucide-react"
import type { Article, User as UserType } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article | null
  currentUser: UserType | null
  onEdit?: (article: Article) => void
}

export function ArticleViewer({ article, currentUser, onEdit }: ArticleViewerProps) {
  if (!article) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 max-w-md">
          <FileText className="h-16 w-16 mx-auto text-gray-300" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Article Selected</h3>
            <p className="text-gray-500">Select an article from the category tree to view its content.</p>
            {currentUser && (currentUser.role === "admin" || currentUser.role === "editor") && (
              <p className="text-sm text-gray-400 mt-2">You can create new articles using the "Add Article" button.</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")

  return (
    <div className="flex-1 flex flex-col">
      {/* Article Header */}
      <div className="border-b bg-white p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{article.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>By {article.createdBy}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Created {article.createdAt.toLocaleDateString()}</span>
              </div>
              {article.updatedAt.getTime() !== article.createdAt.getTime() && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {article.updatedAt.toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={article.status === "published" ? "default" : "secondary"}>{article.status}</Badge>
            {canEdit && onEdit && (
              <Button onClick={() => onEdit(article)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex items-center space-x-2 mt-4">
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

      {/* Article Content */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap" style={{ wordBreak: "break-word" }}>
              {article.content}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
