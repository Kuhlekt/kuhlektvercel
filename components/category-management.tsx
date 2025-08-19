"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Folder, FolderPlus } from 'lucide-react'
import type { Category } from "../types/knowledge-base"

interface CategoryManagementProps {
  categories: Category[]
  onAddCategory: (name: string) => void
  onAddSubcategory: (categoryId: string, name: string) => void
}

export function CategoryManagement({ categories, onAddCategory, onAddSubcategory }: CategoryManagementProps) {
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newSubcategoryName, setNewSubcategoryName] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState("")

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim())
      setNewCategoryName("")
    }
  }

  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (newSubcategoryName.trim() && selectedCategoryId) {
      onAddSubcategory(selectedCategoryId, newSubcategoryName.trim())
      setNewSubcategoryName("")
      setSelectedCategoryId("")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Folder className="h-5 w-5" />
            <span>Add New Category</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                required
              />
            </div>
            <Button type="submit" disabled={!newCategoryName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FolderPlus className="h-5 w-5" />
            <span>Add New Subcategory</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSubcategory} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="parentCategory">Parent Category</Label>
              <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId} required>
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
              <Label htmlFor="subcategoryName">Subcategory Name</Label>
              <Input
                id="subcategoryName"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                placeholder="Enter subcategory name"
                required
              />
            </div>
            <Button type="submit" disabled={!newSubcategoryName.trim() || !selectedCategoryId}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subcategory
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="p-3 border rounded-lg">
                <div className="font-medium flex items-center space-x-2">
                  <Folder className="h-4 w-4 text-blue-500" />
                  <span>{category.name}</span>
                  <span className="text-sm text-gray-500">({category.articles.length} articles)</span>
                </div>
                {category.subcategories.length > 0 && (
                  <div className="ml-6 mt-2 space-y-1">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="text-sm text-gray-600 flex items-center space-x-2">
                        <FolderPlus className="h-3 w-3 text-gray-400" />
                        <span>{subcategory.name}</span>
                        <span className="text-xs text-gray-400">({subcategory.articles.length} articles)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
