"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { Category } from "../types/knowledge-base"

interface CategoryManagementProps {
  categories: Category[]
  onUpdateCategories: (categories: Category[]) => void
}

export function CategoryManagement({ categories, onUpdateCategories }: CategoryManagementProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const handleAddCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date(),
    }

    onUpdateCategories([...categories, newCategory])
    setIsAddModalOpen(false)
    resetForm()
  }

  const handleEditCategory = () => {
    if (!editingCategory) return

    const updatedCategories = categories.map((category) =>
      category.id === editingCategory.id
        ? {
            ...category,
            name: formData.name,
            description: formData.description,
          }
        : category,
    )

    onUpdateCategories(updatedCategories)
    setEditingCategory(null)
    resetForm()
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      onUpdateCategories(categories.filter((category) => category.id !== categoryId))
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    })
  }

  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Category Management</h3>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">{category.name}</div>
              <div className="text-sm text-gray-600">{category.description}</div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => openEditModal(category)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Category Modal */}
      <Dialog
        open={isAddModalOpen || !!editingCategory}
        onOpenChange={() => {
          setIsAddModalOpen(false)
          setEditingCategory(null)
          resetForm()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false)
                  setEditingCategory(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={editingCategory ? handleEditCategory : handleAddCategory}>
                {editingCategory ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
