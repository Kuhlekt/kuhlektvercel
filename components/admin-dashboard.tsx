'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ArticleManagement } from './article-management'
import { CategoryManagement } from './category-management'
import { UserManagement } from './user-management'
import { AuditLog } from './audit-log'
import { DataManagement } from './data-management'
import { getArticles, getCategories, getUsers, getAuditLog } from '../utils/storage'
import { User } from '../types/knowledge-base'
import { Users, FileText, FolderOpen, Activity, Settings, LogOut } from 'lucide-react'

interface AdminDashboardProps {
  currentUser: User
  onLogout: () => void
}

export function AdminDashboard({ currentUser, onLogout }: AdminDashboardProps) {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalCategories: 0,
    totalUsers: 0,
    recentActivities: 0
  })

  useEffect(() => {
    const articles = getArticles()
    const categories = getCategories()
    const users = getUsers()
    const auditLog = getAuditLog()
    
    setStats({
      totalArticles: articles.length,
      totalCategories: categories.length,
      totalUsers: users.length,
      recentActivities: auditLog.length
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {currentUser.username}
              <Badge variant="secondary" className="ml-2">
                {currentUser.role}
              </Badge>
            </p>
          </div>
          <Button onClick={onLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalArticles}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <FolderOpen className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalCategories}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activities</CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.recentActivities}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <Tabs defaultValue="articles" className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-6">
                <TabsTrigger value="articles">Articles</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="audit">Audit Log</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="articles">
                <ArticleManagement />
              </TabsContent>

              <TabsContent value="categories">
                <CategoryManagement />
              </TabsContent>

              <TabsContent value="users">
                <UserManagement currentUser={currentUser} />
              </TabsContent>

              <TabsContent value="audit">
                <AuditLog />
              </TabsContent>

              <TabsContent value="data">
                <DataManagement />
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">System Settings</h3>
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">General Settings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">
                          System configuration and preferences will be available here.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Security Settings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">
                          Password policies and security configurations.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
