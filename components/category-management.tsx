"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, FolderOpen, Folder, AlertCircle, CheckCircle } from "lucide-react"
import type { Category, Subcategory, AuditLogEntry } from "../types/knowledge-base"

interface CategoryManagementProps {
  categories: Category[]
  auditLog: AuditLogEntry[]
  onCategoriesUpdate: (categories: Category[]) => void
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
}

export function CategoryManagement({
  categories,
  auditLog,
  onCategoriesUpdate,
  onAuditLogUpdate,
}: CategoryManagementProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showCreateSubDialog, setShowCreateSubDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    parentCategoryId: "",
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      parentCategoryId: "",
    })
  }

  const handleCreateCategory = () => {
    if (!formData.name.trim()) {
      showMessage("error", "Please enter a category name")
      return
    }

    if (categories.some((c) => c.name.toLowerCase() === formData.name.toLowerCase())) {
      showMessage("error", "Category name already exists")
      return
    }

    const newCategory: Category = {
      id: formData.name.toLowerCase().replace(/\s+/g, "-"),
      name: formData.name.trim(),
      expanded: false,
      articles: [],
      subcategories: [],
    }

    const updatedCategories = [...categories, newCategory]
    onCategoriesUpdate(updatedCategories)

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

    setShowCreateDialog(false)
    resetForm()
    showMessage("success", "Category created successfully")
  }

  const handleCreateSubcategory = () => {
    if (!formData.name.trim() || !selectedCategoryForSub) {
      showMessage("error", "Please enter a subcategory name")
      return
    }

    const existingSubcategory = selectedCategoryForSub.subcategories?.some(
      (sub) => sub.name.toLowerCase() === formData.name.toLowerCase(),
    )

    if (existingSubcategory) {
      showMessage("error", "Subcategory name already exists in this category")
      return
    }

    const newSubcategory: Subcategory = {
      id: `${selectedCategoryForSub.id}-${formData.name.toLowerCase().replace(/\s+/g, "-")}`,
      name: formData.name.trim(),
      articles: [],
    }

    const updatedCategories = categories.map((category) => {
      if (category.id === selectedCategoryForSub.id) {
        return {
          ...category,
          subcategories: [...(category.subcategories || []), newSubcategory],
        }
      }
      return category
    })

    onCategoriesUpdate(updatedCategories)

    // Add audit entry
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action: "subcategory_created",
      entityType: "subcategory",
      entityId: newSubcategory.id,
      performedBy: "admin",
      timestamp: new Date(),
      details: `Created subcategory: ${newSubcategory.name} in ${selectedCategoryForSub.name}`,
    }
    onAuditLogUpdate([auditEntry, ...auditLog])

    setShowCreateSubDialog(false)
    setSelectedCategoryForSub(null)
    resetForm()
    showMessage("success", "Subcategory created successfully")
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      parentCategoryId: "",
    })
    setShowEditDialog(true)
  }

  const handleUpdateCategory = () => {
    if (!editingCategory || !formData.name.trim()) {
      showMessage("error", "Please enter a category name")
      return
    }

    // Check for duplicate name (excluding current category)
    if (categories.some((c) => c.id !== editingCategory.id && c.name.toLowerCase() === formData.name.toLowerCase())) {
      showMessage("error", "Category name already exists")
      return
    }

    const updatedCategories = categories.map((category) => {
      if (category.id === editingCategory.id) {
        return {
          ...category,
          name: formData.name.trim(),
        }
      }
      return category
    })

    onCategoriesUpdate(updatedCategories)

    // Add audit entry
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action: "category_updated",
      entityType: "category",
      entityId: editingCategory.id,
      performedBy: "admin",
      timestamp: new Date(),
      details: `Updated category: ${formData.name.trim()}`,
    }
    onAuditLogUpdate([auditEntry, ...auditLog])

    setShowEditDialog(false)
    setEditingCategory(null)
    resetForm()
    showMessage("success", "Category updated successfully")
  }

  const handleDeleteCategory = (category: Category) => {
    const articleCount =
      (category.articles?.length || 0) +
      (category.subcategories?.reduce((total, sub) => total + (sub.articles?.length || 0), 0) || 0)

    if (articleCount > 0) {
      if (
        !window.confirm(
          `This category contains ${articleCount} article(s). Are you sure you want to delete it? All articles will be permanently lost.`,
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

    // Add audit entry
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action: "category_deleted",
      entityType: "category",
      entityId: category.id,
      performedBy: "admin",
      timestamp: new Date(),
      details: `Deleted category: ${category.name} (${articleCount} articles)`,
    }
    onAuditLogUpdate([auditEntry, ...auditLog])

    showMessage("success", "Category deleted successfully")
  }

  const handleDeleteSubcategory = (category: Category, subcategory: Subcategory) => {
    const articleCount = subcategory.articles?.length || 0

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

    const updatedCategories = categories.map((cat) => {
      if (cat.id === category.id) {
        return {
          ...cat,
          subcategories: cat.subcategories?.filter((sub) => sub.id !== subcategory.id) || [],
        }
      }
      return cat
    })

    onCategoriesUpdate(updatedCategories)

    // Add audit entry
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action: "subcategory_deleted",
      entityType: "subcategory",
      entityId: subcategory.id,
      performedBy: "admin",
      timestamp: new Date(),
      details: `Deleted subcategory: ${subcategory.name} from ${category.name} (${articleCount} articles)`,
    }
    onAuditLogUpdate([auditEntry, ...auditLog])

    showMessage("success", "Subcategory deleted successfully")
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <div className="flex items-center">
            {message.type === "error" ? (
              <AlertCircle className="h-4 w-4 text-red-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <AlertDescription className="ml-2">{message.text}</AlertDescription>
          </div>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Category Management</h3>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center space-x-2">
                  <FolderOpen className="h-4 w-4" />
                  <span>{category.name}</span>
                  <Badge variant="outline">
                    {(category.articles?.length || 0) +
                      (category.subcategories?.reduce((total, sub) => total + (sub.articles?.length || 0), 0) ||
                        0)}{" "}
                    articles
                  </Badge>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCategoryForSub(category)
                      setShowCreateSubDialog(true)
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Sub
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCategory(category)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {category.subcategories && category.subcategories.length > 0 && (
              <CardContent>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Subcategories:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <Folder className="h-3 w-3 text-gray-500" />
                          <span className="text-sm">{subcategory.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {subcategory.articles?.length || 0}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSubcategory(category, subcategory)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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
        ))}
      </div>

      {/* Create Category Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent aria-describedby="create-category-description">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription id="create-category-description">
              Add a new category to organize your articles
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-category-name">Category Name</Label>
              <Input
                id="create-category-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false)
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

      {/* Edit Category Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent aria-describedby="edit-category-description">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription id="edit-category-description">Update the category name</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category-name">Category Name</Label>
              <Input
                id="edit-category-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false)
                  setEditingCategory(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateCategory}>Update Category</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Subcategory Dialog */}
      <Dialog open={showCreateSubDialog} onOpenChange={setShowCreateSubDialog}>
        <DialogContent aria-describedby="create-subcategory-description">
          <DialogHeader>
            <DialogTitle>Create New Subcategory</DialogTitle>
            <DialogDescription id="create-subcategory-description">
              Add a new subcategory to {selectedCategoryForSub?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-subcategory-name">Subcategory Name</Label>
              <Input
                id="create-subcategory-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter subcategory name"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateSubDialog(false)
                  setSelectedCategoryForSub(null)
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
    </div>
  )
}
