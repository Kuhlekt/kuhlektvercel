"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Plus, Edit } from "lucide-react"
import { storage } from "../utils/storage"
import type { Category, User } from "../types/knowledge-base"

interface CategoryManagementProps {
  categories: Category[]
  onUpdateCategories: (categories: Category[]) => void
  currentUser: User
}

export function CategoryManagement({ categories, onUpdateCategories, currentUser }: CategoryManagementProps) {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  })

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.description) return

    const category: Category = {
      id: Date.now().toString(),
      ...newCategory,
      createdAt: new Date(),
      createdBy: currentUser.username,
    }

    const updatedCategories = [...categories, category]
    onUpdateCategories(updatedCategories)
    storage.saveCategories(updatedCategories)
    storage.addAuditEntry({
      userId: currentUser.id,
      action: "CREATE_CATEGORY",
      details: `Created category ${category.name}`,
    })

    setNewCategory({ name: "", description: "" })
    setIsAddCategoryOpen(false)
  }

  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter((c) => c.id !== categoryId)
    onUpdateCategories(updatedCategories)
    storage.saveCategories(updatedCategories)
    storage.addAuditEntry({
      userId: currentUser.id,
      action: "DELETE_CATEGORY",
      details: `Deleted category ${categories.find((c) => c.id === categoryId)?.name}`,
    })
  }

  const handleUpdateCategory = () => {
    if (!editingCategory) return

    const updatedCategories = categories.map((c) => (c.id === editingCategory.id ? editingCategory : c))
    onUpdateCategories(updatedCategories)
    storage.saveCategories(updatedCategories)
    storage.addAuditEntry({
      userId: currentUser.id,
      action: "UPDATE_CATEGORY",
      details: `Updated category ${editingCategory.name}`,
    })

    setEditingCategory(null)
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
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory}>Add Category</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <div className="grid grid-cols-4 gap-4 p-4 font-medium border-b bg-gray-50">
          <div>Name</div>
          <div>Description</div>
          <div>Created</div>
          <div>Actions</div>
        </div>
        {categories.map((category) => (
          <div key={category.id} className="grid grid-cols-4 gap-4 p-4 border-b last:border-b-0">
            <div className="font-medium">{category.name}</div>
            <div className="text-gray-600">{category.description}</div>
            <div className="text-gray-600">{category.createdAt.toLocaleDateString()}</div>
            <div className="flex space-x-2">
              <Dialog
                open={editingCategory?.id === category.id}
                onOpenChange={(open) => !open && setEditingCategory(null)}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setEditingCategory(category)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                  </DialogHeader>
                  {editingCategory && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="edit-name">Name</Label>
                        <Input
                          id="edit-name"
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          value={editingCategory.description}
                          onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setEditingCategory(null)}>
                          Cancel
                        </Button>
                        <Button onClick={handleUpdateCategory}>Update Category</Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
