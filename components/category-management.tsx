"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Edit, Trash2, Folder } from "lucide-react"
import { storage } from "../utils/storage"
import type { Category, User } from "../types/knowledge-base"

interface CategoryManagementProps {
  categories: Category[]
  currentUser: User
  onUpdateCategories: (categories: Category[]) => void
}

export function CategoryManagement({ categories, currentUser, onUpdateCategories }: CategoryManagementProps) {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: "",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      parentId: "",
    })
  }

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        parentId: formData.parentId || undefined,
        createdAt: new Date(),
        createdBy: currentUser.username,
      }

      const updatedCategories = [...categories, newCategory]
      onUpdateCategories(updatedCategories)
      storage.saveCategories(updatedCategories)
      storage.addAuditEntry({
        performedBy: currentUser.id,
        action: "CREATE_CATEGORY",
        details: `Created category "${newCategory.name}"`,
      })

      resetForm()
      setIsAddCategoryOpen(false)
    }
  }

  const handleEditCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCategory && formData.name.trim()) {
      const updatedCategory: Category = {
        ...editingCategory,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        parentId: formData.parentId || undefined,
      }

      const updatedCategories = categories.map((c) => (c.id === editingCategory.id ? updatedCategory : c))
      onUpdateCategories(updatedCategories)
      storage.saveCategories(updatedCategories)
      storage.addAuditEntry({
        performedBy: currentUser.id,
        action: "UPDATE_CATEGORY",
        details: `Updated category "${updatedCategory.name}"`,
      })

      resetForm()
      setEditingCategory(null)
    }
  }

  const handleDeleteCategory = (category: Category) => {
    const hasChildren = categories.some((c) => c.parentId === category.id)
    if (hasChildren) {
      alert("Cannot delete category with subcategories. Please delete or move subcategories first.")
      return
    }

    if (confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      const updatedCategories = categories.filter((c) => c.id !== category.id)
      onUpdateCategories(updatedCategories)
      storage.saveCategories(updatedCategories)
      storage.addAuditEntry({
        performedBy: currentUser.id,
        action: "DELETE_CATEGORY",
        details: `Deleted category "${category.name}"`,
      })
    }
  }

  const startEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      parentId: category.parentId || "",
    })
  }

  const getCategoryPath = (category: Category): string => {
    if (!category.parentId) return category.name
    const parent = categories.find((c) => c.id === category.parentId)
    return parent ? `${getCategoryPath(parent)} > ${category.name}` : category.name
  }

  const rootCategories = categories.filter((c) => !c.parentId)
  const getChildCount = (categoryId: string) => categories.filter((c) => c.parentId === categoryId).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Folder className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Category Management</h3>
          <Badge variant="outline">{categories.length} categories</Badge>
        </div>
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
              <div>
                <Label htmlFor="parent">Parent Category</Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No parent (root category)</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {getCategoryPath(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Category</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium">{category.name}</h4>
                  {getChildCount(category.id) > 0 && (
                    <Badge variant="secondary">{getChildCount(category.id)} subcategories</Badge>
                  )}
                </div>
                {category.description && <p className="text-sm text-gray-600 mt-1">{category.description}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Created: {category.createdAt.toLocaleDateString()} by {category.createdBy}
                  {category.parentId && (
                    <span> • Parent: {categories.find((c) => c.id === category.parentId)?.name}</span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => startEdit(category)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditCategory} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
              <div>
                <Label htmlFor="edit-parent">Parent Category</Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No parent (root category)</SelectItem>
                    {categories
                      .filter((c) => c.id !== editingCategory.id)
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {getCategoryPath(category)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
                  Cancel
                </Button>
                <Button type="submit">Update Category</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
