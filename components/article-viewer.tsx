"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit, Trash2, ArrowLeft, Calendar, User, Tag } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article
  categories: Category[]
  onEdit?: (article: Article) => void
  onDelete?: (articleId: string) => void
  onBack: () => void
}

export function ArticleViewer({ article, categories, onEdit, onDelete, onBack }: ArticleViewerProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const category = categories.find((cat) => cat.id === article.categoryId)
  const subcategory = category?.subcategories.find((sub) => sub.id === article.subcategoryId)

  const handleDelete = () => {
    if (onDelete) {
      onDelete(article.id)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Articles</span>
        </Button>

        {(onEdit || onDelete) && (
          <div className="flex space-x-2">
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(article)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Article Content */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <CardTitle className="text-2xl">{article.title}</CardTitle>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {article.createdBy && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>By {article.createdBy}</span>
                </div>
              )}
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

            {/* Categories and Tags */}
            <div className="flex flex-wrap gap-2">
              {category && <Badge variant="secondary">{category.name}</Badge>}
              {subcategory && <Badge variant="outline">{subcategory.name}</Badge>}
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent aria-describedby="delete-article-description">
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription id="delete-article-description">
              Are you sure you want to delete "{article.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
