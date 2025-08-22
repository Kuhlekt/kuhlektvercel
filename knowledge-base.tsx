"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navigation } from "./components/navigation"
import { CategoryTree } from "./components/category-tree"
import { ArticleList } from "./components/article-list"
import { ArticleViewer } from "./components/article-viewer"
import { AddArticleForm } from "./components/add-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { LoginModal } from "./components/login-modal"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Category, Article, User, AuditLogEntry } from "./types/knowledge-base"
import { apiDatabase } from "./utils/api-database"

export default function KnowledgeBase() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [currentView, setCurrentView] = useState<"browse" | "add" | "admin">("browse")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pageVisits, setPageVisits] = useState(0)

  // Load data on component mount
  useEffect(() => {
    loadData()
    incrementPageVisits()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [categoriesData, settingsData] = await Promise.all([apiDatabase.getCategories(), apiDatabase.getSettings()])
      setCategories(categoriesData)
      setPageVisits(settingsData.pageVisits)
    } catch (err) {
      setError("Failed to load data. Please try refreshing the page.")
      console.error("Error loading data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const incrementPageVisits = async () => {
    try {
      await apiDatabase.incrementPageVisits()
    } catch (err) {
      console.error("Error incrementing page visits:", err)
    }
  }

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      const users = await apiDatabase.getUsers()
      const user = users.find((u) => u.username === username && u.password === password)

      if (user) {
        setCurrentUser(user)

        // Log the login
        const auditLog = await apiDatabase.getAuditLog()
        const newEntry: AuditLogEntry = {
          id: Date.now().toString(),
          action: "login",
          user: user.username,
          timestamp: new Date().toISOString(),
          details: `User ${user.username} logged in`,
        }
        await apiDatabase.saveAuditLog([...auditLog, newEntry])

        return true
      }
      return false
    } catch (err) {
      console.error("Login error:", err)
      return false
    }
  }

  const handleLogout = async () => {
    if (currentUser) {
      try {
        // Log the logout
        const auditLog = await apiDatabase.getAuditLog()
        const newEntry: AuditLogEntry = {
          id: Date.now().toString(),
          action: "logout",
          user: currentUser.username,
          timestamp: new Date().toISOString(),
          details: `User ${currentUser.username} logged out`,
        }
        await apiDatabase.saveAuditLog([...auditLog, newEntry])
      } catch (err) {
        console.error("Error logging logout:", err)
      }
    }

    setCurrentUser(null)
    setCurrentView("browse")
  }

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    setSelectedArticle(null)
  }

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article)
  }

  const handleViewChange = (view: "browse" | "add" | "admin") => {
    setCurrentView(view)
    if (view === "browse") {
      setSelectedArticle(null)
    }
  }

  const handleDataUpdate = async () => {
    await loadData()
  }

  const exportData = async () => {
    try {
      const [categoriesData, usersData, auditLogData, settingsData] = await Promise.all([
        apiDatabase.getCategories(),
        apiDatabase.getUsers(),
        apiDatabase.getAuditLog(),
        apiDatabase.getSettings(),
      ])

      const exportData = {
        categories: categoriesData,
        users: usersData,
        auditLog: auditLogData,
        settings: settingsData,
        exportDate: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `knowledge-base-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError("Failed to export data")
      console.error("Export error:", err)
    }
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string)

        if (importData.categories) {
          await apiDatabase.saveCategories(importData.categories)
        }
        if (importData.users) {
          await apiDatabase.saveUsers(importData.users)
        }
        if (importData.auditLog) {
          await apiDatabase.saveAuditLog(importData.auditLog)
        }
        if (importData.settings) {
          await apiDatabase.saveSettings(importData.settings)
        }

        await loadData()
        setError(null)
      } catch (err) {
        setError("Failed to import data. Please check the file format.")
        console.error("Import error:", err)
      }
    }
    reader.readAsText(file)

    // Reset the input
    event.target.value = ""
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading knowledge base...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentUser={currentUser}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onViewChange={handleViewChange}
        currentView={currentView}
      />

      <div className="container mx-auto px-4 py-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="flex items-center justify-between">
              {error}
              <Button variant="outline" size="sm" onClick={loadData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
            <span className="text-sm text-gray-500">({pageVisits} visits)</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={loadData} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>

            <Button variant="outline" onClick={exportData} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <label className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </span>
              </Button>
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
          </div>
        </div>

        {currentView === "browse" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <CategoryTree
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
              />
            </div>

            <div className="lg:col-span-1">
              <ArticleList
                categories={categories}
                selectedCategory={selectedCategory}
                selectedArticle={selectedArticle}
                onArticleSelect={handleArticleSelect}
              />
            </div>

            <div className="lg:col-span-2">
              <ArticleViewer
                article={selectedArticle}
                currentUser={currentUser}
                onEdit={(article) => {
                  setSelectedArticle(article)
                  setCurrentView("add")
                }}
              />
            </div>
          </div>
        )}

        {currentView === "add" && (
          <AddArticleForm
            categories={categories}
            editingArticle={selectedArticle}
            currentUser={currentUser}
            onSave={handleDataUpdate}
            onCancel={() => {
              setCurrentView("browse")
              setSelectedArticle(null)
            }}
          />
        )}

        {currentView === "admin" && <AdminDashboard currentUser={currentUser} onDataUpdate={handleDataUpdate} />}
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
    </div>
  )
}
