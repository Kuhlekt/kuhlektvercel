"use client"
import type { Article, Category, User } from "../types"
import { Button } from "./Button"
import { Edit, Trash2 } from "react-feather"

interface ArticleViewerProps {
  article: Article
  categories: Category[]
  onBack: () => void
  backButtonText: string
  onEdit: (article: Article) => void
  onDelete: (articleId: string) => void
  currentUser?: User | null
}

export function ArticleViewer({
  article,
  categories,
  onBack,
  backButtonText,
  onEdit,
  onDelete,
  currentUser,
}: ArticleViewerProps) {
  return (
    <div>
      <Button onClick={onBack} variant="outline" size="sm">
        {backButtonText}
      </Button>
      <div>
        <h1>{article.title}</h1>
        <p>{article.content}</p>
        <div>
          {categories.map((category) => (
            <span key={category.id}>{category.name}</span>
          ))}
        </div>
      </div>
      {currentUser?.role === "admin" && (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(article)} className="flex items-center space-x-1">
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(article.id)}
            className="flex items-center space-x-1 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      )}
    </div>
  )
}
