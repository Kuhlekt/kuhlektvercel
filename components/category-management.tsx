"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Folder, AlertCircle } from "lucide-react"
import type { Category, AuditLogEntry } from "../types/knowledge-base"

interface CategoryManagementProps {
  categories: Category[]
  onCategoriesUpdate: (categories: Category[]) => void
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
  auditLog: AuditLogEntry[]
}

export function CategoryManagement({
  categories,
  onCategoriesUpdate,
  onAuditLogUpdate,
  auditLog,
}: CategoryManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    })
    setError("")
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      if (!formData.name.trim()) {
        setError("Category name is required")
        return
      }

      if (categories.some((cat) => cat.name.toLowerCase() === formData.name.trim().toLowerCase())) {
        setError("Category name already exists")
        return
      }

      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        articles: [],
        subcategories: [],
        createdAt: new Date(),
      }

      const updatedCategories = [...categories, newCategory]
      onCategoriesUpdate(updatedCategories)

      // Add audit log entry
      const auditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        action: "category_created",
        entityType: "category",
        entityId: newCategory.id,
        performedBy: "admin", // This should come from current user
        timestamp: new Date(),
        details: `Created category: ${newCategory.name}`,
      }
      onAuditLogUpdate([auditEntry, ...auditLog])

      resetForm()
      setIsAddDialogOpen(false)
    } catch (err) {
      setError("Failed to create category")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      if (!editingCategory || !formData.name.trim()) {
        setError("Category name is required")
        return
      }

      if (
        categories.some(
          (cat) => cat.id !== editingCategory.id && cat.name.toLowerCase() === formData.name.trim().toLowerCase(),
        )
      ) {
        setError("Category name already exists")
        return
      }

      const updatedCategory: Category = {
        ...editingCategory,
        name: formData.name.trim(),
        description: formData.description.trim(),
        updatedAt: new Date(),
      }

      const updatedCategories = categories.map((cat) => (cat.id === editingCategory.id ? updatedCategory : cat))
      onCategoriesUpdate(updatedCategories)

      // Add audit log entry
      const auditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        action: "category_updated",
        entityType: "category",
        entityId: updatedCategory.id,
        performedBy: "admin", // This should come from current user
        timestamp: new Date(),
        details: `Updated category: ${updatedCategory.name}`,
      }
      onAuditLogUpdate([auditEntry, ...auditLog])

      resetForm()
      setIsEditDialogOpen(false)
      setEditingCategory(null)
    } catch (err) {
      setError("Failed to update category")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = (category: Category) => {
    const articleCount =
      (category.articles?.length || 0) +
      (category.subcategories?.reduce((sum, sub) => sum + (sub.articles?.length || 0), 0) || 0)

    if (articleCount > 0) {
      alert(`Cannot delete category "${category.name}" because it contains ${articleCount} articles.`)
      return
    }

    if (confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      const updatedCategories = categories.filter((cat) => cat.id !== category.id)
      onCategoriesUpdate(updatedCategories)

      // Add audit log entry
      const auditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        action: "category_deleted",
        entityType: "category",
        entityId: category.id,
        performedBy: "admin", // This should come from current user
        timestamp: new Date(),
        details: `Deleted category: ${category.name}`,
      }
      onAuditLogUpdate([auditEntry, ...auditLog])
    }
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
    })
    setError("")
    setIsEditDialogOpen(true)
  }

  const getCategoryArticleCount = (category: Category) => {
    const mainArticles = category.articles?.length || 0
    const subArticles = category.subcategories?.reduce((sum, sub) => sum + (sub.articles?.length || 0), 0) || 0
    return mainArticles + subArticles
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Category Management</h3>
          <p className="text-sm text-gray-600">Organize your knowledge base with categories and subcategories</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new category to organize your articles.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCategory} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="add-name">Category Name</Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-description">Description (Optional)</Label>
                <Input
                  id="add-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter category description"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Category"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Folder className="h-5 w-5" />
                  <span className="truncate">{category.name}</span>
                </div>
                <Badge variant="outline">{getCategoryArticleCount(category)} articles</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.description && <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>}

                <div className="text-xs text-gray-500">
                  Created: {new Date(category.createdAt).toLocaleDateString()}
                  {category.updatedAt && <div>Updated: {new Date(category.updatedAt).toLocaleDateString()}</div>}
                </div>

                {category.subcategories && category.subcategories.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-1">Subcategories:</div>
                    <div className="flex flex-wrap gap-1">
                      {category.subcategories.map((sub) => (
                        <Badge key={sub.id} variant="secondary" className="text-xs">
                          {sub.name} ({sub.articles?.length || 0})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-gray-500">No categories found. Create your first category to get started.</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCategory} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
