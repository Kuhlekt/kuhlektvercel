"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Folder, AlertCircle } from "lucide-react"
import type { Category, Subcategory, AuditLogEntry } from "../types/knowledge-base"

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
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [isAddSubcategoryDialogOpen, setIsAddSubcategoryDialogOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
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

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Category name is required")
      return
    }

    if (categories.some((c) => c.name.toLowerCase() === formData.name.trim().toLowerCase())) {
      setError("Category name already exists")
      return
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      articles: [],
      subcategories: [],
    }

    const updatedCategories = [...categories, newCategory]
    onCategoriesUpdate(updatedCategories)

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
    onAuditLogUpdate([auditEntry, ...auditLog])

    resetForm()
    setIsAddCategoryDialogOpen(false)
  }

  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim() || !selectedCategoryId) {
      setError("Subcategory name and parent category are required")
      return
    }

    const parentCategory = categories.find((c) => c.id === selectedCategoryId)
    if (!parentCategory) {
      setError("Parent category not found")
      return
    }

    if (parentCategory.subcategories.some((s) => s.name.toLowerCase() === formData.name.trim().toLowerCase())) {
      setError("Subcategory name already exists in this category")
      return
    }

    const newSubcategory: Subcategory = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      articles: [],
    }

    const updatedCategories = categories.map((category) =>
      category.id === selectedCategoryId
        ? { ...category, subcategories: [...category.subcategories, newSubcategory] }
        : category,
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
      details: `Created subcategory: ${newSubcategory.name} in ${parentCategory.name}`,
    }
    onAuditLogUpdate([auditEntry, ...auditLog])

    resetForm()
    setSelectedCategoryId("")
    setIsAddSubcategoryDialogOpen(false)
  }

  const handleDeleteCategory = (category: Category) => {
    const totalArticles =
      category.articles.length + category.subcategories.reduce((sum, sub) => sum + sub.articles.length, 0)

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

    const updatedCategories = categories.filter((c) => c.id !== category.id)
    onCategoriesUpdate(updatedCategories)

    // Add audit log entry
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action: "category_deleted",
      entityType: "category",
      entityId: category.id,
      performedBy: "admin",
      timestamp: new Date(),
      details: `Deleted category: ${category.name} (${totalArticles} articles)`,
    }
    onAuditLogUpdate([auditEntry, ...auditLog])
  }

  const getTotalArticles = (category: Category) => {
    return category.articles.length + category.subcategories.reduce((sum, sub) => sum + sub.articles.length, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Category Management</h3>
        <div className="flex space-x-2">
          <Dialog open={isAddSubcategoryDialogOpen} onOpenChange={setIsAddSubcategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Subcategory
              </Button>
            </DialogTrigger>
            <DialogContent aria-describedby="add-subcategory-description">
              <DialogHeader>
                <DialogTitle>Add New Subcategory</DialogTitle>
                <DialogDescription id="add-subcategory-description">
                  Create a new subcategory within an existing category.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSubcategory} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="parent-category">Parent Category</Label>
                  <select
                    id="parent-category"
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory-name">Subcategory Name</Label>
                  <Input
                    id="subcategory-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter subcategory name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory-description">Description (optional)</Label>
                  <Textarea
                    id="subcategory-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter subcategory description"
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

          <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent aria-describedby="add-category-description">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription id="add-category-description">
                  Create a new main category for organizing articles.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCategory} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category-description">Description (optional)</Label>
                  <Textarea
                    id="category-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter category description"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Category</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Folder className="h-5 w-5" />
            <span>Categories ({categories.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Subcategories</TableHead>
                <TableHead>Total Articles</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description || "No description"}</TableCell>
                  <TableCell>{category.subcategories.length}</TableCell>
                  <TableCell>{getTotalArticles(category)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
