"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Save, ArrowLeft, AlertTriangle } from "lucide-react"
import type { Category, Article } from "../types/knowledge-base"

interface AddArticleFormProps {
  categories: Category[]
  onSubmit: (article: Omit<Article, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

export function AddArticleForm({ categories, onSubmit, onCancel }: AddArticleFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddTag = () => {
    const tag = newTag.trim().toLowerCase()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
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

    if (!title.trim() || !content.trim() || !categoryId) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const articleData: Omit<Article, "id" | "createdAt" | "updatedAt"> = {
        title: title.trim(),
        content: content.trim(),
        categoryId,
        tags: tags.length > 0 ? tags : undefined,
      }

      await onSubmit(articleData)
    } catch (error) {
      console.error("Error creating article:", error)
      setError("Failed to create article. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Get all available categories and subcategories
  const getAllCategories = () => {
    const options: { id: string; name: string }[] = []

    categories.forEach((category) => {
      options.push({ id: category.id, name: category.name })

      if (category.subcategories) {
        category.subcategories.forEach((subcategory) => {
          options.push({
            id: subcategory.id,
            name: `${category.name} > ${subcategory.name}`,
          })
        })
      }
    })

    return options
  }

  const categoryOptions = getAllCategories()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Article</h1>
          <p className="text-gray-600 mt-2">Create a new article for the knowledge base</p>
        </div>
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                disabled={isLoading}
                className="mt-1"
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId} disabled={isLoading}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="mt-1 space-y-2">
                <div className="flex space-x-2">
                  <Input
                    id="tags"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag"
                    disabled={isLoading}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag} disabled={!newTag.trim() || isLoading}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-600"
                          disabled={isLoading}
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
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here..."
                disabled={isLoading}
                className="mt-1 min-h-[300px]"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !title.trim() || !content.trim() || !categoryId}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Creating..." : "Create Article"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
