"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    const newCategory: Category = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      parentId: formData.parentId || undefined,
      createdAt: new Date(),
      createdBy: currentUser.username,
      subcategories: [],
      articles: [],
    }

    const updatedCategories = [...categories, newCategory]
    onUpdateCategories(updatedCategories)
    storage.saveCategories(updatedCategories)

    storage.addAuditEntry({
      performedBy: currentUser.id,
      action: "CREATE_CATEGORY",
      details: `Created category "${newCategory.name}"`,
    })

    setFormData({ name: "", description: "", parentId: "" })
    setIsAddCategoryOpen(false)
  }

  const handleEditCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory || !formData.name.trim()) return

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

    setEditingCategory(null)
    setFormData({ name: "", description: "", parentId: "" })
  }

  const handleDeleteCategory = (category: Category) => {
    const hasChildren = categories.some((c) => c.parentId === category.id)
    if (hasChildren) {
      alert("Cannot delete category with subcategories. Please delete subcategories first.")
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

  const getParentCategoryName = (parentId?: string) => {
    if (!parentId) return "Root"
    const parent = categories.find((c) => c.id === parentId)
    return parent ? parent.name : "Unknown"
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Category Management</h3>
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
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
                    <SelectItem value="root">Root (No parent)</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddCategoryOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Category
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <div className="grid grid-cols-5 gap-4 p-4 font-semibold border-b bg-gray-50">
          <div>Name</div>
          <div>Description</div>
          <div>Parent</div>
          <div>Created</div>
          <div>Actions</div>
        </div>
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Folder className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No categories created yet</p>
            <p className="text-sm">Create your first category to organize articles</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="grid grid-cols-5 gap-4 p-4 border-b last:border-b-0">
              <div className="font-medium">{category.name}</div>
              <div className="text-gray-600">{category.description || "No description"}</div>
              <div className="text-sm text-gray-500">{getParentCategoryName(category.parentId)}</div>
              <div className="text-sm text-gray-500">{category.createdAt.toLocaleDateString()}</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(category)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDeleteCategory(category)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

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
                    <SelectItem value="root">Root (No parent)</SelectItem>
                    {categories
                      .filter((c) => c.id !== editingCategory.id)
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setEditingCategory(null)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Update Category
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
