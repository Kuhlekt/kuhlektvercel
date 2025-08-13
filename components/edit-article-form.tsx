"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, Eye, EyeOff, ArrowLeft, Clock, Edit, User, Hash } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"
import { EnhancedTextarea } from "./enhanced-textarea"
import type { ImageData } from "./enhanced-textarea"

interface EditArticleFormProps {
  article: Article
  categories: Category[]
  currentUser?: { username: string } | null
  onSubmit: (articleData: Omit<Article, "createdAt">) => void
  onCancel: () => void
}

// Function to convert content back to editable format
function convertToEditableContent(content: string): string {
  let editableContent = content

  // Convert <img> tags back to placeholders for editing
  editableContent = editableContent.replace(
    /<img[^>]+src="(data:image[^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi,
    (match, src, alt) => {
      // Try to extract filename from alt text or use generic name
      const filename = alt || "image"
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 5)

      // Store the image data globally for the textarea to access
      if (!(window as any).editingImages) {
        ;(window as any).editingImages = []
      }

      const placeholder = `[IMAGE:${id}:${filename}]`
      ;(window as any).editingImages.push({
        id,
        dataUrl: src,
        name: filename,
        placeholder,
      })

      // Also store in textareaImages for consistency
      if (!(window as any).textareaImages) {
        ;(window as any).textareaImages = []
      }
      ;(window as any).textareaImages.push({
        id,
        dataUrl: src,
        name: filename,
        placeholder,
      })

      return placeholder
    },
  )

  // Convert regular image URLs to placeholders
  editableContent = editableContent.replace(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi, (match, src, alt) => {
    const filename = alt || src.split("/").pop() || "image"
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5)

    // Store URL-based images too
    if (!(window as any).editingImages) {
      ;(window as any).editingImages = []
    }
    if (!(window as any).textareaImages) {
      ;(window as any).textareaImages = []
    }

    const placeholder = `[IMAGE:${id}:${filename}]`
    const imageData = {
      id,
      dataUrl: src.startsWith("http") ? src : src, // Keep URL as is
      name: filename,
      placeholder,
    }
    ;(window as any).editingImages.push(imageData)
    ;(window as any).textareaImages.push(imageData)

    return placeholder
  })

  // Remove other HTML tags but preserve line breaks
  editableContent = editableContent
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<em>(.*?)<\/em>/gi, "*$1*")
    .replace(/<b>(.*?)<\/b>/gi, "**$1**")
    .replace(/<i>(.*?)<\/i>/gi, "*$1*")
    .replace(/<[^>]*>/g, "")

  // Clean up extra whitespace
  editableContent = editableContent.replace(/\n\s*\n\s*\n/g, "\n\n").trim()

  return editableContent
}

// Function to convert editable content back to display format
function convertToDisplayContent(content: string): string {
  let displayContent = content

  // Convert markdown-like formatting to HTML
  displayContent = displayContent
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>")

  // Wrap in paragraphs
  if (displayContent && !displayContent.startsWith("<p>")) {
    displayContent = "<p>" + displayContent + "</p>"
  }

  // Process image placeholders
  displayContent = displayContent.replace(/\[IMAGE:([^:]+):([^\]]+)\]/g, (match, id, filename) => {
    // Check if we have stored images
    const storedImages = (window as any).textareaImages || (window as any).editingImages || []
    const imageData = storedImages.find((img: any) => img.id === id || img.placeholder === match)

    if (imageData && imageData.dataUrl) {
      return `<img src="${imageData.dataUrl}" alt="${filename}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block;" />`
    }

    return `<div style="padding: 20px; border: 2px dashed #ccc; text-align: center; margin: 10px 0; border-radius: 8px; background-color: #f9f9f9;">
    <p style="margin: 0; color: #666;">📷 Image: ${filename}</p>
  </div>`
  })

  // Convert URLs to actual images
  displayContent = displayContent.replace(
    /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg))/gi,
    '<img src="$1" alt="Image" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block;" />',
  )

  // Convert data URLs to images
  displayContent = displayContent.replace(
    /(data:image\/[^;]+;base64,[^\s"'<>]+)/gi,
    '<img src="$1" alt="Embedded Image" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block;" />',
  )

  return displayContent
}

export function EditArticleForm({ article, categories, currentUser, onSubmit, onCancel }: EditArticleFormProps) {
  const [title, setTitle] = useState(article.title)
  const [content, setContent] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState(article.categoryId)
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(article.subcategoryId || "none")
  const [tags, setTags] = useState(article.tags.join(", "))
  const [showPreview, setShowPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<ImageData[]>([])

  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId)
  const availableSubcategories = selectedCategory?.subcategories || []

  // Initialize content for editing
  useEffect(() => {
    const editableContent = convertToEditableContent(article.content)
    setContent(editableContent)

    // Set up initial images from existing content
    const existingImages = (window as any).editingImages || []
    setImages(existingImages)
    ;(window as any).textareaImages = existingImages
  }, [article.content])

  // Reset subcategory when category changes
  useEffect(() => {
    if (selectedCategoryId !== article.categoryId) {
      setSelectedSubcategoryId("none")
    }
  }, [selectedCategoryId, article.categoryId])

  // Debug content changes
  useEffect(() => {
    console.log("Content state changed:", content)
  }, [content])

  useEffect(() => {
    console.log("Title state changed:", title)
  }, [title])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Form submission started")
    console.log("Current form values:", { title, content, selectedCategoryId, selectedSubcategoryId, tags })

    if (!title.trim()) {
      console.error("Title is required")
      return
    }

    if (!content.trim()) {
      console.error("Content is required")
      return
    }

    if (!selectedCategoryId) {
      console.error("Category is required")
      return
    }

    setIsSubmitting(true)

    try {
      // Ensure images are properly stored before conversion
      const currentImages = (window as any).textareaImages || []
      console.log("Current images before submit:", currentImages)

      // Convert content back to display format
      const displayContent = convertToDisplayContent(content)
      console.log("Display content after conversion:", displayContent)

      const updatedArticle = {
        id: article.id,
        title: title.trim(),
        content: displayContent,
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
    setImages(newImages)
  }

  const renderPreview = () => {
    const previewContent = convertToDisplayContent(content)

    return (
      <div className="prose max-w-none">
        <h1 className="text-2xl font-bold mb-4">{title || "Untitled Article"}</h1>

        <div className="flex flex-wrap gap-2 mb-4">
          {selectedCategory && <Badge variant="secondary">{selectedCategory.name}</Badge>}
          {selectedSubcategoryId !== "none" &&
            availableSubcategories.find((sub) => sub.id === selectedSubcategoryId) && (
              <Badge variant="outline">
                {availableSubcategories.find((sub) => sub.id === selectedSubcategoryId)?.name}
              </Badge>
            )}
          {tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
            .map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
        </div>

        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: previewContent }} />
      </div>
    )
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
        <div className="flex items-center space-x-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Article History Info */}
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
            {showPreview ? (
              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="mt-4">
                  <EnhancedTextarea
                    value={content}
                    onChange={setContent}
                    onImagesChange={handleImagesChange}
                    placeholder="Write your article content here..."
                    rows={15}
                  />
                </TabsContent>
                <TabsContent value="preview" className="mt-4">
                  <div className="border rounded-md p-4 min-h-[300px] bg-gray-50">{renderPreview()}</div>
                </TabsContent>
              </Tabs>
            ) : (
              <EnhancedTextarea
                value={content}
                onChange={setContent}
                onImagesChange={handleImagesChange}
                placeholder="Write your article content here..."
                rows={15}
              />
            )}
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
