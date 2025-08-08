"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Eye, Edit3, X } from 'lucide-react'
import { EnhancedRichEditor } from './enhanced-rich-editor'
import type { Article, Category } from "../types/knowledge-base"

interface AddArticleFormProps {
  categories: Category[]
  onSave: (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

export function AddArticleForm({ categories, onSave, onCancel }: AddArticleFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("none")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [activeTab, setActiveTab] = useState('edit')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get available subcategories for selected category
  const availableSubcategories = categories.find(c => c.id === selectedCategoryId)?.subcategories || []

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubcategoryId("none")
  }, [selectedCategoryId])

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
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
    
    if (!title.trim() || !content.trim() || !selectedCategoryId) {
      return
    }

    setIsSubmitting(true)

    try {
      const articleData = {
        title: title.trim(),
        content: content.trim(),
        categoryId: selectedCategoryId,
        subcategoryId: selectedSubcategoryId === "none" ? undefined : selectedSubcategoryId,
        tags,
        author: 'Current User' // This should come from auth context
      }

      onSave(articleData)
    } catch (error) {
      console.error('Error creating article:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to render content as HTML for preview
  const renderPreview = () => {
    return { __html: content }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Articles
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Add New Article</h1>
            <p className="text-gray-600 mt-2">Create a new article for your knowledge base</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Article Details</CardTitle>
            <CardDescription>
              Provide the basic information for your new article
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
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
                <Label htmlFor="subcategory">Subcategory (Optional)</Label>
                <Select value={selectedSubcategoryId} onValueChange={setSelectedSubcategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subcategory" />
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
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2 mb-2">
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
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>
              Write your article content with rich text formatting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit" className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  Edit
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="edit" className="mt-4">
                <EnhancedRichEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your article content here..."
                />
              </TabsContent>
              
              <TabsContent value="preview" className="mt-4">
                <div className="border rounded-lg p-4 min-h-[400px] bg-white">
                  <div className="prose max-w-none">
                    <h1 className="text-2xl font-bold mb-4">{title || 'Article Title'}</h1>
                    <div 
                      dangerouslySetInnerHTML={renderPreview()}
                      className="prose-content"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !title.trim() || !content.trim()}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Creating...' : 'Create Article'}
          </Button>
        </div>
      </form>
    </div>
  )
}
