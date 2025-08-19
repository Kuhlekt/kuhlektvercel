"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Upload } from "lucide-react"
import { storage } from "../utils/storage"
import type { Category, Article } from "../types/knowledge-base"

interface AdminDashboardProps {
  articles: Article[]
  categories: Category[]
  onUpdateArticles: (articles: Article[]) => void
  onUpdateCategories: (categories: Category[]) => void
}

export function AdminDashboard({ articles, categories, onUpdateArticles, onUpdateCategories }: AdminDashboardProps) {
  const [importStatus, setImportStatus] = useState<string>("")

  const handleExportData = () => {
    const data = storage.exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `kuhlekt-kb-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        storage.importData(data)

        // Refresh the data
        onUpdateArticles(storage.getArticles())
        onUpdateCategories(storage.getCategories())

        setImportStatus("Data imported successfully!")
        setTimeout(() => setImportStatus(""), 3000)
      } catch (error) {
        setImportStatus("Error importing data. Please check the file format.")
        setTimeout(() => setImportStatus(""), 3000)
      }
    }
    reader.readAsText(file)
  }

  const stats = {
    totalArticles: articles.length,
    publishedArticles: articles.filter((a) => a.status === "published").length,
    draftArticles: articles.filter((a) => a.status === "draft").length,
    totalCategories: categories.length,
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your knowledge base</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Total Articles</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalArticles}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Published</h3>
          <p className="text-2xl font-bold text-green-600">{stats.publishedArticles}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Drafts</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.draftArticles}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Categories</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalCategories}</p>
        </div>
      </div>

      <Tabs defaultValue="data" className="space-y-4">
        <TabsList>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-4">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Backup & Restore</h2>
            <div className="flex space-x-4">
              <Button onClick={handleExportData} className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </Button>

              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <Upload className="w-4 h-4" />
                  <span>Import Data</span>
                </Button>
              </div>
            </div>

            {importStatus && (
              <div
                className={`mt-4 p-3 rounded ${
                  importStatus.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                }`}
              >
                {importStatus}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="articles" className="space-y-4">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Article Management</h2>
            <div className="space-y-4">
              {articles.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h3 className="font-medium">{article.title}</h3>
                    <p className="text-sm text-gray-500">
                      By {article.createdBy} • {article.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        article.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {article.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Category Management</h2>
            <div className="space-y-4">
              {categories.map((category) => {
                const articleCount = articles.filter((a) => a.categoryId === category.id).length
                return (
                  <div key={category.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                    <div className="text-sm text-gray-500">{articleCount} articles</div>
                  </div>
                )
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
