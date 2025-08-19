"use client"

import { ArrowLeft, Edit, Calendar, User, Tag } from "lucide-react"
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
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Article Selected</h3>
          <p className="text-gray-500">Select an article from the category tree to view its content.</p>
        </div>
      </div>
    )
  }

  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")

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
              {category && <p className="text-sm text-gray-500 mt-1">in {category.name}</p>}
            </div>
          </div>

          {canEdit && (
            <Button onClick={onEdit} size="sm" className="flex items-center space-x-1">
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>By {author?.username || article.createdBy}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{article.createdAt.toLocaleDateString()}</span>
          </div>
          <Badge variant={article.status === "published" ? "default" : "secondary"}>{article.status}</Badge>
        </div>

        {article.tags.length > 0 && (
          <div className="flex items-center space-x-2 mt-3">
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

      <ScrollArea className="flex-1">
        <div className="p-6">
          <div className="prose max-w-none">
            {article.content.split("\n").map((line, index) => {
              if (line.startsWith("# ")) {
                return (
                  <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4 first:mt-0">
                    {line.substring(2)}
                  </h1>
                )
              }
              if (line.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-2xl font-semibold text-gray-900 mt-6 mb-3">
                    {line.substring(3)}
                  </h2>
                )
              }
              if (line.startsWith("### ")) {
                return (
                  <h3 key={index} className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                    {line.substring(4)}
                  </h3>
                )
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={index} className="ml-4 mb-1">
                    {line.substring(2)}
                  </li>
                )
              }
              if (line.startsWith("```")) {
                return (
                  <pre key={index} className="bg-gray-100 p-4 rounded-md overflow-x-auto my-4">
                    <code>{line}</code>
                  </pre>
                )
              }
              if (line.trim() === "") {
                return <br key={index} />
              }

              // Handle bold and italic text
              let processedLine = line
              processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              processedLine = processedLine.replace(/\*(.*?)\*/g, "<em>$1</em>")
              processedLine = processedLine.replace(
                /`(.*?)`/g,
                '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>',
              )

              return (
                <p
                  key={index}
                  className="mb-4 text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: processedLine }}
                />
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
