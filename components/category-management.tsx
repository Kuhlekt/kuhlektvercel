"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, FolderTree, AlertCircle } from "lucide-react"
import type { Category } from "../types/knowledge-base"

interface CategoryManagementProps {
  categories: Category[]
  onCategoriesUpdate: (categories: Category[]) => void
}

export function CategoryManagement({ categories, onCategoriesUpdate }: CategoryManagementProps) {
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
      (c) => c.name.toLowerCase() === formData.name.trim().toLowerCase() && c.id !== editingCategory?.id,
    )
    if (existingCategory) {
      setError("Category name already exists")
      return
    }

    if (editingCategory) {
      // Update existing category
      const updatedCategories = categories.map((category) =>
        category.id === editingCategory.id
          ? {
              ...category,
              name: formData.name.trim(),
              description: formData.description.trim() || undefined,
            }
          : category,
      )
      onCategoriesUpdate(updatedCategories)
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
    }

    setIsAddDialogOpen(false)
    resetForm()
    setEditingCategory(null)
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
          `This category contains ${totalArticles} articles. Are you sure you want to delete it? All articles will be lost.`,
        )
      ) {
        return
      }
    } else {
      if (!window.confirm("Are you sure you want to delete this category?")) {
        return
      }
    }

    const updatedCategories = categories.filter((category) => category.id !== categoryId)
    onCategoriesUpdate(updatedCategories)
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
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <FolderTree className="h-5 w-5" />
              <span>Category Management</span>
            </CardTitle>
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

                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name</Label>
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false)
                        resetForm()
                        setEditingCategory(null)
                      }}
                    >
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
                        <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-700"
                        >
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
    </div>
  )
}
