"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Save, ArrowLeft, AlertCircle } from "lucide-react"
import type { Category, Article } from "../types/knowledge-base"

interface AddArticleFormProps {
  categories: Category[]
  onSubmit: (article: Omit<Article, "id" | "createdAt" | "updatedAt">) => Promise<void>
  onCancel: () => void
}

export function AddArticleForm({ categories, onSubmit, onCancel }: AddArticleFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [subcategoryId, setSubcategoryId] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedCategory = categories.find((cat) => cat.id === categoryId)
  const availableSubcategories = selectedCategory?.subcategories || []

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleCategoryChange = (newCategoryId: string) => {
    setCategoryId(newCategoryId)
    setSubcategoryId("") // Reset subcategory when category changes
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    if (!content.trim()) {
      setError("Content is required")
      return
    }

    if (!categoryId) {
      setError("Category is required")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const articleData = {
        title: title.trim(),
        content: content.trim(),
        categoryId,
        subcategoryId: subcategoryId || undefined,
        tags: tags.length > 0 ? tags : undefined,
      }

      await onSubmit(articleData)
    } catch (err) {
      setError("Failed to create article. Please try again.")
      console.error("Error creating article:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
          <p className="text-gray-600">Add a new article to the knowledge base</p>
        </div>
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
          <CardDescription>Fill in the information below to create a new article</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Category Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={categoryId} onValueChange={handleCategoryChange} disabled={isSubmitting} required>
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

              {availableSubcategories.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select value={subcategoryId} onValueChange={setSubcategoryId} disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subcategory (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {availableSubcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex space-x-2">
                <Input
                  id="tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyPress}
                  placeholder="Add tags (press Enter or comma to add)"
                  disabled={isSubmitting}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || isSubmitting}
                  variant="outline"
                  size="icon"
                >
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
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here..."
                disabled={isSubmitting}
                rows={15}
                className="resize-y min-h-[300px]"
                required
              />
              <div className="text-sm text-gray-500">
                {content.length} characters, ~{Math.ceil(content.split(/\s+/).length)} words
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Article...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Article
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
