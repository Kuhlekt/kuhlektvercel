"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Download, Upload } from "lucide-react"
import type { User, Category, Article, AuditLog } from "../types/knowledge-base"

interface DataManagementProps {
  users: User[]
  categories: Category[]
  articles: Article[]
  auditLog: AuditLog[]
  onUpdateUsers: (users: User[]) => void
  onUpdateCategories: (categories: Category[]) => void
  onUpdateArticles: (articles: Article[]) => void
}

export function DataManagement({
  users,
  categories,
  articles,
  auditLog,
  onUpdateUsers,
  onUpdateCategories,
  onUpdateArticles,
}: DataManagementProps) {
  const handleExport = () => {
    const data = {
      users,
      categories,
      articles,
      auditLog,
      exportDate: new Date().toISOString(),
    }

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

        if (data.users) onUpdateUsers(data.users)
        if (data.categories) onUpdateCategories(data.categories)
        if (data.articles) onUpdateArticles(data.articles)

        alert("Data imported successfully!")
      } catch (error) {
        alert("Error importing data. Please check the file format.")
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Data Management</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">Export Data</h4>
          <p className="text-sm text-gray-600 mb-4">Download all knowledge base data as a JSON file.</p>
          <Button onClick={handleExport} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">Import Data</h4>
          <p className="text-sm text-gray-600 mb-4">Import knowledge base data from a JSON file.</p>
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{users.length}</div>
          <div className="text-sm text-blue-600">Users</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{categories.length}</div>
          <div className="text-sm text-green-600">Categories</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{articles.length}</div>
          <div className="text-sm text-purple-600">Articles</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{auditLog.length}</div>
          <div className="text-sm text-orange-600">Audit Entries</div>
        </div>
      </div>
    </div>
  )
}
