"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Category, User } from "../types/knowledge-base"

interface AddArticleFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (articleData: {
    title: string
    content: string
    categoryId: string
    tags: string[]
    status: "draft" | "published"
  }) => void
  categories: Category[]
  currentUser: User
}

export function AddArticleForm({ isOpen, onClose, onSubmit, categories, currentUser }: AddArticleFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [tags, setTags] = useState("")
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !categoryId) return

    setIsSubmitting(true)

    try {
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      onSubmit({
        title: title.trim(),
        content: content.trim(),
        categoryId,
        tags: tagArray,
        status,
      })

      // Reset form
      setTitle("")
      setContent("")
      setCategoryId("")
      setTags("")
      setStatus("draft")
    } catch (error) {
      console.error("Error creating article:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setTitle("")
    setContent("")
    setCategoryId("")
    setTags("")
    setStatus("draft")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Article</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required disabled={isSubmitting}>
                <SelectTrigger>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here... (Markdown supported)"
              className="min-h-[300px] font-mono"
              required
              disabled={isSubmitting}
            />
            <p className="text-sm text-gray-500">
              Tip: You can use Markdown formatting (# for headers, **bold**, *italic*, etc.)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value: "draft" | "published") => setStatus(value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim() || !content.trim() || !categoryId}>
              {isSubmitting ? "Creating..." : "Create Article"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
