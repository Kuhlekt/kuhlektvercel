"use client"

import { CardDescription } from "@/components/ui/card"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Save, ArrowLeft } from "lucide-react"
import { apiDatabase } from "../utils/api-database"
import type { Category, User, KnowledgeBaseData } from "../types/knowledge-base"

interface AddArticleFormProps {
  categories: Category[]
  currentUser: User
  onArticleAdded: (data: KnowledgeBaseData) => void
  onCancel: () => void
}

export function AddArticleForm({ categories = [], currentUser, onArticleAdded, onCancel }: AddArticleFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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

      // Create new article
      const newArticle = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: title.trim(),
        content: content.trim(),
        categoryId,
        author: currentUser.username,
        tags,
        isPublished,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Add article to the appropriate category
      const updatedCategories = currentData.categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            articles: [...(category.articles || []), newArticle],
          }
        }
        return category
      })

      // Create audit log entry
      const auditEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        action: "create_article",
        performedBy: currentUser.username,
        timestamp: new Date().toISOString(),
        details: `Created article "${title}" in category "${safeCategories.find((c) => c.id === categoryId)?.name || "Unknown"}"`,
      }

      const updatedData = {
        ...currentData,
        categories: updatedCategories,
        articles: [...(currentData.articles || []), newArticle],
        auditLog: [...(currentData.auditLog || []), auditEntry],
      }

      // Save to database
      await apiDatabase.saveData(updatedData)

      // Notify parent component
      onArticleAdded(updatedData)

      console.log("✅ Article created successfully:", newArticle.title)
    } catch (error) {
      console.error("❌ Failed to create article:", error)
      alert("Failed to create article. Please try again.")
    } finally {
      setIsSaving(false)
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
          <form className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                disabled={isSaving}
                required
              />
            </div>

            {/* Category Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId} disabled={isSaving} required>
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
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex space-x-2">
                <Input
                  id="tags"
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Add tags (press Enter to add)"
                  disabled={isSaving}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!newTag.trim() || isSaving}
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
                        disabled={isSaving}
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
                disabled={isSaving}
                rows={15}
                className="resize-y min-h-[300px]"
                required
              />
              <div className="text-sm text-gray-500">
                {content.length} characters, ~{Math.ceil(content.split(/\s+/).length)} words
              </div>
            </div>

            {/* Publish Status */}
            <div className="flex items-center space-x-2">
              <Switch id="published" checked={isPublished} onCheckedChange={setIsPublished} />
              <Label htmlFor="published">{isPublished ? "Published" : "Save as Draft"}</Label>
            </div>

            {/* Author Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Author:</strong> {currentUser.username}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Created:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-4">
              <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving Article...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Article
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
