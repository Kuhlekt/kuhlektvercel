"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, ArrowLeft, Clock, Edit, User, Hash } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"
import { WysiwygEditor } from "./wysiwyg-editor"
import type { ImageData } from "./wysiwyg-editor"

interface EditArticleFormProps {
  article: Article
  categories: Category[]
  currentUser?: { username: string } | null
  onSubmit: (articleData: Omit<Article, "createdAt">) => void
  onCancel: () => void
}

export function EditArticleForm({ article, categories, currentUser, onSubmit, onCancel }: EditArticleFormProps) {
  const [title, setTitle] = useState(article.title)
  const [content, setContent] = useState(article.content)
  const [selectedCategoryId, setSelectedCategoryId] = useState(article.categoryId)
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(article.subcategoryId || "none")
  const [tags, setTags] = useState(article.tags.join(", "))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<ImageData[]>([])

  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId)
  const availableSubcategories = selectedCategory?.subcategories || []

  // Initialize content and extract existing images
  useEffect(() => {
    console.log("Initializing edit form with article:", article.title)

    // Extract existing images from content
    const existingImages: ImageData[] = []
    let processedContent = article.content

    // Look for existing img tags and convert them to our format
    processedContent = processedContent.replace(
      /<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi,
      (match, src, alt) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 5)
        const filename = alt || "image"

        existingImages.push({
          id,
          dataUrl: src,
          name: filename,
          placeholder: `[IMAGE:${id}:${filename}]`,
        })

        return match // Keep the original img tag for WYSIWYG editor
      },
    )

    setContent(processedContent)
    setImages(existingImages)

    // Set global images for other components to access
    ;(window as any).textareaImages = existingImages
    ;(window as any).editingImages = existingImages

    console.log("Initialized with images:", existingImages)
  }, [article])

  // Reset subcategory when category changes
  useEffect(() => {
    if (selectedCategoryId !== article.categoryId) {
      setSelectedSubcategoryId("none")
    }
  }, [selectedCategoryId, article.categoryId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim() || !selectedCategoryId) {
      return
    }

    setIsSubmitting(true)

    try {
      const updatedArticle = {
        id: article.id,
        title: title.trim(),
        content: content, // Content is already in HTML format from WYSIWYG editor
        categoryId: selectedCategoryId,
        subcategoryId: selectedSubcategoryId === "none" ? undefined : selectedSubcategoryId,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        updatedAt: new Date(),
        createdBy: article.createdBy,
        editCount: (article.editCount || 0) + 1,
        lastEditedBy: currentUser?.username || "anonymous",
      }

      console.log("Submitting updated article:", updatedArticle)
      onSubmit(updatedArticle)
    } catch (error) {
      console.error("Error updating article:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImagesChange = (newImages: ImageData[]) => {
    console.log("Images changed in edit form:", newImages)
    setImages(newImages)
    ;(window as any).textareaImages = newImages
    ;(window as any).editingImages = newImages
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Edit Article</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <Alert className="mb-6">
          <Edit className="h-4 w-4" />
          <AlertDescription>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Created: {article.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Last Updated: {article.updatedAt.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Hash className="h-3 w-3" />
                <span>Edit Count: {article.editCount || 0}</span>
              </div>
              {article.lastEditedBy && (
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>Last Edited By: {article.lastEditedBy}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>Created By: {article.createdBy}</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>

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
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {availableSubcategories.length > 0 && (
              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select value={selectedSubcategoryId} onValueChange={setSelectedSubcategoryId}>
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

          <div>
            <Label htmlFor="content">Content *</Label>
            <WysiwygEditor
              value={content}
              onChange={setContent}
              onImagesChange={handleImagesChange}
              placeholder="Write your article content here..."
              className="mt-2"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !content.trim() || !selectedCategoryId || isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
