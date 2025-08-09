'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Textarea } from './ui/textarea'
import { getCategories, saveCategories, getArticles } from '../utils/storage'
import { Category } from '../types/knowledge-base'
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react'

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = () => {
    setCategories(getCategories())
  }

  const getCategoryArticleCount = (categoryName: string) => {
    const articles = getArticles()
    return articles.filter(article => article.category === categoryName).length
  }

  const handleCreateCategory = () => {
    if (!formData.name) return

    const newCategory: Category = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description
    }

    const updatedCategories = [...categories, newCategory]
    saveCategories(updatedCategories)
    loadCategories()
    setIsCreateModalOpen(false)
    resetForm()
  }

  const handleEditCategory = () => {
    if (!selectedCategory || !formData.name) return

    const updatedCategory: Category = {
      ...selectedCategory,
      name: formData.name,
      description: formData.description
    }

    const updatedCategories = categories.map(cat =>
      cat.id === selectedCategory.id ? updatedCategory : cat
    )
    saveCategories(updatedCategories)
    loadCategories()
    setIsEditModalOpen(false)
    resetForm()
  }

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    if (!category) return

    const articleCount = getCategoryArticleCount(category.name)
    if (articleCount > 0) {
      alert(`Cannot delete category "${category.name}" because it contains ${articleCount} articles. Please move or delete the articles first.`)
      return
    }

    if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      const updatedCategories = categories.filter(cat => cat.id !== categoryId)
      saveCategories(updatedCategories)
      loadCategories()
    }
  }

  const openCreateModal = () => {
    resetForm()
    setIsCreateModalOpen(true)
  }

  const openEditModal = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description
    })
    setIsEditModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    })
    setSelectedCategory(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Category Management</h2>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(category)}
                  >
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
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-3">
                {category.description || 'No description provided'}
              </p>
              <div className="text-sm text-gray-500">
                {getCategoryArticleCount(category.name)} articles
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No categories found. Create your first category to get started.
        </div>
      )}

      {/* Create Category Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Category description"
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCategory}>
                Create Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Category description"
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCategory}>
                Update Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
