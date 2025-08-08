"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Category, Article } from "../types/knowledge-base"
import { RichTextEditor, type ImageData } from "./rich-text-editor"
import { ArrowLeft, Save, ImageIcon } from 'lucide-react'

interface EditArticleFormProps {
  article: Article
  categories: Category[]
  onUpdateArticle: (articleId: string, updates: Partial<Article>) => void
  onCancel: () => void
}

export function EditArticleForm({ article, categories, onUpdateArticle, onCancel }: EditArticleFormProps) {
  const [title, setTitle] = useState(article.title)
  const [content, setContent] = useState(article.content)
  const [categoryId, setCategoryId] = useState(article.categoryId)
  const [subcategoryId, setSubcategoryId] = useState(article.subcategoryId || "")
  const [tags, setTags] = useState(article.tags.join(", "))
  const [showPreview, setShowPreview] = useState(false)
  const [currentImages, setCurrentImages] = useState<ImageData[]>([])

  const selectedCategory = categories.find((cat) => cat.id === categoryId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content || !categoryId) return

    // Content is already in HTML format from the rich text editor
    onUpdateArticle(article.id, {
      title,
      content,
      categoryId,
      subcategoryId: subcategoryId || undefined,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      updatedAt: new Date(),
    })
  }

  // Process content for preview - content is already HTML
  const getPreviewContent = () => {
    return content || ""
  }

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Edit Article</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Article Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter article title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
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

              {selectedCategory && selectedCategory.subcategories.length > 0 && (
                <div>
                  <Label htmlFor="subcategory">Subcategory (Optional)</Label>
                  <Select value={subcategoryId || "none"} onValueChange={setSubcategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subcategory" />
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
                <Label htmlFor="content">Content</Label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  onImagesChange={setCurrentImages}
                  placeholder="Enter article content here..."
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="flex items-center space-x-1">
                  <Save className="h-4 w-4" />
                  <span>Update Article</span>
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="border-l pl-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <ImageIcon className="h-5 w-5" />
                <span>Live Preview</span>
              </h3>

              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                {title && <h4 className="text-xl font-bold mb-3">{title}</h4>}
                {content ? (
                  <div
                    className="prose max-w-none preview-content"
                    style={{
                      lineHeight: "1.6",
                      fontSize: "14px",
                      color: "#374151",
                    }}
                    dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
                  />
                ) : (
                  <div className="text-gray-500 italic">
                    <p>Content preview will appear here...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
