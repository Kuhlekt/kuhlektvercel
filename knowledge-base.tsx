"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Settings, Database, LogOut, User } from "lucide-react"

import { storage } from "./utils/storage"
import type { User as UserType, Category, Article, AuditLog } from "./types/knowledge-base"

import { HomeDashboard } from "./components/home-dashboard"
import { ArticleManagement } from "./components/article-management"
import { UserManagement } from "./components/user-management"
import { CategoryManagement } from "./components/category-management"
import { DataManagement } from "./components/data-management"
import { AuditLog as AuditLogComponent } from "./components/audit-log"
import { LoginModal } from "./components/login-modal"

export default function KnowledgeBase() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [users, setUsers] = useState<UserType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [auditLog, setAuditLog] = useState<AuditLog[]>([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize storage and auto-login as admin
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("🚀 Initializing Knowledge Base...")

        // Initialize storage
        storage.init()

        // Load data
        const loadedUsers = storage.getUsers()
        const loadedCategories = storage.getCategories()
        const loadedArticles = storage.getArticles()
        const loadedAuditLog = storage.getAuditLog()

        setUsers(loadedUsers)
        setCategories(loadedCategories)
        setArticles(loadedArticles)
        setAuditLog(loadedAuditLog)

        // Auto-login as admin (bypass login)
        const adminUser = loadedUsers.find((user) => user.role === "admin")
        if (adminUser) {
          console.log("🔓 Auto-logging in as admin:", adminUser.username)
          setCurrentUser(adminUser)
          storage.setCurrentUser(adminUser)
        } else {
          console.log("⚠️ No admin user found, creating default admin")
          // Create a default admin user if none exists
          const defaultAdmin: UserType = {
            id: "admin-default",
            username: "admin",
            email: "admin@kuhlekt.com",
            password: "admin",
            role: "admin",
            createdAt: new Date(),
            lastLogin: new Date(),
          }
          const updatedUsers = [...loadedUsers, defaultAdmin]
          setUsers(updatedUsers)
          storage.saveUsers(updatedUsers)
          setCurrentUser(defaultAdmin)
          storage.setCurrentUser(defaultAdmin)
        }

        console.log("✅ Knowledge Base initialized successfully")
      } catch (error) {
        console.error("❌ Error initializing app:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  const refreshData = () => {
    console.log("🔄 Refreshing data...")
    const loadedUsers = storage.getUsers()
    const loadedCategories = storage.getCategories()
    const loadedArticles = storage.getArticles()
    const loadedAuditLog = storage.getAuditLog()

    setUsers(loadedUsers)
    setCategories(loadedCategories)
    setArticles(loadedArticles)
    setAuditLog(loadedAuditLog)
  }

  const handleLogin = (user: UserType) => {
    setCurrentUser(user)
    setShowLoginModal(false)
    refreshData()
  }

  const handleLogout = () => {
    storage.setCurrentUser(null)
    setCurrentUser(null)
    setShowLoginModal(true)
  }

  const requireAuth = (action: () => void) => {
    // Always allow action since we bypassed login
    action()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading Knowledge Base...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Always show the main interface (bypassed login)
  const isAdmin = true // Always admin
  const canEdit = true // Always can edit

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Kuhlekt Knowledge Base</h1>
                <p className="text-sm text-gray-500">Centralized Information Management</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {currentUser && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{currentUser.username}</span>
                  <Badge variant={currentUser.role === "admin" ? "default" : "secondary"}>{currentUser.role}</Badge>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="home" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Home</span>
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Articles</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Admin</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Data</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-6">
            <HomeDashboard
              currentUser={currentUser}
              users={users}
              categories={categories}
              articles={articles}
              auditLog={auditLog}
              onRefresh={refreshData}
            />
          </TabsContent>

          <TabsContent value="articles" className="mt-6">
            <ArticleManagement currentUser={currentUser} categories={categories} onRefresh={refreshData} />
          </TabsContent>

          <TabsContent value="admin" className="mt-6">
            <div className="space-y-6">
              <UserManagement onRefresh={refreshData} />
              <CategoryManagement onRefresh={refreshData} />
              <AuditLogComponent auditLog={auditLog} users={users} />
            </div>
          </TabsContent>

          <TabsContent value="data" className="mt-6">
            <DataManagement
              users={users}
              categories={categories}
              articles={articles}
              auditLog={auditLog}
              onDataChange={refreshData}
            />
          </TabsContent>
        </Tabs>
      </main>

      {showLoginModal && <LoginModal onLogin={handleLogin} onClose={() => setShowLoginModal(false)} />}
    </div>
  )
}
