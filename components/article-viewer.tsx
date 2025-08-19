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
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Kuhlekt Knowledge Base</h2>
          <p className="text-gray-600 mb-4">Select an article from the sidebar to start reading</p>
          {!currentUser && (
            <p className="text-sm text-gray-500">Login to access additional features and create content</p>
          )}
        </div>
      </div>
    )
  }

  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.id === article.authorId)

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{article.title}</h1>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                {category && (
                  <div className="flex items-center space-x-1">
                    <Tag className="h-3 w-3" />
                    <span>{category.name}</span>
                  </div>
                )}
                {author && (
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{author.username}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{article.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {canEdit && (
            <Button onClick={onEdit} size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>

        {article.tags.length > 0 && (
          <div className="flex items-center space-x-2 mt-3">
            <span className="text-sm text-gray-500">Tags:</span>
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
            {article.content.split("\n").map((line, index) => {
              if (line.startsWith("# ")) {
                return (
                  <h1 key={index} className="text-3xl font-bold mb-4 mt-6">
                    {line.substring(2)}
                  </h1>
                )
              }
              if (line.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-2xl font-semibold mb-3 mt-5">
                    {line.substring(3)}
                  </h2>
                )
              }
              if (line.startsWith("### ")) {
                return (
                  <h3 key={index} className="text-xl font-semibold mb-2 mt-4">
                    {line.substring(4)}
                  </h3>
                )
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={index} className="ml-4">
                    {line.substring(2)}
                  </li>
                )
              }
              if (line.trim() === "") {
                return <br key={index} />
              }
              if (line.includes("**") && line.includes("**")) {
                const parts = line.split("**")
                return (
                  <p key={index} className="mb-2">
                    {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
                  </p>
                )
              }
              if (line.includes("*") && line.includes("*")) {
                const parts = line.split("*")
                return (
                  <p key={index} className="mb-2">
                    {parts.map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : part))}
                  </p>
                )
              }
              if (line.startsWith("```")) {
                return (
                  <pre key={index} className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                    <code>{line.substring(3)}</code>
                  </pre>
                )
              }
              return (
                <p key={index} className="mb-2">
                  {line}
                </p>
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
