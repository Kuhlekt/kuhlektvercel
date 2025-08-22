"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, FileText, FolderTree, Plus, Folder, Trash2, AlertTriangle } from "lucide-react"
import { ArticleManagement } from "./article-management"
import { AuditLog } from "./audit-log"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"
import { apiDatabase } from "../utils/api-database"

interface AdminDashboardProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onCategoriesUpdate: () => void
  onUsersUpdate: () => void
  onAuditLogUpdate: () => void
}

export function AdminDashboard({
  categories,
  users,
  auditLog,
  onCategoriesUpdate,
  onUsersUpdate,
  onAuditLogUpdate,
}: AdminDashboardProps) {
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newSubcategoryName, setNewSubcategoryName] = useState("")
  const [selectedParentCategory, setSelectedParentCategory] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getTotalArticles = () => {
    return categories.reduce((total, category) => {
      const categoryArticles = category.articles.length
      const subcategoryArticles = category.subcategories.reduce((subTotal, sub) => subTotal + sub.articles.length, 0)
      return total + categoryArticles + subcategoryArticles
    }, 0)
  }

  const getTotalSubcategories = () => {
    return categories.reduce((total, category) => total + category.subcategories.length, 0)
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return

    try {
      setIsLoading(true)
      setError(null)

      await apiDatabase.addCategory(categories, newCategoryName.trim())
      setNewCategoryName("")
      onCategoriesUpdate()
    } catch (error) {
      console.error("Error adding category:", error)
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

      await apiDatabase.addSubcategory(categories, selectedParentCategory, newSubcategoryName.trim())
      setNewSubcategoryName("")
      setSelectedParentCategory("")
      onCategoriesUpdate()
    } catch (error) {
      console.error("Error adding subcategory:", error)
      setError("Failed to add subcategory. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm("Are you sure you want to delete this category? All articles in it will be lost.")) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      await apiDatabase.deleteCategory(categories, categoryId)
      onCategoriesUpdate()
    } catch (error) {
      console.error("Error deleting category:", error)
      setError("Failed to delete category. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSubcategory = async (categoryId: string, subcategoryId: string) => {
    if (!window.confirm("Are you sure you want to delete this subcategory? All articles in it will be lost.")) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      await apiDatabase.deleteSubcategory(categories, categoryId, subcategoryId)
      onCategoriesUpdate()
    } catch (error) {
      console.error("Error deleting subcategory:", error)
      setError("Failed to delete subcategory. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = async () => {
    try {
      setError(null)
      await apiDatabase.exportData()
    } catch (error) {
      console.error("Error exporting data:", error)
      setError("Failed to export data. Please try again.")
    }
  }

  const handleImportData = async (file: File) => {
    try {
      setIsLoading(true)
      setError(null)

      await apiDatabase.importData(file)

      // Refresh all data
      onCategoriesUpdate()
      onUsersUpdate()
      onAuditLogUpdate()

      alert("Data imported successfully!")
    } catch (error) {
      console.error("Error importing data:", error)
      setError(error instanceof Error ? error.message : "Failed to import data.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearAllData = async () => {
    if (!window.confirm("Are you sure you want to clear ALL data? This cannot be undone!")) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      await apiDatabase.clearAllData()

      // Refresh all data
      onCategoriesUpdate()
      onUsersUpdate()
      onAuditLogUpdate()

      alert("All data cleared successfully!")
    } catch (error) {
      console.error("Error clearing data:", error)
      setError("Failed to clear data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const stats = [
    {
      title: "Total Articles",
      value: getTotalArticles(),
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Categories",
      value: categories.length,
      icon: FolderTree,
      color: "text-green-600",
    },
    {
      title: "Subcategories",
      value: getTotalSubcategories(),
      icon: Folder,
      color: "text-purple-600",
    },
    {
      title: "Users",
      value: users.length,
      icon: Users,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {auditLog.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium">{entry.action}</p>
                        <p className="text-xs text-gray-600">{entry.details}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {entry.timestamp.toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.slice(0, 5).map((category) => {
                    const totalArticles =
                      category.articles.length +
                      category.subcategories.reduce((sum, sub) => sum + sub.articles.length, 0)

                    return (
                      <div key={category.id} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category.name}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{totalArticles} articles</Badge>
                          <Badge variant="outline">{category.subcategories.length} subs</Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Add New Category</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    disabled={isLoading}
                  />
                </div>
                <Button onClick={handleAddCategory} className="w-full" disabled={!newCategoryName.trim() || isLoading}>
                  <Plus className="h-4 w-4 mr-2" />
                  {isLoading ? "Adding..." : "Add Category"}
                </Button>
              </CardContent>
            </Card>

            {/* Add Subcategory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Add New Subcategory</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="parentCategory">Parent Category</Label>
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
                <div>
                  <Label htmlFor="subcategoryName">Subcategory Name</Label>
                  <Input
                    id="subcategoryName"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    placeholder="Enter subcategory name"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={handleAddSubcategory}
                  className="w-full"
                  disabled={!newSubcategoryName.trim() || !selectedParentCategory || isLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isLoading ? "Adding..." : "Add Subcategory"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Category Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Category Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category) => {
                  const totalArticles =
                    category.articles.length + category.subcategories.reduce((sum, sub) => sum + sub.articles.length, 0)

                  return (
                    <div key={category.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Folder className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{totalArticles} total</Badge>
                          <Badge variant="outline">{category.articles.length} direct</Badge>
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

                      {category.subcategories.length > 0 && (
                        <div className="ml-6 space-y-1">
                          {category.subcategories.map((sub) => (
                            <div key={sub.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">• {sub.name}</span>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {sub.articles.length}
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
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles">
          <ArticleManagement
            categories={categories}
            onEditArticle={(article) => console.log("Edit article:", article)}
            onDeleteArticle={(articleId) => console.log("Delete article:", articleId)}
          />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLog auditLog={auditLog} />
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          {/* Export/Import */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Export */}
            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">Download a complete backup of all your knowledge base data.</p>
                <Button onClick={handleExportData} className="w-full" disabled={isLoading}>
                  Export Data
                </Button>
              </CardContent>
            </Card>

            {/* Import */}
            <Card>
              <CardHeader>
                <CardTitle>Import Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Restore your knowledge base from a backup file. This will replace all current data.
                </p>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Warning:</strong> Importing will completely replace all existing data.
                  </AlertDescription>
                </Alert>
                <Input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleImportData(file)
                    }
                  }}
                  disabled={isLoading}
                />
              </CardContent>
            </Card>
          </div>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-800">Clear All Data</h4>
                  <p className="text-sm text-red-600">
                    Permanently delete all articles, categories, and audit logs. This action cannot be undone.
                  </p>
                </div>
                <Button variant="destructive" onClick={handleClearAllData} disabled={isLoading}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isLoading ? "Clearing..." : "Clear All"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
