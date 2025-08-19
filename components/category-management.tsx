"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Folder, AlertCircle } from "lucide-react"
import type { Category, AuditLogEntry, Subcategory } from "../types/knowledge-base"

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
  const [isAddSubcategoryDialogOpen, setIsAddSubcategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [error, setError] = useState("")

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    })
    setError("")
  }

  const handleAddCategory = () => {
    setIsAddDialogOpen(true)
    resetForm()
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
    })
    setError("")
    setIsEditDialogOpen(true)
  }

  const handleAddSubcategory = (category: Category) => {
    setSelectedCategoryForSub(category)
    resetForm()
    setIsAddSubcategoryDialogOpen(true)
  }

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return

    const totalArticles =
      (category.articles?.length || 0) +
      (category.subcategories?.reduce((sum, sub) => sum + (sub.articles?.length || 0), 0) || 0)

    if (totalArticles > 0) {
      if (
        !window.confirm(
          `This category contains ${totalArticles} articles. Are you sure you want to delete it? All articles will be permanently lost.`,
        )
      ) {
        return
      }
    } else {
      if (!window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
        return
      }
    }

    const updatedCategories = categories.filter((c) => c.id !== categoryId)
    onCategoriesUpdate(updatedCategories)

    // Add audit log entry
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action: "category_deleted",
      entityType: "category",
      entityId: categoryId,
      performedBy: "admin",
      timestamp: new Date(),
      details: `Deleted category: ${category.name} (${totalArticles} articles)`,
    }
    const updatedAuditLog = [auditEntry, ...auditLog]
    onAuditLogUpdate(updatedAuditLog)
  }

  const handleDeleteSubcategory = (categoryId: string, subcategoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    const subcategory = category?.subcategories?.find((s) => s.id === subcategoryId)
    if (!category || !subcategory) return

    const articleCount = subcategory.articles?.length || 0

    if (articleCount > 0) {
      if (
        !window.confirm(
          `This subcategory contains ${articleCount} articles. Are you sure you want to delete it? All articles will be permanently lost.`,
        )
      ) {
        return
      }
    } else {
      if (!window.confirm(`Are you sure you want to delete subcategory "${subcategory.name}"?`)) {
        return
      }
    }

    const updatedCategories = categories.map((c) =>
      c.id === categoryId
        ? {
            ...c,
            subcategories: c.subcategories?.filter((s) => s.id !== subcategoryId) || [],
          }
        : c,
    )
    onCategoriesUpdate(updatedCategories)

    // Add audit log entry
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action: "subcategory_deleted",
      entityType: "subcategory",
      entityId: subcategoryId,
      performedBy: "admin",
      timestamp: new Date(),
      details: `Deleted subcategory: ${subcategory.name} from ${category.name} (${articleCount} articles)`,
    }
    const updatedAuditLog = [auditEntry, ...auditLog]
    onAuditLogUpdate(updatedAuditLog)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Name is required")
      return
    }

    // Check for duplicate name (excluding current category when editing)
    const existingCategory = categories.find(
      (c) => c.name.toLowerCase() === formData.name.trim().toLowerCase() && c.id !== editingCategory?.id,
    )
    if (existingCategory) {
      setError("Category name already exists")
      return
    }

    if (editingCategory) {
      // Update existing category
      const updatedCategories = categories.map((c) =>
        c.id === editingCategory.id
          ? {
              ...c,
              name: formData.name.trim(),
              description: formData.description.trim() || undefined,
            }
          : c,
      )
      onCategoriesUpdate(updatedCategories)

      // Add audit log entry
      const auditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        action: "category_updated",
        entityType: "category",
        entityId: editingCategory.id,
        performedBy: "admin",
        timestamp: new Date(),
        details: `Updated category: ${formData.name}`,
      }
      const updatedAuditLog = [auditEntry, ...auditLog]
      onAuditLogUpdate(updatedAuditLog)

      setIsEditDialogOpen(false)
    } else {
      // Add new category
      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        articles: [],
        subcategories: [],
      }
      onCategoriesUpdate([...categories, newCategory])

      // Add audit log entry
      const auditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        action: "category_created",
        entityType: "category",
        entityId: newCategory.id,
        performedBy: "admin",
        timestamp: new Date(),
        details: `Created category: ${newCategory.name}`,
      }
      const updatedAuditLog = [auditEntry, ...auditLog]
      onAuditLogUpdate(updatedAuditLog)

      setIsAddDialogOpen(false)
    }

    resetForm()
    setEditingCategory(null)
  }

  const handleSubcategorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim() || !selectedCategoryForSub) {
      setError("Name is required")
      return
    }

    // Check for duplicate subcategory name within the category
    const existingSubcategory = selectedCategoryForSub.subcategories?.find(
      (s) => s.name.toLowerCase() === formData.name.trim().toLowerCase(),
    )
    if (existingSubcategory) {
      setError("Subcategory name already exists in this category")
      return
    }

    const newSubcategory: Subcategory = {
      id: `${selectedCategoryForSub.id}-${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      articles: [],
    }

    const updatedCategories = categories.map((c) =>
      c.id === selectedCategoryForSub.id
        ? {
            ...c,
            subcategories: [...(c.subcategories || []), newSubcategory],
          }
        : c,
    )
    onCategoriesUpdate(updatedCategories)

    // Add audit log entry
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action: "subcategory_created",
      entityType: "subcategory",
      entityId: newSubcategory.id,
      performedBy: "admin",
      timestamp: new Date(),
      details: `Created subcategory: ${newSubcategory.name} in ${selectedCategoryForSub.name}`,
    }
    const updatedAuditLog = [auditEntry, ...auditLog]
    onAuditLogUpdate(updatedAuditLog)

    setIsAddSubcategoryDialogOpen(false)
    resetForm()
    setSelectedCategoryForSub(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Category Management</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter category description (optional)"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Category</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => {
          const totalArticles =
            (category.articles?.length || 0) +
            (category.subcategories?.reduce((sum, sub) => sum + (sub.articles?.length || 0), 0) || 0)

          return (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Folder className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      {category.description && <p className="text-sm text-gray-500 mt-1">{category.description}</p>}
                      <p className="text-xs text-gray-400 mt-1">
                        {totalArticles} articles • {category.subcategories?.length || 0} subcategories
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleAddSubcategory(category)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Sub
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {category.subcategories && category.subcategories.length > 0 && (
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Subcategories:</h4>
                    <div className="grid gap-2">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{subcategory.name}</span>
                            {subcategory.description && (
                              <p className="text-xs text-gray-500">{subcategory.description}</p>
                            )}
                            <p className="text-xs text-gray-400">{subcategory.articles?.length || 0} articles</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description (optional)"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Category</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddSubcategoryDialogOpen} onOpenChange={setIsAddSubcategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subcategory to "{selectedCategoryForSub?.name}"</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubcategorySubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="sub-name">Name</Label>
              <Input
                id="sub-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter subcategory name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sub-description">Description</Label>
              <Textarea
                id="sub-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter subcategory description (optional)"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsAddSubcategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Subcategory</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
