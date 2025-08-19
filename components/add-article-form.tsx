"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Save, FileText } from "lucide-react"
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
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const [tags, setTags] = useState("")
  const [status, setStatus] = useState<"draft" | "published">("published")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim() || !selectedCategoryId) {
      return
    }

    setIsSubmitting(true)

    try {
      onSubmit({
        title: title.trim(),
        content: content.trim(),
        categoryId: selectedCategoryId,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        status,
      })

      // Reset form
      setTitle("")
      setContent("")
      setSelectedCategoryId("")
      setTags("")
      setStatus("published")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setTitle("")
    setContent("")
    setSelectedCategoryId("")
    setTags("")
    setStatus("published")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Add New Article</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId} required>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: "draft" | "published") => setStatus(value)}>
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

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here..."
              className="min-h-[300px] mt-2"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !content.trim() || !selectedCategoryId || isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Article"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
