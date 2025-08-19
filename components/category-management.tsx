"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Folder, FolderPlus, AlertCircle, CheckCircle } from "lucide-react"
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
  const [showCreateCategoryDialog, setShowCreateCategoryDialog] = useState(false)
  const [showCreateSubcategoryDialog, setShowCreateSubcategoryDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<{
    type: "category" | "subcategory"
    item: Category | Subcategory
    parentId?: string
  } | null>(null)
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const resetForm = () => {
    setFormData({ name: "", description: "" })
  }

  const addAuditEntry = (action: string, entityId: string, details: string) => {
    const entry: AuditLogEntry = {
      id: Date.now().toString(),
      action,
      entityType: "category",
      entityId,
      performedBy: "admin",
      timestamp: new Date(),
      details,
    }
    onAuditLogUpdate([entry, ...auditLog])
  }

  const handleCreateCategory = () => {
    if (!formData.name.trim()) {
      showMessage("error", "Category name is required")
      return
    }

    if (categories.some((c) => c.name.toLowerCase() === formData.name.toLowerCase())) {
      showMessage("error", "Category name already exists")
      return
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      articles: [],
      subcategories: [],
    }

    const updatedCategories = [...categories, newCategory]
    onCategoriesUpdate(updatedCategories)
    addAuditEntry("category_created", newCategory.id, `Created category: ${newCategory.name}`)

    setShowCreateCategoryDialog(false)
    resetForm()
    showMessage("success", `Category "${newCategory.name}" created successfully`)
  }

  const handleCreateSubcategory = () => {
    if (!formData.name.trim() || !selectedCategoryForSub) {
      showMessage("error", "Subcategory name and parent category are required")
      return
    }

    const parentCategory = categories.find((c) => c.id === selectedCategoryForSub)
    if (!parentCategory) {
      showMessage("error", "Parent category not found")
      return
    }

    if (parentCategory.subcategories.some((s) => s.name.toLowerCase() === formData.name.toLowerCase())) {
      showMessage("error", "Subcategory name already exists in this category")
      return
    }

    const newSubcategory: Subcategory = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      articles: [],
    }

    const updatedCategories = categories.map((c) =>
      c.id === selectedCategoryForSub ? { ...c, subcategories: [...c.subcategories, newSubcategory] } : c,
    )

    onCategoriesUpdate(updatedCategories)
    addAuditEntry(
      "subcategory_created",
      newSubcategory.id,
      `Created subcategory: ${newSubcategory.name} in ${parentCategory.name}`,
    )

    setShowCreateSubcategoryDialog(false)
    setSelectedCategoryForSub("")
    resetForm()
    showMessage("success", `Subcategory "${newSubcategory.name}" created successfully`)
  }

  const handleEdit = () => {
    if (!editingItem || !formData.name.trim()) {
      showMessage("error", "Name is required")
      return
    }

    if (editingItem.type === "category") {
      const category = editingItem.item as Category
      if (categories.some((c) => c.id !== category.id && c.name.toLowerCase() === formData.name.toLowerCase())) {
        showMessage("error", "Category name already exists")
        return
      }

      const updatedCategory = {
        ...category,
        name: formData.name.trim(),
        description: formData.description.trim(),
      }

      const updatedCategories = categories.map((c) => (c.id === category.id ? updatedCategory : c))
      onCategoriesUpdate(updatedCategories)
      addAuditEntry("category_updated", category.id, `Updated category: ${updatedCategory.name}`)
      showMessage("success", `Category "${updatedCategory.name}" updated successfully`)
    } else {
      const subcategory = editingItem.item as Subcategory
      const parentCategory = categories.find((c) => c.id === editingItem.parentId)

      if (!parentCategory) {
        showMessage("error", "Parent category not found")
        return
      }

      if (
        parentCategory.subcategories.some(
          (s) => s.id !== subcategory.id && s.name.toLowerCase() === formData.name.toLowerCase(),
        )
      ) {
        showMessage("error", "Subcategory name already exists in this category")
        return
      }

      const updatedSubcategory = {
        ...subcategory,
        name: formData.name.trim(),
        description: formData.description.trim(),
      }

      const updatedCategories = categories.map((c) =>
        c.id === editingItem.parentId
          ? { ...c, subcategories: c.subcategories.map((s) => (s.id === subcategory.id ? updatedSubcategory : s)) }
          : c,
      )

      onCategoriesUpdate(updatedCategories)
      addAuditEntry("subcategory_updated", subcategory.id, `Updated subcategory: ${updatedSubcategory.name}`)
      showMessage("success", `Subcategory "${updatedSubcategory.name}" updated successfully`)
    }

    setShowEditDialog(false)
    setEditingItem(null)
    resetForm()
  }

  const handleDeleteCategory = (category: Category) => {
    const totalArticles =
      category.articles.length + category.subcategories.reduce((sum, sub) => sum + sub.articles.length, 0)

    if (totalArticles > 0) {
      if (
        !window.confirm(
          `This category contains ${totalArticles} article(s). Are you sure you want to delete it? All articles will be permanently lost.`,
        )
      ) {
        return
      }
    } else {
      if (!window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
        return
      }
    }

    const updatedCategories = categories.filter((c) => c.id !== category.id)
    onCategoriesUpdate(updatedCategories)
    addAuditEntry("category_deleted", category.id, `Deleted category: ${category.name} (${totalArticles} articles)`)
    showMessage("success", `Category "${category.name}" deleted successfully`)
  }

  const handleDeleteSubcategory = (subcategory: Subcategory, parentId: string) => {
    const articleCount = subcategory.articles.length

    if (articleCount > 0) {
      if (
        !window.confirm(
          `This subcategory contains ${articleCount} article(s). Are you sure you want to delete it? All articles will be permanently lost.`,
        )
      ) {
        return
      }
    } else {
      if (!window.confirm(`Are you sure you want to delete the subcategory "${subcategory.name}"?`)) {
        return
      }
    }

    const updatedCategories = categories.map((c) =>
      c.id === parentId ? { ...c, subcategories: c.subcategories.filter((s) => s.id !== subcategory.id) } : c,
    )

    onCategoriesUpdate(updatedCategories)
    addAuditEntry(
      "subcategory_deleted",
      subcategory.id,
      `Deleted subcategory: ${subcategory.name} (${articleCount} articles)`,
    )
    showMessage("success", `Subcategory "${subcategory.name}" deleted successfully`)
  }

  const openEditDialog = (type: "category" | "subcategory", item: Category | Subcategory, parentId?: string) => {
    setEditingItem({ type, item, parentId })
    setFormData({
      name: item.name,
      description: item.description || "",
    })
    setShowEditDialog(true)
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Folder className="h-5 w-5" />
              <span>Category Management</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowCreateSubcategoryDialog(true)}>
                <FolderPlus className="h-4 w-4 mr-2" />
                Add Subcategory
              </Button>
              <Button onClick={() => setShowCreateCategoryDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Folder className="h-5 w-5 text-blue-500" />
                      <span className="font-medium text-lg">{category.name}</span>
                      <Badge variant="outline">
                        {category.articles.length +
                          category.subcategories.reduce((sum, sub) => sum + sub.articles.length, 0)}{" "}
                        articles
                      </Badge>
                    </div>
                    {category.description && <p className="text-sm text-gray-600 mt-1 ml-7">{category.description}</p>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog("category", category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {category.subcategories.length > 0 && (
                  <div className="ml-7 space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <FolderPlus className="h-4 w-4 text-green-500" />
                            <span className="font-medium">{subcategory.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {subcategory.articles.length} articles
                            </Badge>
                          </div>
                          {subcategory.description && (
                            <p className="text-sm text-gray-600 mt-1 ml-6">{subcategory.description}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog("subcategory", subcategory, category.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSubcategory(subcategory, category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {categories.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No categories created yet</p>
                <p className="text-sm">Create your first category to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Category Dialog */}
      <Dialog open={showCreateCategoryDialog} onOpenChange={setShowCreateCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>Add a new category to organize your articles</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Name *</Label>
              <Input
                id="category-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description (optional)"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateCategoryDialog(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateCategory}>Create Category</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Subcategory Dialog */}
      <Dialog open={showCreateSubcategoryDialog} onOpenChange={setShowCreateSubcategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Subcategory</DialogTitle>
            <DialogDescription>Add a new subcategory under an existing category</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="parent-category">Parent Category *</Label>
              <select
                id="parent-category"
                value={selectedCategoryForSub}
                onChange={(e) => setSelectedCategoryForSub(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
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
              <Label htmlFor="subcategory-name">Name *</Label>
              <Input
                id="subcategory-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter subcategory name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory-description">Description</Label>
              <Textarea
                id="subcategory-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter subcategory description (optional)"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateSubcategoryDialog(false)
                  setSelectedCategoryForSub("")
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateSubcategory}>Create Subcategory</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editingItem?.type === "category" ? "Category" : "Subcategory"}</DialogTitle>
            <DialogDescription>Update the name and description</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description (optional)"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false)
                  setEditingItem(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleEdit}>Update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
