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
import { Textarea } from "@/components/ui/textarea"

interface EditArticleFormProps {
  article: Article
  categories: Category[]
  onSubmit: (articleData: Omit<Article, "createdAt">) => void
  onCancel: () => void
}

export function EditArticleForm({ article, categories, onSubmit, onCancel }: EditArticleFormProps) {
  const [title, setTitle] = useState(article.title)
  const [content, setContent] = useState(article.content)
  const [selectedCategoryId, setSelectedCategoryId] = useState(article.categoryId)
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(article.subcategoryId || "none")
  const [tags, setTags] = useState(article.tags.join(", "))
  const [showPreview, setShowPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId)
  const availableSubcategories = selectedCategory?.subcategories || []

  // Reset subcategory when category changes
  useEffect(() => {
    if (selectedCategoryId !== article.categoryId) {
      setSelectedSubcategoryId("none")
    }
  }, [selectedCategoryId, article.categoryId])

  // Add useEffect to debug content changes
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
      const updatedArticle = {
        id: article.id,
        title: title.trim(),
        content: content.trim(),
        categoryId: selectedCategoryId,
        subcategoryId: selectedSubcategoryId === "none" ? undefined : selectedSubcategoryId,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        updatedAt: new Date(),
        createdBy: article.createdBy,
      }

      console.log("Submitting updated article:", updatedArticle)
      onSubmit(updatedArticle)
    } catch (error) {
      console.error("Error updating article:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderPreview = () => {
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

        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
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
                  <div className="border rounded-lg">
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your article content here..."
                      className="min-h-[300px] border-0 resize-none focus:ring-0"
                      rows={15}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="preview" className="mt-4">
                  <div className="border rounded-md p-4 min-h-[300px] bg-gray-50">{renderPreview()}</div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="border rounded-lg">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your article content here..."
                  className="min-h-[300px] border-0 resize-none focus:ring-0"
                  rows={15}
                />
              </div>
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
