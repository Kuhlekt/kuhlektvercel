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
import { Save, Eye, EyeOff, ArrowLeft } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"
import { EnhancedTextarea } from "./enhanced-textarea"
import type { ImageData } from "./enhanced-textarea"

interface AddArticleFormProps {
  categories: Category[]
  onSubmit: (articleData: Omit<Article, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

// Function to convert editable content to display format with proper image handling
function convertToDisplayContent(content: string, availableImages: ImageData[] = []): string {
  let displayContent = content

  console.log("Converting content to display:", content)
  console.log("Available images for conversion:", availableImages)

  // Process image placeholders FIRST before any other processing
  displayContent = displayContent.replace(/\[IMAGE:([^:]+):([^\]]+)\]/g, (match, id, filename) => {
    console.log("Processing image placeholder:", { match, id, filename })

    // Check available images first (from current editing session)
    let imageData = availableImages.find((img) => img.id === id || img.placeholder === match)

    // If not found, check global storage
    if (!imageData) {
      const storedImages = (window as any).textareaImages || []
      imageData = storedImages.find((img: any) => img.id === id || img.placeholder === match)
    }

    console.log("Found image data:", imageData)

    if (imageData && imageData.dataUrl) {
      const imgTag = `<img src="${imageData.dataUrl}" alt="${filename}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block;" />`
      console.log("Generated img tag:", imgTag)
      return imgTag
    }

    console.log("No image data found, returning placeholder")
    return `<div style="padding: 20px; border: 2px dashed #ccc; text-align: center; margin: 10px 0; border-radius: 8px; background-color: #f9f9f9;">
      <p style="margin: 0; color: #666;">📷 Image: ${filename}</p>
    </div>`
  })

  // Convert markdown-like formatting to HTML
  displayContent = displayContent
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>")

  // Wrap in paragraphs if needed
  if (displayContent && !displayContent.startsWith("<p>") && !displayContent.includes("<img")) {
    displayContent = "<p>" + displayContent + "</p>"
  } else if (displayContent && !displayContent.startsWith("<p>")) {
    // Handle mixed content with images
    displayContent = displayContent.replace(/^([^<]+)/, "<p>$1</p>")
  }

  // Convert standalone URLs to actual images
  displayContent = displayContent.replace(
    /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg))/gi,
    '<img src="$1" alt="Image" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block;" />',
  )

  // Convert standalone data URLs to images
  displayContent = displayContent.replace(
    /(data:image\/[^;]+;base64,[^\s"'<>]+)/gi,
    '<img src="$1" alt="Embedded Image" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block;" />',
  )

  console.log("Final display content:", displayContent)
  return displayContent
}

export function AddArticleForm({ categories, onSubmit, onCancel }: AddArticleFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("none")
  const [tags, setTags] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<ImageData[]>([])

  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId)
  const availableSubcategories = selectedCategory?.subcategories || []

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubcategoryId("none")
  }, [selectedCategoryId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      return
    }

    if (!content.trim()) {
      return
    }

    if (!selectedCategoryId) {
      return
    }

    setIsSubmitting(true)

    try {
      // Convert content to display format with current images
      const displayContent = convertToDisplayContent(content, images)

      const articleData = {
        title: title.trim(),
        content: displayContent,
        categoryId: selectedCategoryId,
        subcategoryId: selectedSubcategoryId === "none" ? undefined : selectedSubcategoryId,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        createdBy: "admin", // This should come from current user context
        editCount: 0,
      }

      onSubmit(articleData)
    } catch (error) {
      console.error("Error creating article:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImagesChange = (newImages: ImageData[]) => {
    console.log("Images changed in add form:", newImages)
    setImages(newImages)
  }

  const renderPreview = () => {
    const previewContent = convertToDisplayContent(content, images)

    console.log("Rendering add form preview with content:", content)
    console.log("Using images:", images)
    console.log("Preview HTML:", previewContent)

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
          <CardTitle>Add New Article</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
        </div>
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
              {isSubmitting ? "Creating..." : "Create Article"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
