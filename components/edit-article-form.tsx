"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, X, Save, ArrowLeft, AlertCircle } from "lucide-react"
import type { Category, Article, User } from "../types/knowledge-base"

interface EditArticleFormProps {
  article: Article
  categories: Category[]
  currentUser: User | null
  onSubmit: (article: Omit<Article, "createdAt">) => void
  onCancel: () => void
}

export function EditArticleForm({ article, categories, currentUser, onSubmit, onCancel }: EditArticleFormProps) {
  const [title, setTitle] = useState(article.title)
  const [content, setContent] = useState(article.content)
  const [categoryId, setCategoryId] = useState(article.categoryId)
  const [subcategoryId, setSubcategoryId] = useState(article.subcategoryId || "")
  const [tags, setTags] = useState<string[]>(article.tags || [])
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const selectedCategory = categories.find((cat) => cat.id === categoryId)
  const availableSubcategories = selectedCategory?.subcategories || []

  const handleAddTag = () => {
    const trimmedTag = newTag.trim().toLowerCase()
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

  const handleCategoryChange = (newCategoryId: string) => {
    setCategoryId(newCategoryId)
    // Reset subcategory if it doesn't exist in the new category
    const newCategory = categories.find((cat) => cat.id === newCategoryId)
    const subcategoryExists = newCategory?.subcategories?.some((sub) => sub.id === subcategoryId)
    if (!subcategoryExists) {
      setSubcategoryId("")
    }
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
      setError("Please select a category")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const updatedArticle: Omit<Article, "createdAt"> = {
        id: article.id,
        title: title.trim(),
        content: content.trim(),
        categoryId,
        subcategoryId: subcategoryId || undefined,
        tags: tags.length > 0 ? tags : undefined,
        updatedAt: new Date(),
      }

      await onSubmit(updatedArticle)
    } catch (error) {
      console.error("Error updating article:", error)
      setError("Failed to update article. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")

  if (!canEdit) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to edit articles. Please contact an administrator.
          </AlertDescription>
        </Alert>
        <Button variant="ghost" onClick={onCancel} className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Article</h2>
          <p className="text-gray-600 mt-1">Make changes to the article</p>
        </div>
        <Button variant="ghost" onClick={onCancel} className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Article Details</CardTitle>
            <CardDescription>Update the basic information for your article</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <Select value={categoryId} onValueChange={handleCategoryChange} disabled={isSubmitting}>
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

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory (Optional)</Label>
                <Select
                  value={subcategoryId}
                  onValueChange={setSubcategoryId}
                  disabled={isSubmitting || !categoryId || availableSubcategories.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="tags"
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag"
                  disabled={isSubmitting}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTag}
                  disabled={isSubmitting || !newTag.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => handleRemoveTag(tag)}
                        disabled={isSubmitting}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Update the main content of your article</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="content">Article Content *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here..."
                disabled={isSubmitting}
                required
                rows={15}
                className="resize-none"
              />
              <p className="text-sm text-gray-500">
                You can use **bold**, *italic*, and `code` formatting in your content.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
    </div>
  )
}
