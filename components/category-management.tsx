"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Folder, FolderPlus, Trash2, Plus, AlertTriangle } from "lucide-react"
import type { Category } from "../types/knowledge-base"
import { apiDatabase } from "../utils/api-database"

interface CategoryManagementProps {
  categories: Category[]
  onCategoriesUpdate: () => void
}

export function CategoryManagement({ categories, onCategoriesUpdate }: CategoryManagementProps) {
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryDescription, setNewCategoryDescription] = useState("")
  const [newSubcategoryName, setNewSubcategoryName] = useState("")
  const [newSubcategoryDescription, setNewSubcategoryDescription] = useState("")
  const [selectedParentCategory, setSelectedParentCategory] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return

    try {
      setIsLoading(true)
      setError(null)

      console.log("🔄 CategoryManagement.handleAddCategory() - Adding category:", newCategoryName)

      await apiDatabase.addCategory(categories, newCategoryName.trim(), newCategoryDescription.trim() || undefined)

      setNewCategoryName("")
      setNewCategoryDescription("")

      console.log("✅ Category added, triggering UI update...")
      onCategoriesUpdate()
    } catch (error) {
      console.error("❌ Error adding category:", error)
      setError("Failed to add category. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSubcategory = async () => {
    if (!newSubcategoryName.trim() || !selectedParentCategory) return

    try {
      setIsLoading(true)
      setError(null)

      console.log("🔄 CategoryManagement.handleAddSubcategory() - Adding subcategory:", newSubcategoryName)

      await apiDatabase.addSubcategory(
        categories,
        selectedParentCategory,
        newSubcategoryName.trim(),
        newSubcategoryDescription.trim() || undefined,
      )

      setNewSubcategoryName("")
      setNewSubcategoryDescription("")
      setSelectedParentCategory("")

      console.log("✅ Subcategory added, triggering UI update...")
      onCategoriesUpdate()
    } catch (error) {
      console.error("❌ Error adding subcategory:", error)
      setError("Failed to add subcategory. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
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

    try {
      setIsLoading(true)
      setError(null)

      console.log("🔄 CategoryManagement.handleDeleteCategory() - Deleting category:", categoryId)

      await apiDatabase.deleteCategory(categories, categoryId)

      console.log("✅ Category deleted, triggering UI update...")
      onCategoriesUpdate()
    } catch (error) {
      console.error("❌ Error deleting category:", error)
      setError("Failed to delete category. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSubcategory = async (categoryId: string, subcategoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    const subcategory = category?.subcategories?.find((s) => s.id === subcategoryId)

    if (!subcategory) return

    const articleCount = subcategory.articles?.length || 0

    if (articleCount > 0) {
      if (
        !window.confirm(
          `This subcategory contains ${articleCount} articles. Are you sure you want to delete it? All articles will be lost.`,
        )
      ) {
        return
      }
    } else {
      if (!window.confirm("Are you sure you want to delete this subcategory?")) {
        return
      }
    }

    try {
      setIsLoading(true)
      setError(null)

      console.log("🔄 CategoryManagement.handleDeleteSubcategory() - Deleting subcategory:", subcategoryId)

      await apiDatabase.deleteSubcategory(categories, categoryId, subcategoryId)

      console.log("✅ Subcategory deleted, triggering UI update...")
      onCategoriesUpdate()
    } catch (error) {
      console.error("❌ Error deleting subcategory:", error)
      setError("Failed to delete subcategory. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Add New Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FolderPlus className="h-5 w-5 mr-2" />
            Add New Category
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoryName">Category Name *</Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="categoryDescription">Description</Label>
              <Input
                id="categoryDescription"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Optional description"
                disabled={isLoading}
              />
            </div>
          </div>
          <Button
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim() || isLoading}
            className="w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? "Adding..." : "Add Category"}
          </Button>
        </CardContent>
      </Card>

      {/* Add New Subcategory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Folder className="h-5 w-5 mr-2" />
            Add New Subcategory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="parentCategory">Parent Category *</Label>
            <Select value={selectedParentCategory} onValueChange={setSelectedParentCategory} disabled={isLoading}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subcategoryName">Subcategory Name *</Label>
              <Input
                id="subcategoryName"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                placeholder="Enter subcategory name"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="subcategoryDescription">Description</Label>
              <Input
                id="subcategoryDescription"
                value={newSubcategoryDescription}
                onChange={(e) => setNewSubcategoryDescription(e.target.value)}
                placeholder="Optional description"
                disabled={isLoading}
              />
            </div>
          </div>
          <Button
            onClick={handleAddSubcategory}
            disabled={!newSubcategoryName.trim() || !selectedParentCategory || isLoading}
            className="w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? "Adding..." : "Add Subcategory"}
          </Button>
        </CardContent>
      </Card>

      {/* Category Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Category Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No categories yet. Create your first category above.</p>
            ) : (
              categories.map((category) => {
                const totalArticles =
                  (category.articles?.length || 0) +
                  (category.subcategories?.reduce((sum, sub) => sum + (sub.articles?.length || 0), 0) || 0)

                return (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Folder className="h-5 w-5 text-blue-600" />
                        <div>
                          <span className="font-medium">{category.name}</span>
                          {category.description && <p className="text-sm text-gray-600">{category.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{totalArticles} articles</Badge>
                        <Badge variant="outline">{category.articles?.length || 0} direct</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="ml-6 space-y-1 mt-3">
                        {category.subcategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                          >
                            <div>
                              <span className="text-gray-700">• {sub.name}</span>
                              {sub.description && <span className="text-gray-500 ml-2">- {sub.description}</span>}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {sub.articles?.length || 0} articles
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteSubcategory(category.id, sub.id)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                disabled={isLoading}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
