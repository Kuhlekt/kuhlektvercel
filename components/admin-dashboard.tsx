"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserManagement } from "./user-management"
import { CategoryManagement } from "./category-management"
import { ArticleManagement } from "./article-management"
import { AuditLog } from "./audit-log"
import { DataManagement } from "./data-management"
import { Users, FolderTree, FileText, Activity, Database } from "lucide-react"

export function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleDataImported = () => {
    // Force refresh of all components
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your knowledge base system</p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderTree className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Audit Log
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement key={`users-${refreshKey}`} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Management</CardTitle>
              <CardDescription>Organize your knowledge base with categories</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryManagement key={`categories-${refreshKey}`} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Article Management</CardTitle>
              <CardDescription>Create, edit, and manage knowledge base articles</CardDescription>
            </CardHeader>
            <CardContent>
              <ArticleManagement key={`articles-${refreshKey}`} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>Track all system activities and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <AuditLog key={`audit-${refreshKey}`} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Import and export knowledge base data</CardDescription>
            </CardHeader>
            <CardContent>
              <DataManagement onDataImported={handleDataImported} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
