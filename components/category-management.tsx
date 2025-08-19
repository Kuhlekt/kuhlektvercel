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
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
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
    setEditingCategory(null)
    resetForm()
    setIsAddDialogOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
    })
    setError("")
    setIsAddDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Category name is required")
      return
    }

    // Check for duplicate name (excluding current category when editing)
    const existingCategory = categories.find(
      (c) => c.name === formData.name.trim() && (!editingCategory || c.id !== editingCategory.id),
    )
    if (existingCategory) {
      setError("Category name already exists")
      return
    }

    if (editingCategory) {
      // Update existing category
      const updatedCategories = categories.map((category) =>
        category.id === editingCategory.id
          ? { ...category, name: formData.name.trim(), description: formData.description.trim() }
          : category,
      )
      onCategoriesUpdate(updatedCategories)

      // Add audit entry
      const auditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        action: "category_updated",
        entityType: "category",
        entityId: editingCategory.id,
        performedBy: "admin",
        timestamp: new Date(),
        details: `Updated category: ${formData.name}`,
      }
      onAuditLogUpdate([auditEntry, ...auditLog])
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

      // Add audit entry
      const auditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        action: "category_created",
        entityType: "category",
        entityId: newCategory.id,
        performedBy: "admin",
        timestamp: new Date(),
        details: `Created category: ${newCategory.name}`,
      }
      onAuditLogUpdate([auditEntry, ...auditLog])
    }

    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleDeleteCategory = (category: Category) => {
    const articleCount =
      (category.articles?.length || 0) +
      (category.subcategories?.reduce((total, sub) => total + (sub.articles?.length || 0), 0) || 0)

    if (articleCount > 0) {
      alert(
        `Cannot delete category "${category.name}" because it contains ${articleCount} article(s). Please move or delete the articles first.`,
      )
      return
    }

    if (window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      const updatedCategories = categories.filter((c) => c.id !== category.id)
      onCategoriesUpdate(updatedCategories)

      // Add audit entry
      const auditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        action: "category_deleted",
        entityType: "category",
        entityId: category.id,
        performedBy: "admin",
        timestamp: new Date(),
        details: `Deleted category: ${category.name}`,
      }
      onAuditLogUpdate([auditEntry, ...auditLog])
    }
  }

  const getCategoryStats = (category: Category) => {
    const articleCount = category.articles?.length || 0
    const subcategoryCount = category.subcategories?.length || 0
    const subcategoryArticleCount =
      category.subcategories?.reduce((total, sub) => total + (sub.articles?.length || 0), 0) || 0

    return {
      articles: articleCount + subcategoryArticleCount,
      subcategories: subcategoryCount,
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Category Management</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddCategory}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div>
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
                  <Button type="submit">{editingCategory ? "Update" : "Add"} Category</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const stats = getCategoryStats(category)
            return (
              <Card key={category.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Folder className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {category.description && <p className="text-sm text-gray-600 mb-3">{category.description}</p>}
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{stats.articles} articles</span>
                    <span>{stats.subcategories} subcategories</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
