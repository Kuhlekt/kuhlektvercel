"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

  const getCategoryPath = (): string => {
    for (const category of categories) {
      // Check if article is in main category
      if (category.articles.some(a => a.id === article.id)) {
        return category.name
      }
      
      // Check if article is in subcategory
      for (const subcategory of category.subcategories) {
        if (subcategory.articles.some(a => a.id === article.id)) {
          return `${category.name} > ${subcategory.name}`
        }
      }
    }
    return "Unknown"
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(article.id)
      setShowDeleteDialog(false)
    }
  }

  const categoryPath = getCategoryPath()

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
          <CardTitle className="text-3xl font-bold mb-4">{article.title}</CardTitle>
          
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 border-b pb-4">
            <div className="flex items-center space-x-1">
              <Folder className="h-4 w-4" />
              <span>{categoryPath}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Created {article.createdAt.toLocaleDateString()}</span>
            </div>
            {article.updatedAt && article.updatedAt.getTime() !== article.createdAt.getTime() && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Updated {article.updatedAt.toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                  <Tag className="h-3 w-3" />
                  <span>{tag}</span>
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
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
