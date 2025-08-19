"use client"

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
import { Plus, Edit, Trash2, FolderTree, AlertCircle, CheckCircle } from "lucide-react"
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
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
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
    setIsAddDialogOpen(false)
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

  const handleDeleteCategory = (category: Category) => {
    const totalArticles =
      (category.articles?.length || 0) +
      (category.subcategories?.reduce((sum, sub) => sum + (sub.articles?.length || 0), 0) || 0)

    if (totalArticles > 0) {
      if (
        !window.confirm(
          `This category contains ${totalArticles} articles. Are you sure you want to delete it? All articles will be lost.`,
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
    addAuditEntry("category_deleted", category.id, `Deleted category: ${category.name}`)
    setMessage({ type: "success", text: "Category deleted successfully" })
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
    })
    setIsEditDialogOpen(true)
  }

  const getCategoryStats = (category: Category) => {
    const articleCount = category.articles?.length || 0
    const subcategoryCount = category.subcategories?.length || 0
    const subcategoryArticles = category.subcategories?.reduce((sum, sub) => sum + (sub.articles?.length || 0), 0) || 0

    return {
      articles: articleCount + subcategoryArticles,
      subcategories: subcategoryCount,
    }
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                Create a new category to organize your articles.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Name</Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-description">Description (optional)</Label>
                <Textarea
                  id="add-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory}>Add Category</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FolderTree className="h-5 w-5" />
            <span>Categories ({categories.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>Subcategories</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => {
                const stats = getCategoryStats(category)
                return (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.description || "No description"}</TableCell>
                    <TableCell>{stats.articles}</TableCell>
                    <TableCell>{stats.subcategories}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent aria-describedby="edit-category-description">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription id="edit-category-description">
              Update category information and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCategory}>Update Category</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
