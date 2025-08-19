"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
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
  const [subcategoryId, setSubcategoryId] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedCategory = categories.find((c) => c.id === categoryId)
  const subcategories = selectedCategory?.subcategories || []

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim() || !categoryId) {
      return
    }

    setIsSubmitting(true)

    try {
      const articleData: Omit<Article, "id" | "createdAt" | "updatedAt"> = {
        title: title.trim(),
        content: content.trim(),
        categoryId,
        subcategoryId: subcategoryId || undefined,
        tags,
        author: "Current User", // You might want to use actual user info
        status: "published",
      }

      onSubmit(articleData)

      // Reset form
      setTitle("")
      setContent("")
      setCategoryId("")
      setSubcategoryId("")
      setTags([])
      setNewTag("")
    } catch (error) {
      console.error("Error creating article:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCategoryChange = (value: string) => {
    setCategoryId(value)
    setSubcategoryId("") // Reset subcategory when category changes
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Article</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Article Title *</Label>
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
          </div>

          {subcategories.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory (Optional)</Label>
              <Select value={subcategoryId} onValueChange={setSubcategoryId} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {subcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter article content..."
              className="min-h-[300px]"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                disabled={isSubmitting}
              />
              <Button type="button" onClick={handleAddTag} variant="outline" disabled={isSubmitting}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim() || !content.trim() || !categoryId}>
              {isSubmitting ? "Creating..." : "Create Article"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
