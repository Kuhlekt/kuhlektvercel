"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Folder, FolderPlus, AlertCircle, CheckCircle } from "lucide-react"
import { apiDatabase } from "../utils/api-database"
import type { Category } from "../types/knowledge-base"

interface CategoryManagementProps {
  categories: Category[]
  onCategoriesUpdate: () => void
}

export function CategoryManagement({ categories, onCategoriesUpdate }: CategoryManagementProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setError(null)
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Category name is required")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const newCategory: Category = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        description: description.trim(),
        articles: [],
        subcategories: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const updatedCategories = [...categories, newCategory]

      await apiDatabase.saveData({ categories: updatedCategories })

      showMessage("success", "Category created successfully!")
      setShowAddDialog(false)
      resetForm()
      await onCategoriesUpdate()
    } catch (error) {
      console.error("Error creating category:", error)
      setError("Failed to create category. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingCategory) return

    if (!name.trim()) {
      setError("Category name is required")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const updatedCategories = categories.map((cat) =>
        cat.id === editingCategory.id
          ? {
              ...cat,
              name: name.trim(),
              description: description.trim(),
              updatedAt: new Date(),
            }
          : cat,
      )

      await apiDatabase.saveData({ categories: updatedCategories })

      showMessage("success", "Category updated successfully!")
      setShowEditDialog(false)
      setEditingCategory(null)
      resetForm()
      await onCategoriesUpdate()
    } catch (error) {
      console.error("Error updating category:", error)
      setError("Failed to update category. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the category "${categoryName}"? This will also delete all articles in this category.`,
      )
    ) {
      return
    }

    try {
      setIsLoading(true)

      const updatedCategories = categories.filter((cat) => cat.id !== categoryId)

      await apiDatabase.saveData({ categories: updatedCategories })

      showMessage("success", "Category deleted successfully!")
      await onCategoriesUpdate()
    } catch (error) {
      console.error("Error deleting category:", error)
      showMessage("error", "Failed to delete category. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setName(category.name)
    setDescription(category.description)
    setShowEditDialog(true)
  }

  const closeDialogs = () => {
    setShowAddDialog(false)
    setShowEditDialog(false)
    setEditingCategory(null)
    resetForm()
  }

  const getTotalArticles = (category: Category): number => {
    let total = category.articles?.length || 0
    if (category.subcategories) {
      category.subcategories.forEach((sub) => {
        total += sub.articles?.length || 0
      })
    }
    return total
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium mb-2">Category Management</h3>
          <p className="text-sm text-gray-600">
            Create and manage knowledge base categories to organize your articles.
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setShowAddDialog(true)
              }}
            >
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
                <Label htmlFor="add-name">Name *</Label>
                <Input
                  id="add-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter category name"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-description">Description</Label>
                <Textarea
                  id="add-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter category description (optional)"
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Create Category
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={closeDialogs} disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage your knowledge base categories and their organization.</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Subcategories</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Folder className="h-4 w-4 mr-2 text-blue-500" />
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-gray-600 line-clamp-2">{category.description || "No description"}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getTotalArticles(category)} total</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{category.subcategories?.length || 0}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(category)} disabled={isLoading}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id, category.name)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first category.</p>
              <Button
                onClick={() => {
                  resetForm()
                  setShowAddDialog(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the category information.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCategory} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter category description (optional)"
                disabled={isLoading}
                rows={3}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Update Category
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={closeDialogs} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
