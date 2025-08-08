"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Edit, Trash2, Calendar, Tag, Folder } from 'lucide-react'
import type { Article, Category } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article
  categories: Category[]
  onBack: () => void
  onEdit?: (article: Article) => void
  onDelete?: (articleId: string) => void
}

export function ArticleViewer({ article, categories, onBack, onEdit, onDelete }: ArticleViewerProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || "Unknown Category"
  }

  const getSubcategoryName = (categoryId: string, subcategoryId?: string) => {
    if (!subcategoryId) return null
    const category = categories.find(c => c.id === categoryId)
    return category?.subcategories.find(s => s.id === subcategoryId)?.name
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(article.id)
      setShowDeleteDialog(false)
    }
  }

  const categoryName = getCategoryName(article.categoryId)
  const subcategoryName = getSubcategoryName(article.categoryId, article.subcategoryId)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Articles
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
          <CardTitle className="text-3xl font-bold">{article.title}</CardTitle>
          
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pt-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Updated {article.updatedAt.toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Folder className="h-4 w-4" />
              <Badge variant="secondary">{categoryName}</Badge>
              {subcategoryName && (
                <Badge variant="outline">{subcategoryName}</Badge>
              )}
            </div>
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex items-center space-x-2 pt-2">
              <Tag className="h-4 w-4 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div 
            className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{article.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
