"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Plus, X, Trash2 } from "lucide-react"
import { apiDatabase } from "../utils/api-database"
import type { Article, Category, User, KnowledgeBaseData } from "../types/knowledge-base"

interface EditArticleFormProps {
  article: Article
  categories: Category[]
  currentUser: User
  onArticleUpdated: (data: KnowledgeBaseData) => void
  onCancel: () => void
}

export function EditArticleForm({
  article,
  categories = [],
  currentUser,
  onArticleUpdated,
  onCancel,
}: EditArticleFormProps) {
  const [title, setTitle] = useState(article.title)
  const [content, setContent] = useState(article.content)
  const [categoryId, setCategoryId] = useState(article.categoryId)
  const [tags, setTags] = useState<string[]>(article.tags || [])
  const [newTag, setNewTag] = useState("")
  const [isPublished, setIsPublished] = useState(article.isPublished)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const safeCategories = Array.isArray(categories) ? categories : []

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
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

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !categoryId) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setIsSaving(true)

      // Load current data
      const currentData = await apiDatabase.loadData()

      // Update article
      const updatedArticle = {
        ...article,
        title: title.trim(),
        content: content.trim(),
        categoryId,
        tags,
        isPublished,
        updatedAt: new Date().toISOString(),
      }

      // Update categories - remove from old category and add to new one
      const updatedCategories = currentData.categories.map((category) => {
        // Remove from old category
        if (category.id === article.categoryId) {
          return {
            ...category,
            articles: (category.articles || []).filter((a) => a.id !== article.id),
          }
        }
        // Add to new category
        if (category.id === categoryId) {
          const existingArticles = category.articles || []
          const articleExists = existingArticles.some((a) => a.id === article.id)
          return {
            ...category,
            articles: articleExists
              ? existingArticles.map((a) => (a.id === article.id ? updatedArticle : a))
              : [...existingArticles, updatedArticle],
          }
        }
        return category
      })

      // Update articles array
      const updatedArticles = (currentData.articles || []).map((a) => (a.id === article.id ? updatedArticle : a))

      // Create audit log entry
      const auditEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        action: "update_article",
        performedBy: currentUser.username,
        timestamp: new Date().toISOString(),
        details: `Updated article "${title}"`,
      }

      const updatedData = {
        ...currentData,
        categories: updatedCategories,
        articles: updatedArticles,
        auditLog: [...(currentData.auditLog || []), auditEntry],
      }

      // Save to database
      await apiDatabase.saveData(updatedData)

      // Notify parent component
      onArticleUpdated(updatedData)

      console.log("✅ Article updated successfully:", updatedArticle.title)
    } catch (error) {
      console.error("❌ Failed to update article:", error)
      alert("Failed to update article. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${article.title}"? This action cannot be undone.`)) {
      return
    }

    try {
      setIsDeleting(true)

      // Load current data
      const currentData = await apiDatabase.loadData()

      // Remove article from categories
      const updatedCategories = currentData.categories.map((category) => ({
        ...category,
        articles: (category.articles || []).filter((a) => a.id !== article.id),
      }))

      // Remove from articles array
      const updatedArticles = (currentData.articles || []).filter((a) => a.id !== article.id)

      // Create audit log entry
      const auditEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        action: "delete_article",
        performedBy: currentUser.username,
        timestamp: new Date().toISOString(),
        details: `Deleted article "${article.title}"`,
      }

      const updatedData = {
        ...currentData,
        categories: updatedCategories,
        articles: updatedArticles,
        auditLog: [...(currentData.auditLog || []), auditEntry],
      }

      // Save to database
      await apiDatabase.saveData(updatedData)

      // Notify parent component
      onArticleUpdated(updatedData)

      console.log("✅ Article deleted successfully:", article.title)
    } catch (error) {
      console.error("❌ Failed to delete article:", error)
      alert("Failed to delete article. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onCancel} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        <div className="flex items-center space-x-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>{isDeleting ? "Deleting..." : "Delete"}</span>
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </Button>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Article</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title..."
              className="text-lg"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {safeCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here..."
              className="min-h-[300px] resize-y"
            />
            <p className="text-sm text-gray-500">
              You can use basic Markdown formatting (# for headers, - for lists, etc.)
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag..."
                className="flex-1"
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Publish Status */}
          <div className="flex items-center space-x-2">
            <Switch id="published" checked={isPublished} onCheckedChange={setIsPublished} />
            <Label htmlFor="published">{isPublished ? "Published" : "Save as Draft"}</Label>
          </div>

          {/* Article Info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Original Author:</strong> {article.author}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Created:</strong> {new Date(article.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Last Updated:</strong> {new Date(article.updatedAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Views:</strong> {article.views || 0}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
