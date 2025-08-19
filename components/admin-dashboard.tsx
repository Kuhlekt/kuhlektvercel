"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Upload } from "lucide-react"
import { storage } from "../utils/storage"
import type { Article, Category } from "../types/knowledge-base"

interface AdminDashboardProps {
  articles: Article[]
  categories: Category[]
  onUpdateArticles: (articles: Article[]) => void
  onUpdateCategories: (categories: Category[]) => void
}

export function AdminDashboard({ articles, categories, onUpdateArticles, onUpdateCategories }: AdminDashboardProps) {
  const [importStatus, setImportStatus] = useState<string>("")

  const handleExport = () => {
    const data = storage.exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `knowledge-base-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        const success = storage.importData(data)

        if (success) {
          setImportStatus("Import successful! Refreshing data...")
          // Refresh the data
          onUpdateArticles(storage.getArticles())
          onUpdateCategories(storage.getCategories())
          setTimeout(() => setImportStatus(""), 3000)
        } else {
          setImportStatus("Import failed. Please check the file format.")
        }
      } catch (error) {
        setImportStatus("Import failed. Invalid file format.")
      }
    }
    reader.readAsText(file)
  }

  const publishedArticles = articles.filter((a) => a.status === "published")
  const draftArticles = articles.filter((a) => a.status === "draft")

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your knowledge base</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Articles</h3>
              <p className="text-3xl font-bold text-blue-600">{articles.length}</p>
              <p className="text-sm text-gray-500">
                {publishedArticles.length} published, {draftArticles.length} drafts
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Categories</h3>
              <p className="text-3xl font-bold text-green-600">{categories.length}</p>
              <p className="text-sm text-gray-500">Active categories</p>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Users</h3>
              <p className="text-3xl font-bold text-purple-600">{storage.getUsers().length}</p>
              <p className="text-sm text-gray-500">Registered users</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Articles</h3>
            <div className="space-y-3">
              {articles
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, 5)
                .map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{article.title}</h4>
                      <p className="text-sm text-gray-500">
                        by {article.createdBy} • {article.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        article.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {article.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Export Data</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Download all knowledge base data as a JSON file for backup or migration.
                </p>
                <Button onClick={handleExport} className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export Data</span>
                </Button>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Import Data</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Import knowledge base data from a JSON file. This will replace existing data.
                </p>
                <div className="flex items-center space-x-2">
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" id="import-file" />
                  <Button asChild variant="outline">
                    <label htmlFor="import-file" className="flex items-center space-x-2 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Import Data</span>
                    </label>
                  </Button>
                </div>
                {importStatus && (
                  <p
                    className={`text-sm mt-2 ${
                      importStatus.includes("successful") ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {importStatus}
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
