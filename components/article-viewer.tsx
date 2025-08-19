"use client"

import { ArrowLeft, Edit, Calendar, User, Tag, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
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
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Article Selected</h3>
          <p className="text-gray-500">Select an article from the sidebar to view its content.</p>
        </div>
      </div>
    )
  }

  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.id === article.authorId)

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 text-gray-900">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3 text-gray-800">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium mb-2 text-gray-700">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code class="text-sm font-mono">$1</code></pre>',
      )
      .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, "<br>")
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center space-x-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{article.title}</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
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
                  <span>{article.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <Badge variant={article.status === "published" ? "default" : "secondary"}>{article.status}</Badge>
                </div>
              </div>
            </div>
          </div>

          {canEdit && (
            <Button onClick={onEdit} size="sm" className="flex items-center space-x-1">
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{
              __html: `<p class="mb-4">${formatContent(article.content)}</p>`,
            }}
          />

          {article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function FileText({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  )
}
