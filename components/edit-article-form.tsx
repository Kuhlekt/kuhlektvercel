"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Eye, X } from 'lucide-react'
import { EnhancedRichEditor } from "./enhanced-rich-editor"
import type { Article, Category } from "../types/knowledge-base"

interface EditArticleFormProps {
  article: Article
  categories: Category[]
  onSubmit: (article: Omit<Article, "createdAt">) => void
  onCancel: () => void
}

export function EditArticleForm({ article, categories, onSubmit, onCancel }: EditArticleFormProps) {
  const [title, setTitle] = useState(article.title)
  const [content, setContent] = useState(article.content)
  const [selectedCategoryId, setSelectedCategoryId] = useState(article.categoryId)
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(article.subcategoryId || "none")
  const [tags, setTags] = useState<string[]>(article.tags)
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get available subcategories for selected category
  const availableSubcategories = categories.find(cat => cat.id === selectedCategoryId)?.subcategories || []

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubcategoryId("none")
  }, [selectedCategoryId])

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !selectedCategoryId) return

    setIsSubmitting(true)
    
    try {
      const updatedArticle: Omit<Article, "createdAt"> = {
        id: article.id,
        title: title.trim(),
        content: content.trim(),
        categoryId: selectedCategoryId,
        subcategoryId: selectedSubcategoryId === "none" ? undefined : selectedSubcategoryId,
        tags,
        updatedAt: new Date(),
      }

      onSubmit(updatedArticle)
    } catch (error) {
      console.error("Error updating article:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Edit Article</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Article Details */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Label htmlFor="category">Category *</Label>
                  <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
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

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      id="tags"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a tag"
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-red-500"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Updating..." : "Update Article"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="editor" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="preview">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="editor" className="mt-4">
                    <EnhancedRichEditor
                      value={content}
                      onChange={setContent}
                      placeholder="Write your article content here..."
                    />
                  </TabsContent>
                  
                  <TabsContent value="preview" className="mt-4">
                    <div className="border rounded-lg p-4 min-h-[400px] bg-white">
                      <div className="prose max-w-none">
                        <h1 className="text-2xl font-bold mb-4">{title || "Article Title"}</h1>
                        <div dangerouslySetInnerHTML={{ __html: content || "<p>No content yet...</p>" }} />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
