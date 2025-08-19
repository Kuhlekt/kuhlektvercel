"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FolderOpen, Plus, MoreHorizontal, Edit, Trash2, FolderPlus, Folder } from "lucide-react"
import type { Category, Subcategory, Article } from "@/types/knowledge-base"

interface CategoryManagementProps {
  categories: Category[]
  articles: Article[]
  onAddCategory: (category: Omit<Category, "id">) => void
  onUpdateCategory: (id: string, updates: Partial<Category>) => void
  onDeleteCategory: (id: string) => void
  onAddSubcategory: (categoryId: string, subcategory: Omit<Subcategory, "id">) => void
  onUpdateSubcategory: (categoryId: string, subcategoryId: string, updates: Partial<Subcategory>) => void
  onDeleteSubcategory: (categoryId: string, subcategoryId: string) => void
}

export function CategoryManagement({
  categories,
  articles,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddSubcategory,
  onUpdateSubcategory,
  onDeleteSubcategory,
}: CategoryManagementProps) {
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddSubcategory, setShowAddSubcategory] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<{
    categoryId: string
    subcategory: Subcategory
  } | null>(null)

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
  })

  const [newSubcategory, setNewSubcategory] = useState({
    name: "",
    description: "",
  })

  const getArticleCount = (categoryId: string, subcategoryId?: string) => {
    return articles.filter(
      (article) =>
        article.categoryId === categoryId &&
        (subcategoryId ? article.subcategoryId === subcategoryId : !article.subcategoryId),
    ).length
  }

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return

    onAddCategory({
      name: newCategory.name.trim(),
      description: newCategory.description.trim(),
      color: newCategory.color,
      subcategories: [],
    })

    setNewCategory({ name: "", description: "", color: "#3b82f6" })
    setShowAddCategory(false)
  }

  const handleUpdateCategory = () => {
    if (!editingCategory) return

    onUpdateCategory(editingCategory.id, {
      name: editingCategory.name,
      description: editingCategory.description,
      color: editingCategory.color,
    })
    setEditingCategory(null)
  }

  const handleAddSubcategory = () => {
    if (!showAddSubcategory || !newSubcategory.name.trim()) return

    onAddSubcategory(showAddSubcategory, {
      name: newSubcategory.name.trim(),
      description: newSubcategory.description.trim(),
    })

    setNewSubcategory({ name: "", description: "" })
    setShowAddSubcategory(null)
  }

  const handleUpdateSubcategory = () => {
    if (!editingSubcategory) return

    onUpdateSubcategory(editingSubcategory.categoryId, editingSubcategory.subcategory.id, {
      name: editingSubcategory.subcategory.name,
      description: editingSubcategory.subcategory.description,
    })
    setEditingSubcategory(null)
  }

  const totalSubcategories = categories.reduce((sum, cat) => sum + (cat.subcategories?.length || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Category Management</h2>
          <p className="text-muted-foreground">Organize your knowledge base with categories and subcategories</p>
        </div>
        <Button onClick={() => setShowAddCategory(true)} className="flex items-center gap-2">
          <FolderPlus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subcategories</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubcategories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{getArticleCount(category.id)} articles</Badge>
                  <Button variant="outline" size="sm" onClick={() => setShowAddSubcategory(category.id)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Subcategory
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteCategory(category.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            {category.subcategories && category.subcategories.length > 0 && (
              <CardContent>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Subcategories</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{subcategory.name}</p>
                          <p className="text-sm text-muted-foreground">{subcategory.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {getArticleCount(category.id, subcategory.id)} articles
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  setEditingSubcategory({
                                    categoryId: category.id,
                                    subcategory,
                                  })
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onDeleteSubcategory(category.id, subcategory.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent aria-describedby="add-category-description">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription id="add-category-description">
              Create a new category to organize your articles
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-color">Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="category-color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="w-12 h-8 rounded border"
                />
                <Input
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  placeholder="#3b82f6"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddCategory(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Subcategory Dialog */}
      <Dialog open={!!showAddSubcategory} onOpenChange={() => setShowAddSubcategory(null)}>
        <DialogContent aria-describedby="add-subcategory-description">
          <DialogHeader>
            <DialogTitle>Add New Subcategory</DialogTitle>
            <DialogDescription id="add-subcategory-description">
              Create a new subcategory within the selected category
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subcategory-name">Name</Label>
              <Input
                id="subcategory-name"
                value={newSubcategory.name}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                placeholder="Enter subcategory name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory-description">Description</Label>
              <Textarea
                id="subcategory-description"
                value={newSubcategory.description}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, description: e.target.value })}
                placeholder="Enter subcategory description"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddSubcategory(null)}>
                Cancel
              </Button>
              <Button onClick={handleAddSubcategory}>Add Subcategory</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent aria-describedby="edit-category-description">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription id="edit-category-description">Update category information</DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category-name">Name</Label>
                <Input
                  id="edit-category-name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category-description">Description</Label>
                <Textarea
                  id="edit-category-description"
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category-color">Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="edit-category-color"
                    value={editingCategory.color}
                    onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                    className="w-12 h-8 rounded border"
                  />
                  <Input
                    value={editingCategory.color}
                    onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingCategory(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateCategory}>Update Category</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Subcategory Dialog */}
      <Dialog open={!!editingSubcategory} onOpenChange={() => setEditingSubcategory(null)}>
        <DialogContent aria-describedby="edit-subcategory-description">
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
            <DialogDescription id="edit-subcategory-description">Update subcategory information</DialogDescription>
          </DialogHeader>
          {editingSubcategory && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-subcategory-name">Name</Label>
                <Input
                  id="edit-subcategory-name"
                  value={editingSubcategory.subcategory.name}
                  onChange={(e) =>
                    setEditingSubcategory({
                      ...editingSubcategory,
                      subcategory: { ...editingSubcategory.subcategory, name: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-subcategory-description">Description</Label>
                <Textarea
                  id="edit-subcategory-description"
                  value={editingSubcategory.subcategory.description}
                  onChange={(e) =>
                    setEditingSubcategory({
                      ...editingSubcategory,
                      subcategory: { ...editingSubcategory.subcategory, description: e.target.value },
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingSubcategory(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateSubcategory}>Update Subcategory</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
