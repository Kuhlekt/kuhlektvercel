"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Plus, Save, AlertTriangle } from "lucide-react"
import type { Article, Category, User } from "../types/knowledge-base"

interface EditArticleModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (articleData: {
    id: string
    title: string
    content: string
    categoryId: string
    tags: string[]
    status: "draft" | "published"
  }) => void
  article: Article
  categories: Category[]
  currentUser: User
}

export function EditArticleModal({
  isOpen,
  onClose,
  onSubmit,
  article,
  categories,
  currentUser,
}: EditArticleModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [newTag, setNewTag] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when article changes or modal opens
  useEffect(() => {
    if (isOpen && article) {
      setTitle(article.title)
      setContent(article.content)
      setCategoryId(article.categoryId)
      setTags([...article.tags])
      setStatus(article.status)
      setNewTag("")
      setError("")
      setIsSubmitting(false)
    }
  }, [isOpen, article])

  const handleAddTag = () => {
    const trimmedTag = newTag.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!title.trim()) {
      setError("Title is required")
      return
    }

    if (!content.trim()) {
      setError("Content is required")
      return
    }

    if (!categoryId) {
      setError("Please select a category")
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        id: article.id,
        title: title.trim(),
        content: content.trim(),
        categoryId,
        tags,
        status,
      })
      onClose()
    } catch (error) {
      setError("Failed to update article. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Save className="h-5 w-5" />
            <span>Edit Article</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Article Metadata */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-600">Article ID</Label>
              <p className="text-sm text-gray-800">{article.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Created By</Label>
              <p className="text-sm text-gray-800">{article.createdBy}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Created</Label>
              <p className="text-sm text-gray-800">{article.createdAt.toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
              <p className="text-sm text-gray-800">{article.updatedAt.toLocaleString()}</p>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title..."
              disabled={isSubmitting}
              className="mt-1"
            />
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-category">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId} disabled={isSubmitting}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={status}
                onValueChange={(value: "draft" | "published") => setStatus(value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="mt-1 space-y-2">
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag..."
                  disabled={isSubmitting}
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddTag} disabled={!newTag.trim() || isSubmitting} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        disabled={isSubmitting}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="edit-content">Content *</Label>
            <Textarea
              id="edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here..."
              disabled={isSubmitting}
              className="mt-1 min-h-[300px]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Article
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
