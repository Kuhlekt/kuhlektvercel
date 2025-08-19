"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, FolderTree, Activity, Eye, Plus, Folder, Download, Upload, Trash2 } from 'lucide-react'
import { UserManagementTable } from "./user-management-table"
import { AuditLog } from "./audit-log"
import { DataManagement } from "./data-management"
import { storage } from "../utils/storage"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface AdminDashboardProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onCategoriesUpdate: (categories: Category[]) => void
  onUsersUpdate: (users: User[]) => void
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
}

export function AdminDashboard({
  categories,
  users,
  auditLog,
  onCategoriesUpdate,
  onUsersUpdate,
  onAuditLogUpdate,
}: AdminDashboardProps) {
  const [pageVisits, setPageVisits] = useState(0)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newSubcategoryName, setNewSubcategoryName] = useState("")
  const [selectedParentCategory, setSelectedParentCategory] = useState("")

  useEffect(() => {
    setPageVisits(storage.getPageVisits())
  }, [])

  const getTotalArticles = () => {
    return categories.reduce((total, category) => {
      const categoryArticles = category.articles.length
      const subcategoryArticles = category.subcategories.reduce(
        (subTotal, sub) => subTotal + sub.articles.length,
        0
      )
      return total + categoryArticles + subcategoryArticles
    }, 0)
  }

  const getTotalSubcategories = () => {
    return categories.reduce((total, category) => total + category.subcategories.length, 0)
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      articles: [],
      subcategories: []
    }

    const updatedCategories = [...categories, newCategory]
    onCategoriesUpdate(updatedCategories)
    storage.saveCategories(updatedCategories)
    
    storage.addAuditEntry({
      action: "create",
      entityType: "category",
      entityId: newCategory.id,
      details: `Created category: ${newCategory.name}`,
      userId: "admin"
    })

    setNewCategoryName("")
  }

  const handleAddSubcategory = () => {
    if (!newSubcategoryName.trim() || !selectedParentCategory) return

    const updatedCategories = categories.map(category => {
      if (category.id === selectedParentCategory) {
        const newSubcategory = {
          id: Date.now().toString(),
          name: newSubcategoryName.trim(),
          articles: []
        }
        
        return {
          ...category,
          subcategories: [...category.subcategories, newSubcategory]
        }
      }
      return category
    })

    onCategoriesUpdate(updatedCategories)
    storage.saveCategories(updatedCategories)
    
    const parentCategoryName = categories.find(c => c.id === selectedParentCategory)?.name
    storage.addAuditEntry({
      action: "create",
      entityType: "subcategory",
      entityId: Date.now().toString(),
      details: `Created subcategory: ${newSubcategoryName.trim()} in ${parentCategoryName}`,
      userId: "admin"
    })

    setNewSubcategoryName("")
    setSelectedParentCategory("")
  }

  const stats = [
    {
      title: "Total Articles",
      value: getTotalArticles(),
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Categories",
      value: categories.length,
      icon: FolderTree,
      color: "text-green-600"
    },
    {
      title: "Subcategories", 
      value: getTotalSubcategories(),
      icon: Folder,
      color: "text-purple-600"
    },
    {
      title: "Users",
      value: users.length,
      icon: Users,
      color: "text-orange-600"
    },
    {
      title: "Page Visits",
      value: pageVisits,
      icon: Eye,
      color: "text-indigo-600"
    },
    {
      title: "Recent Activities",
      value: auditLog.length,
      icon: Activity,
      color: "text-red-600"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <TabsTrigger value="users">Users</TabsTrigger>
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
                        <p className="text-sm font-medium">{entry.action} {entry.entityType}</p>
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
                    const totalArticles = category.articles.length + 
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
                  />
                </div>
                <Button onClick={handleAddCategory} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
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
                  <Select value={selectedParentCategory} onValueChange={setSelectedParentCategory}>
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
                  />
                </div>
                <Button onClick={handleAddSubcategory} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subcategory
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
                  const totalArticles = category.articles.length + 
                    category.subcategories.reduce((sum, sub) => sum + sub.articles.length, 0)
                  
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
                        </div>
                      </div>
                      
                      {category.subcategories.length > 0 && (
                        <div className="ml-6 space-y-1">
                          {category.subcategories.map((sub) => (
                            <div key={sub.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">• {sub.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {sub.articles.length}
                              </Badge>
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

        <TabsContent value="users">
          <UserManagementTable
            users={users}
            onUsersUpdate={onUsersUpdate}
          />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLog auditLog={auditLog} />
        </TabsContent>

        <TabsContent value="data">
          <DataManagement
            categories={categories}
            users={users}
            auditLog={auditLog}
            onCategoriesUpdate={onCategoriesUpdate}
            onUsersUpdate={onUsersUpdate}
            onAuditLogUpdate={onAuditLogUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
