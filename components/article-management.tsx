'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Textarea } from './ui/textarea'
import { getArticles, getCategories, addArticle, updateArticle, deleteArticle } from '../utils/storage'
import { Article, Category } from '../types/knowledge-base'
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react'

export function ArticleManagement() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setArticles(getArticles())
    setCategories(getCategories())
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateArticle = () => {
    if (!formData.title || !formData.content) return

    const newArticle: Article = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      category: formData.category || 'Uncategorized',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'Admin'
    }

    addArticle(newArticle)
    loadData()
    setIsCreateModalOpen(false)
    resetForm()
  }

  const handleEditArticle = () => {
    if (!selectedArticle || !formData.title || !formData.content) return

    const updatedArticle: Article = {
      ...selectedArticle,
      title: formData.title,
      content: formData.content,
      category: formData.category || 'Uncategorized',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      updatedAt: new Date().toISOString()
    }

    updateArticle(updatedArticle)
    loadData()
    setIsEditModalOpen(false)
    resetForm()
  }

  const handleDeleteArticle = (articleId: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      deleteArticle(articleId)
      loadData()
    }
  }

  const openCreateModal = () => {
    resetForm()
    setIsCreateModalOpen(true)
  }

  const openEditModal = (article: Article) => {
    setSelectedArticle(article)
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category,
      tags: article.tags.join(', ')
    })
    setIsEditModalOpen(true)
  }

  const openViewModal = (article: Article) => {
    setSelectedArticle(article)
    setIsViewModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: '',
      tags: ''
    })
    setSelectedArticle(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Article Management</h2>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Article
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Articles List */}
      <div className="grid gap-4">
        {filteredArticles.map(article => (
          <Card key={article.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {article.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <Badge variant="secondary">{article.category}</Badge>
                    <span>By {article.author}</span>
                    <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
                  </div>
                  {article.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {article.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openViewModal(article)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(article)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteArticle(article.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No articles found matching your criteria.
        </div>
      )}

      {/* Create Article Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Article</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Article title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Article content (Markdown supported)"
                rows={12}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateArticle}>
                Create Article
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Article Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Article title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Article content (Markdown supported)"
                rows={12}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditArticle}>
                Update Article
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Article Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedArticle?.title}</DialogTitle>
          </DialogHeader>
          {selectedArticle && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <Badge variant="secondary">{selectedArticle.category}</Badge>
                <span>By {selectedArticle.author}</span>
                <span>{new Date(selectedArticle.updatedAt).toLocaleDateString()}</span>
              </div>
              {selectedArticle.tags.length > 0 && (
                <div className="flex gap-1">
                  {selectedArticle.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap">{selectedArticle.content}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
