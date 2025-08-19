"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Edit, Trash2, Folder } from "lucide-react"
import { storage } from "../utils/storage"
import type { Category, Article, User } from "../types/knowledge-base"

interface CategoryManagementProps {
  categories: Category[]
  articles: Article[]
  currentUser: User
  onUpdateCategories: (categories: Category[]) => void
  onUpdateArticles: (articles: Article[]) => void
}

export function CategoryManagement({
  categories,
  articles,
  currentUser,
  onUpdateCategories,
  onUpdateArticles,
}: CategoryManagementProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [error, setError] = useState("")

  const handleAddCategory = () => {
    setFormData({ name: "", description: "" })
    setError("")
    setIsAddModalOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
    })
    setEditingCategory(category)
    setError("")
    setIsEditModalOpen(true)
  }

  const handleDeleteCategory = (categoryId: string) => {
    const categoryArticles = articles.filter((a) => a.categoryId === categoryId)

    if (categoryArticles.length > 0) {
      setError(`Cannot delete category with ${categoryArticles.length} articles`)
      return
    }

    if (confirm("Are you sure you want to delete this category?")) {
      const updatedCategories = categories.filter((c) => c.id !== categoryId)
      onUpdateCategories(updatedCategories)
      storage.saveCategories(updatedCategories)
      storage.addAuditEntry({
        userId: currentUser.id,
        action: "DELETE_CATEGORY",
        details: `Deleted category with ID ${categoryId}`,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Category name is required")
      return
    }

    if (editingCategory) {
      // Edit existing category
      const updatedCategories = categories.map((c) =>
        c.id === editingCategory.id
          ? {
              ...c,
              name: formData.name.trim(),
              description: formData.description.trim() || undefined,
            }
          : c,
      )
      onUpdateCategories(updatedCategories)
      storage.saveCategories(updatedCategories)
      storage.addAuditEntry({
        userId: currentUser.id,
        action: "UPDATE_CATEGORY",
        details: `Updated category ${formData.name}`,
      })
      setIsEditModalOpen(false)
    } else {
      // Add new category
      if (categories.some((c) => c.name === formData.name.trim())) {
        setError("Category name already exists")
        return
      }

      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        createdAt: new Date(),
        createdBy: currentUser.username,
      }

      const updatedCategories = [...categories, newCategory]
      onUpdateCategories(updatedCategories)
      storage.saveCategories(updatedCategories)
      storage.addAuditEntry({
        userId: currentUser.id,
        action: "CREATE_CATEGORY",
        details: `Created category ${newCategory.name}`,
      })
      setIsAddModalOpen(false)
    }

    setEditingCategory(null)
  }

  const getCategoryArticleCount = (categoryId: string) => {
    return articles.filter((a) => a.categoryId === categoryId).length
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Category Management</h3>
        <Button onClick={handleAddCategory} className="flex items-center space-x-1">
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ScrollArea className="h-96">
        <div className="space-y-2">
          {categories.map((category) => {
            const articleCount = getCategoryArticleCount(category.id)
            return (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Folder className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-gray-500">({articleCount} articles)</span>
                  </div>
                  {category.description && <p className="text-sm text-gray-600 mt-1">{category.description}</p>}
                  <p className="text-xs text-gray-400">
                    Created: {category.createdAt.toLocaleDateString()} by {category.createdBy}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={articleCount > 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {/* Add Category Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Category</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Category</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
