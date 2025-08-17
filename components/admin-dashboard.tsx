"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Users, FileText, Activity, Database, Shield, Clock, TrendingUp } from "lucide-react"
import { ArticleManagement } from "./article-management"
import { UserManagement } from "./user-management"
import { AuditLog } from "./audit-log"
import { DataManagement } from "./data-management"
import { storage } from "../utils/storage"
import type { User, Category, AuditLogEntry } from "../types/knowledge-base"

interface AdminDashboardProps {
  currentUser: User
  categories: Category[]
  onCategoriesUpdate: (categories: Category[]) => void
}

export function AdminDashboard({ currentUser, categories, onCategoriesUpdate }: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalCategories: 0,
    totalUsers: 0,
    recentActivity: 0,
  })

  useEffect(() => {
    loadData()
  }, [categories])

  const loadData = () => {
    try {
      const loadedUsers = storage.getUsers()
      const loadedAuditLog = storage.getAuditLog()

      setUsers(loadedUsers)
      setAuditLog(loadedAuditLog)

      // Calculate stats
      const totalArticles = categories.reduce((total, category) => {
        const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
        const subcategoryArticles = Array.isArray(category.subcategories)
          ? category.subcategories.reduce(
              (subTotal, sub) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
              0,
            )
          : 0
        return total + categoryArticles + subcategoryArticles
      }, 0)

      const recentActivity = loadedAuditLog.filter(
        (entry) => new Date().getTime() - entry.timestamp.getTime() < 24 * 60 * 60 * 1000,
      ).length

      setStats({
        totalArticles,
        totalCategories: categories.length,
        totalUsers: loadedUsers.length,
        recentActivity,
      })
    } catch (error) {
      console.error("Error loading admin data:", error)
    }
  }

  const handleUsersUpdate = (updatedUsers: User[]) => {
    setUsers(updatedUsers)
    loadData()
  }

  const handleAuditLogUpdate = (updatedAuditLog: AuditLogEntry[]) => {
    setAuditLog(updatedAuditLog)
    loadData()
  }

  const handleDataImported = () => {
    // Reload all data after import
    const newCategories = storage.getCategories()
    onCategoriesUpdate(newCategories)
    loadData()
  }

  const getRecentArticles = () => {
    const allArticles: any[] = []
    categories.forEach((category) => {
      if (Array.isArray(category.articles)) {
        category.articles.forEach((article) => {
          allArticles.push({ ...article, categoryName: category.name })
        })
      }
      if (Array.isArray(category.subcategories)) {
        category.subcategories.forEach((subcategory) => {
          if (Array.isArray(subcategory.articles)) {
            subcategory.articles.forEach((article) => {
              allArticles.push({
                ...article,
                categoryName: category.name,
                subcategoryName: subcategory.name,
              })
            })
          }
        })
      }
    })
    return allArticles.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5)
  }

  const recentArticles = getRecentArticles()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser.username}</p>
        </div>
        <Badge variant="outline" className="flex items-center space-x-1">
          <Shield className="h-3 w-3" />
          <span>Administrator</span>
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles}</div>
            <p className="text-xs text-muted-foreground">Knowledge base articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">Content categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">System users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity}</div>
            <p className="text-xs text-muted-foreground">Actions in last 24h</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Articles</span>
            </CardTitle>
            <CardDescription>Latest updated articles</CardDescription>
          </CardHeader>
          <CardContent>
            {recentArticles.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No articles found</p>
            ) : (
              <div className="space-y-3">
                {recentArticles.map((article) => (
                  <div key={article.id} className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{article.title}</h4>
                      <p className="text-xs text-gray-500">
                        {article.categoryName}
                        {article.subcategoryName && ` > ${article.subcategoryName}`}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">{new Date(article.updatedAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>System Health</span>
            </CardTitle>
            <CardDescription>Current system status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <Badge variant="outline" className="text-green-600">
                  Healthy
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Integrity</span>
                <Badge variant="outline" className="text-green-600">
                  Good
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">User Sessions</span>
                <Badge variant="outline" className="text-blue-600">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Backup Status</span>
                <Badge variant="outline" className="text-orange-600">
                  Manual
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4">
          <ArticleManagement
            categories={categories}
            onCategoriesUpdate={onCategoriesUpdate}
            currentUser={currentUser}
          />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserManagement currentUser={currentUser} />
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <DataManagement onDataImported={handleDataImported} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <AuditLog auditLog={auditLog} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>System Settings</span>
              </CardTitle>
              <CardDescription>Configure system preferences and options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Automatic Backups</h4>
                    <p className="text-sm text-gray-600">Enable automatic data backups</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">User Registration</h4>
                    <p className="text-sm text-gray-600">Allow new user registration</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Configure email alerts</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
