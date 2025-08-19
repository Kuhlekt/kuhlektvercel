"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { Category, User } from "../types/knowledge-base"
import { storage } from "../utils/storage"

interface CategoryManagementProps {
  categories: Category[]
  currentUser: User
  onUpdateCategories: (categories: Category[]) => void
}

export function CategoryManagement({ categories, currentUser, onUpdateCategories }: CategoryManagementProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingCategory) {
      // Update existing category
      const updatedCategories = categories.map((category) =>
        category.id === editingCategory.id ? { ...category, ...formData } : category,
      )
      onUpdateCategories(updatedCategories)
      storage.addAuditEntry({
        userId: currentUser.id,
        action: "UPDATE_CATEGORY",
        details: `Updated category ${formData.name}`,
      })
    } else {
      // Add new category
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      }
      onUpdateCategories([...categories, newCategory])
      storage.addAuditEntry({
        userId: currentUser.id,
        action: "CREATE_CATEGORY",
        details: `Created category ${formData.name}`,
      })
    }

    setFormData({ name: "", description: "" })
    setIsAddModalOpen(false)
    setEditingCategory(null)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
    })
    setIsAddModalOpen(true)
  }

  const handleDelete = (category: Category) => {
    if (confirm(`Are you sure you want to delete category ${category.name}?`)) {
      const updatedCategories = categories.filter((c) => c.id !== category.id)
      onUpdateCategories(updatedCategories)
      storage.addAuditEntry({
        userId: currentUser.id,
        action: "DELETE_CATEGORY",
        details: `Deleted category ${category.name}`,
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Category Management</h3>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Category
        </Button>
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Created</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t">
                <td className="px-4 py-2 font-medium">{category.name}</td>
                <td className="px-4 py-2">{category.description || "-"}</td>
                <td className="px-4 py-2">{new Date(category.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <Button onClick={() => handleEdit(category)} variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleDelete(category)} variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
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
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingCategory ? "Update Category" : "Add Category"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false)
                  setEditingCategory(null)
                  setFormData({ name: "", description: "" })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
