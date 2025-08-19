"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  const [author, setAuthor] = useState("")
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")

  const selectedCategory = categories.find((c) => c.id === categoryId)

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !categoryId) {
      return
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      categoryId,
      subcategoryId: subcategoryId || undefined,
      tags,
      author: author.trim() || undefined,
      status,
      priority,
    })

    // Reset form
    setTitle("")
    setContent("")
    setCategoryId("")
    setSubcategoryId("")
    setTags([])
    setNewTag("")
    setAuthor("")
    setStatus("draft")
    setPriority("medium")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Article</CardTitle>
      </CardHeader>
      <CardContent>
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
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={categoryId}
                onValueChange={(value) => {
                  setCategoryId(value)
                  setSubcategoryId("")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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

            {selectedCategory?.subcategories && selectedCategory.subcategories.length > 0 && (
              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select value={subcategoryId} onValueChange={setSubcategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {selectedCategory.subcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: "draft" | "published" | "archived") => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter article content"
              rows={10}
              required
            />
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-red-600">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Add Article</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
