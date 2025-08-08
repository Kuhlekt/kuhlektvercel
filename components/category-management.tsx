'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Edit, Trash2, Folder, FolderPlus } from 'lucide-react'
import type { Category, Article } from '@/types/knowledge-base'

interface CategoryManagementProps {
  categories: Category[]
  articles: Article[]
  onCategoriesChange: (categories: Category[]) => void
  onAuditLog: (action: string, details: string, targetId?: string) => void
}

export function CategoryManagement({ 
  categories, 
  articles, 
  onCategoriesChange, 
  onAuditLog 
}: CategoryManagementProps) {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')

  const getArticleCount = (categoryId: string, subcategoryId?: string) => {
    if (subcategoryId) {
      return articles.filter(article => 
        article.categoryId === categoryId && article.subcategoryId === subcategoryId
      ).length
    }
    return articles.filter(article => 
      article.categoryId === categoryId && !article.subcategoryId
    ).length
  }

  const getTotalCategoryCount = (category: Category) => {
    const directCount = getArticleCount(category.id)
    const subcategoryCount = category.subcategories.reduce((sum, sub) => 
      sum + getArticleCount(category.id, sub.id), 0
    )
    return directCount + subcategoryCount
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim(),
      articles: [],
      subcategories: []
    }

    const updatedCategories = [...categories, newCategory]
    onCategoriesChange(updatedCategories)
    onAuditLog('create_category', `Created category "${newCategory.name}"`, newCategory.id)
    
    setNewCategoryName('')
    setNewCategoryDescription('')
  }

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return

    const articleCount = getTotalCategoryCount(category)
    if (articleCount > 0) {
      alert(`Cannot delete category "${category.name}" because it contains ${articleCount} articles.`)
      return
    }

    if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      const updatedCategories = categories.filter(c => c.id !== categoryId)
      onCategoriesChange(updatedCategories)
      onAuditLog('delete_category', `Deleted category "${category.name}"`, categoryId)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Category Management</h2>
          <p className="text-gray-600">Organize articles into categories and subcategories</p>
        </div>
      </div>

      {/* Add New Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name</label>
              <Input
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Input
                placeholder="Enter category description"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Categories ({categories.length})</CardTitle>
          <CardDescription>
            Manage existing categories and their subcategories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => {
              const totalCount = getTotalCategoryCount(category)
              
              return (
                <Card key={category.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Folder className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold text-lg">{category.name}</h3>
                          <Badge variant="secondary">
                            {totalCount} articles
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">
                          {category.description || 'No description provided'}
                        </p>
                        
                        {category.subcategories.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">Subcategories:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {category.subcategories.map((subcategory) => (
                                <div key={subcategory.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                  <Folder className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{subcategory.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {getArticleCount(category.id, subcategory.id)}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <FolderPlus className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={totalCount > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No categories yet</h3>
              <p className="text-gray-500">
                Create your first category to organize articles.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
