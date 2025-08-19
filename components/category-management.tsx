"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, AlertCircle, CheckCircle, Folder, FolderPlus } from "lucide-react"
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<{ category: Category; subcategory: Subcategory } | null>(
    null,
  )
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentCategoryId: "",
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      parentCategoryId: "",
    })
  }

  const addAuditEntry = (action: string, entityId: string, details: string) => {
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action,
      entityType: "category",
      entityId,
      performedBy: "admin",
      timestamp: new Date(),
      details,
    }
    onAuditLogUpdate([auditEntry, ...auditLog])
  }

  const handleAddCategory = () => {
    if (!formData.name.trim()) {
      setMessage({ type: "error", text: "Category name is required" })
      return
    }

    if (categories.some((c) => c.name.toLowerCase() === formData.name.trim().toLowerCase())) {
      setMessage({ type: "error", text: "Category name already exists" })
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
    addAuditEntry("category_created", newCategory.id, `Created category: ${newCategory.name}`)

    setMessage({ type: "success", text: "Category added successfully" })
    setIsAddCategoryDialogOpen(false)
    resetForm()
  }

  const handleAddSubcategory = () => {
    if (!formData.name.trim() || !formData.parentCategoryId) {
      setMessage({ type: "error", text: "Subcategory name and parent category are required" })
      return
    }

    const parentCategory = categories.find((c) => c.id === formData.parentCategoryId)
    if (!parentCategory) {
      setMessage({ type: "error", text: "Parent category not found" })
      return
    }

    if (parentCategory.subcategories.some((s) => s.name.toLowerCase() === formData.name.trim().toLowerCase())) {
      setMessage({ type: "error", text: "Subcategory name already exists in this category" })
      return
    }

    const newSubcategory: Subcategory = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      articles: [],
    }

    const updatedCategories = categories.map((category) =>
      category.id === formData.parentCategoryId
        ? { ...category, subcategories: [...category.subcategories, newSubcategory] }
        : category,
    )

    onCategoriesUpdate(updatedCategories)
    addAuditEntry(
      "subcategory_created",
      newSubcategory.id,
      `Created subcategory: ${newSubcategory.name} in ${parentCategory.name}`,
    )

    setMessage({ type: "success", text: "Subcategory added successfully" })
    setIsAddSubcategoryDialogOpen(false)
    resetForm()
  }

  const handleEditCategory = () => {
    if (!editingCategory || !formData.name.trim()) {
      setMessage({ type: "error", text: "Category name is required" })
      return
    }

    if (
      categories.some((c) => c.id !== editingCategory.id && c.name.toLowerCase() === formData.name.trim().toLowerCase())
    ) {
      setMessage({ type: "error", text: "Category name already exists" })
      return
    }

    const updatedCategory: Category = {
      ...editingCategory,
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
    }

    const updatedCategories = categories.map((c) => (c.id === editingCategory.id ? updatedCategory : c))
    onCategoriesUpdate(updatedCategories)
    addAuditEntry("category_updated", updatedCategory.id, `Updated category: ${updatedCategory.name}`)

    setMessage({ type: "success", text: "Category updated successfully" })
    setIsEditDialogOpen(false)
    setEditingCategory(null)
    resetForm()
  }

  const handleEditSubcategory = () => {
    if (!editingSubcategory || !formData.name.trim()) {
      setMessage({ type: "error", text: "Subcategory name is required" })
      return
    }

    const { category, subcategory } = editingSubcategory

    if (
      category.subcategories.some(
        (s) => s.id !== subcategory.id && s.name.toLowerCase() === formData.name.trim().toLowerCase(),
      )
    ) {
      setMessage({ type: "error", text: "Subcategory name already exists in this category" })
      return
    }

    const updatedSubcategory: Subcategory = {
      ...subcategory,
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
    }

    const updatedCategories = categories.map((c) =>
      c.id === category.id
        ? {
            ...c,
            subcategories: c.subcategories.map((s) => (s.id === subcategory.id ? updatedSubcategory : s)),
          }
        : c,
    )

    onCategoriesUpdate(updatedCategories)
    addAuditEntry("subcategory_updated", updatedSubcategory.id, `Updated subcategory: ${updatedSubcategory.name}`)

    setMessage({ type: "success", text: "Subcategory updated successfully" })
    setIsEditDialogOpen(false)
    setEditingSubcategory(null)
    resetForm()
  }

  const handleDeleteCategory = (category: Category) => {
    const totalArticles =
      category.articles.length + category.subcategories.reduce((sum, sub) => sum + sub.articles.length, 0)

    if (totalArticles > 0) {
      if (
        !window.confirm(
          `This category contains ${totalArticles} articles. Are you sure you want to delete it? All articles will be lost.`,
        )
      ) {
        return
      }
    } else if (!window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      return
    }

    const updatedCategories = categories.filter((c) => c.id !== category.id)
    onCategoriesUpdate(updatedCategories)
    addAuditEntry("category_deleted", category.id, `Deleted category: ${category.name}`)
    setMessage({ type: "success", text: "Category deleted successfully" })
  }

  const handleDeleteSubcategory = (category: Category, subcategory: Subcategory) => {
    if (subcategory.articles.length > 0) {
      if (
        !window.confirm(
          `This subcategory contains ${subcategory.articles.length} articles. Are you sure you want to delete it? All articles will be lost.`,
        )
      ) {
        return
      }
    } else if (!window.confirm(`Are you sure you want to delete subcategory "${subcategory.name}"?`)) {
      return
    }

    const updatedCategories = categories.map((c) =>
      c.id === category.id ? { ...c, subcategories: c.subcategories.filter((s) => s.id !== subcategory.id) } : c,
    )

    onCategoriesUpdate(updatedCategories)
    addAuditEntry("subcategory_deleted", subcategory.id, `Deleted subcategory: ${subcategory.name}`)
    setMessage({ type: "success", text: "Subcategory deleted successfully" })
  }

  const openEditCategoryDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      parentCategoryId: "",
    })
    setIsEditDialogOpen(true)
  }

  const openEditSubcategoryDialog = (category: Category, subcategory: Subcategory) => {
    setEditingSubcategory({ category, subcategory })
    setFormData({
      name: subcategory.name,
      description: subcategory.description || "",
      parentCategoryId: "",
    })
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Category Management</h3>
        <div className="flex space-x-2">
          <Dialog open={isAddSubcategoryDialogOpen} onOpenChange={setIsAddSubcategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm()
                  setMessage(null)
                }}
              >
                <FolderPlus className="h-4 w-4 mr-2" />
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="parent-category">Parent Category</Label>
                  <Select
                    value={formData.parentCategoryId}
                    onValueChange={(value) => setFormData({ ...formData, parentCategoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory-name">Subcategory Name</Label>
                  <Input
                    id="subcategory-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter subcategory name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory-description">Description (Optional)</Label>
                  <Textarea
                    id="subcategory-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter subcategory description"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddSubcategoryDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSubcategory}>Add Subcategory</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm()
                  setMessage(null)
                }}
              >
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter category name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-description">Description (Optional)</Label>
                  <Textarea
                    id="category-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter category description"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory}>Add Category</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Folder className="h-5 w-5 text-blue-500" />
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    {category.description && <p className="text-sm text-gray-500 mt-1">{category.description}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {category.articles.length +
                      category.subcategories.reduce((sum, sub) => sum + sub.articles.length, 0)}{" "}
                    articles
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => openEditCategoryDialog(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {category.subcategories.length > 0 && (
              <CardContent>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Subcategories:</h4>
                  {category.subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <FolderPlus className="h-4 w-4 text-green-500" />
                        <div>
                          <div className="font-medium text-sm">{subcategory.name}</div>
                          {subcategory.description && (
                            <div className="text-xs text-gray-500">{subcategory.description}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {subcategory.articles.length} articles
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditSubcategoryDialog(category, subcategory)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSubcategory(category, subcategory)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent aria-describedby="edit-description">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Edit Subcategory"}</DialogTitle>
            <DialogDescription id="edit-description">
              {editingCategory ? "Update category information." : "Update subcategory information."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={editingCategory ? handleEditCategory : handleEditSubcategory}>Update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
