"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Folder, Plus, Edit, Trash2, Save, X } from "lucide-react"
import { apiDatabase } from "../utils/api-database"
import type { Category, User } from "../types/knowledge-base"

interface CategoryManagementProps {
  categories: Category[]
  onDataUpdate: () => void
  currentUser: User
}

export function CategoryManagement({ categories = [], onDataUpdate, currentUser }: CategoryManagementProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    isActive: true,
  })
  const [editCategory, setEditCategory] = useState({
    name: "",
    description: "",
    isActive: true,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const safeCategories = Array.isArray(categories) ? categories : []

  const handleAdd = async () => {
    if (!newCategory.name.trim()) {
      setMessage({ type: "error", text: "Category name is required" })
      return
    }

    try {
      setIsSaving(true)
      const currentData = await apiDatabase.loadData()

      const category: Category = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
        isActive: newCategory.isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const auditEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        action: "create_category",
        performedBy: currentUser.username,
        timestamp: new Date().toISOString(),
        details: `Created category "${category.name}"`,
      }

      const updatedData = {
        ...currentData,
        categories: [...(currentData.categories || []), category],
        auditLog: [...(currentData.auditLog || []), auditEntry],
      }

      await apiDatabase.saveData(updatedData)

      setNewCategory({ name: "", description: "", isActive: true })
      setIsAdding(false)
      setMessage({ type: "success", text: "Category created successfully" })
      onDataUpdate()
    } catch (error) {
      console.error("Failed to create category:", error)
      setMessage({ type: "error", text: "Failed to create category" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setEditCategory({
      name: category.name,
      description: category.description,
      isActive: category.isActive || true,
    })
  }

  const handleUpdate = async () => {
    if (!editCategory.name.trim()) {
      setMessage({ type: "error", text: "Category name is required" })
      return
    }

    try {
      setIsSaving(true)
      const currentData = await apiDatabase.loadData()

      const updatedCategories = (currentData.categories || []).map((cat) =>
        cat.id === editingId
          ? {
              ...cat,
              name: editCategory.name.trim(),
              description: editCategory.description.trim(),
              isActive: editCategory.isActive,
              updatedAt: new Date().toISOString(),
            }
          : cat,
      )

      const auditEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        action: "update_category",
        performedBy: currentUser.username,
        timestamp: new Date().toISOString(),
        details: `Updated category "${editCategory.name}"`,
      }

      const updatedData = {
        ...currentData,
        categories: updatedCategories,
        auditLog: [...(currentData.auditLog || []), auditEntry],
      }

      await apiDatabase.saveData(updatedData)

      setEditingId(null)
      setMessage({ type: "success", text: "Category updated successfully" })
      onDataUpdate()
    } catch (error) {
      console.error("Failed to update category:", error)
      setMessage({ type: "error", text: "Failed to update category" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (category: Category) => {
    if (
      !confirm(
        `Are you sure you want to delete "${category.name}"? This will also delete all articles in this category.`,
      )
    ) {
      return
    }

    try {
      setIsSaving(true)
      const currentData = await apiDatabase.loadData()

      const updatedCategories = (currentData.categories || []).filter((cat) => cat.id !== category.id)
      const updatedArticles = (currentData.articles || []).filter((article) => article.categoryId !== category.id)

      const auditEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        action: "delete_category",
        performedBy: currentUser.username,
        timestamp: new Date().toISOString(),
        details: `Deleted category "${category.name}"`,
      }

      const updatedData = {
        ...currentData,
        categories: updatedCategories,
        articles: updatedArticles,
        auditLog: [...(currentData.auditLog || []), auditEntry],
      }

      await apiDatabase.saveData(updatedData)

      setMessage({ type: "success", text: "Category deleted successfully" })
      onDataUpdate()
    } catch (error) {
      console.error("Failed to delete category:", error)
      setMessage({ type: "error", text: "Failed to delete category" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Folder className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Category Management</h2>
        </div>
        <Button onClick={() => setIsAdding(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Add Category Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">Name *</Label>
              <Input
                id="new-name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-description">Description</Label>
              <Textarea
                id="new-description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Category description"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="new-active"
                checked={newCategory.isActive}
                onCheckedChange={(checked) => setNewCategory({ ...newCategory, isActive: checked })}
              />
              <Label htmlFor="new-active">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handleAdd} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <div className="grid gap-4">
        {safeCategories.map((category) => (
          <Card key={category.id}>
            <CardContent className="pt-6">
              {editingId === category.id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-name-${category.id}`}>Name *</Label>
                    <Input
                      id={`edit-name-${category.id}`}
                      value={editCategory.name}
                      onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`edit-description-${category.id}`}>Description</Label>
                    <Textarea
                      id={`edit-description-${category.id}`}
                      value={editCategory.description}
                      onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`edit-active-${category.id}`}
                      checked={editCategory.isActive}
                      onCheckedChange={(checked) => setEditCategory({ ...editCategory, isActive: checked })}
                    />
                    <Label htmlFor={`edit-active-${category.id}`}>Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button onClick={handleUpdate} disabled={isSaving} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="outline" onClick={() => setEditingId(null)} size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{category.description}</p>
                    <div className="text-sm text-gray-500">
                      Created: {new Date(category.createdAt).toLocaleDateString()} • Updated:{" "}
                      {new Date(category.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(category)} disabled={isSaving}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category)}
                      disabled={isSaving}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {safeCategories.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Folder className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
                <p className="text-gray-600 mb-6">Create your first category to organize articles</p>
                <Button onClick={() => setIsAdding(true)} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Category</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
