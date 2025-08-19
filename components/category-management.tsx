"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, Plus, Edit, Trash2, Search, Folder, FileText, AlertTriangle, CheckCircle } from "lucide-react"
import type { Category, AuditLogEntry } from "../types/knowledge-base"

interface CategoryManagementProps {
  categories: Category[]
  onCategoriesUpdate: (categories: Category[]) => void
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
}

export function CategoryManagement({ categories, onCategoriesUpdate, onAuditLogUpdate }: CategoryManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showAddSubcategoryDialog, setShowAddSubcategoryDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  })
  const [newSubcategory, setNewSubcategory] = useState({
    name: "",
    description: "",
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const addAuditEntry = (action: string, details: string) => {
    const entry: AuditLogEntry = {
      id: Date.now().toString(),
      action: action as any,
      entityType: "category",
      performedBy: "admin",
      timestamp: new Date(),
      details,
    }
    onAuditLogUpdate([entry])
  }

  const getTotalArticles = (category: Category) => {
    const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
    const subcategoryArticles = Array.isArray(category.subcategories)
      ? category.subcategories.reduce(
          (total, sub) => total + (Array.isArray(sub.articles) ? sub.articles.length : 0),
          0,
        )
      : 0
    return categoryArticles + subcategoryArticles
  }

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      setMessage({ type: "error", text: "Please enter a category name" })
      return
    }

    if (categories.some((c) => c.name.toLowerCase() === newCategory.name.toLowerCase())) {
      setMessage({ type: "error", text: "Category name already exists" })
      return
    }

    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name.trim(),
      description: newCategory.description.trim() || undefined,
      articles: [],
      subcategories: [],
    }

    const updatedCategories = [...categories, category]
    onCategoriesUpdate(updatedCategories)
    addAuditEntry("category_created", `Created category: ${category.name}`)

    setNewCategory({ name: "", description: "" })
    setShowAddDialog(false)
    setMessage({ type: "success", text: "Category created successfully" })
  }

  const handleAddSubcategory = () => {
    if (!selectedCategoryForSub || !newSubcategory.name.trim()) {
      setMessage({ type: "error", text: "Please enter a subcategory name" })
      return
    }

    const existingSubcategories = selectedCategoryForSub.subcategories || []
    if (existingSubcategories.some((s) => s.name.toLowerCase() === newSubcategory.name.toLowerCase())) {
      setMessage({ type: "error", text: "Subcategory name already exists in this category" })
      return
    }

    const subcategory = {
      id: Date.now().toString(),
      name: newSubcategory.name.trim(),
      description: newSubcategory.description.trim() || undefined,
      articles: [],
    }

    const updatedCategories = categories.map((c) =>
      c.id === selectedCategoryForSub.id ? { ...c, subcategories: [...existingSubcategories, subcategory] } : c,
    )

    onCategoriesUpdate(updatedCategories)
    addAuditEntry("category_created", `Created subcategory: ${subcategory.name} in ${selectedCategoryForSub.name}`)

    setNewSubcategory({ name: "", description: "" })
    setShowAddSubcategoryDialog(false)
    setSelectedCategoryForSub(null)
    setMessage({ type: "success", text: "Subcategory created successfully" })
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setNewCategory({
      name: category.name,
      description: category.description || "",
    })
  }

  const handleUpdateCategory = () => {
    if (!editingCategory || !newCategory.name.trim()) {
      setMessage({ type: "error", text: "Please enter a category name" })
      return
    }

    const updatedCategories = categories.map((c) =>
      c.id === editingCategory.id
        ? {
            ...c,
            name: newCategory.name.trim(),
            description: newCategory.description.trim() || undefined,
          }
        : c,
    )

    onCategoriesUpdate(updatedCategories)
    addAuditEntry("category_updated", `Updated category: ${newCategory.name}`)

    setEditingCategory(null)
    setNewCategory({ name: "", description: "" })
    setMessage({ type: "success", text: "Category updated successfully" })
  }

  const handleDeleteCategory = (category: Category) => {
    const totalArticles = getTotalArticles(category)

    if (totalArticles > 0) {
      if (
        !window.confirm(
          `This category contains ${totalArticles} article(s). Deleting it will also delete all articles. Are you sure?`,
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
    addAuditEntry("category_deleted", `Deleted category: ${category.name} (${totalArticles} articles)`)
    setMessage({ type: "success", text: "Category deleted successfully" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Category Management</h3>
          <p className="text-gray-600">Organize your knowledge base content</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showAddSubcategoryDialog} onOpenChange={setShowAddSubcategoryDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Subcategory
              </Button>
            </DialogTrigger>
            <DialogContent aria-describedby="add-subcategory-description">
              <DialogHeader>
                <DialogTitle>Add Subcategory</DialogTitle>
              </DialogHeader>
              <div id="add-subcategory-description" className="text-sm text-gray-600 mb-4">
                Create a new subcategory within an existing category
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Parent Category</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedCategoryForSub?.id || ""}
                    onChange={(e) => {
                      const category = categories.find((c) => c.id === e.target.value)
                      setSelectedCategoryForSub(category || null)
                    }}
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
                    value={newSubcategory.name}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                    placeholder="Enter subcategory name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory-description">Description (Optional)</Label>
                  <Textarea
                    id="subcategory-description"
                    value={newSubcategory.description}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, description: e.target.value })}
                    placeholder="Enter subcategory description"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddSubcategoryDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSubcategory}>Create Subcategory</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent aria-describedby="add-category-description">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div id="add-category-description" className="text-sm text-gray-600 mb-4">
                Create a new main category for organizing articles
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Enter category name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-description">Description (Optional)</Label>
                  <Textarea
                    id="category-description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Enter category description"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory}>Create Category</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          {message.type === "error" ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {filteredCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Database className="h-6 w-6 text-blue-600" />
                  <div>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    {category.description && <p className="text-sm text-gray-600 mt-1">{category.description}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <FileText className="h-3 w-3" />
                    <span>{getTotalArticles(category)} articles</span>
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCategory(category)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {category.subcategories && category.subcategories.length > 0 && (
              <CardContent>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Subcategories:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Folder className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">{subcategory.name}</p>
                            {subcategory.description && (
                              <p className="text-xs text-gray-500">{subcategory.description}</p>
                            )}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {Array.isArray(subcategory.articles) ? subcategory.articles.length : 0} articles
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Database className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No categories found</p>
          <p className="text-sm text-gray-500 mt-1">
            {searchQuery ? "Try adjusting your search" : "Create your first category to get started"}
          </p>
        </div>
      )}

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent aria-describedby="edit-category-description">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div id="edit-category-description" className="text-sm text-gray-600 mb-4">
            Update category information and settings
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category-name">Category Name</Label>
              <Input
                id="edit-category-name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category-description">Description (Optional)</Label>
              <Textarea
                id="edit-category-description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCategory}>Update Category</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
