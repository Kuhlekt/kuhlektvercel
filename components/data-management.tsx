"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Trash2, AlertCircle, CheckCircle } from 'lucide-react'
import { storage, dataManager } from "../utils/storage"
import { formatFileSize } from "@/lib/utils"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onCategoriesUpdate: (categories: Category[]) => void
  onUsersUpdate: (users: User[]) => void
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
}

export function DataManagement({ 
  categories, 
  users, 
  auditLog, 
  onCategoriesUpdate,
  onUsersUpdate,
  onAuditLogUpdate
}: DataManagementProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      setMessage(null)
      
      await dataManager.exportData()
      
      setMessage({ type: 'success', text: 'Data exported successfully!' })
    } catch (error) {
      console.error('Export failed:', error)
      setMessage({ type: 'error', text: 'Failed to export data. Please try again.' })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsImporting(true)
      setImportProgress(0)
      setMessage(null)

      // Validate file type
      if (!file.name.endsWith('.json')) {
        throw new Error('Please select a valid JSON backup file')
      }

      // Simulate progress for better UX
      setImportProgress(25)

      const data = await dataManager.importData(file)
      setImportProgress(50)

      // Additional validation
      if (!data.categories || !data.users || !data.auditLog) {
        throw new Error('Invalid backup file format')
      }

      setImportProgress(75)

      // Convert date strings back to Date objects
      const categoriesWithDates = data.categories.map((category: any) => ({
        ...category,
        articles: category.articles.map((article: any) => ({
          ...article,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt)
        })),
        subcategories: category.subcategories.map((subcategory: any) => ({
          ...subcategory,
          articles: subcategory.articles.map((article: any) => ({
            ...article,
            createdAt: new Date(article.createdAt),
            updatedAt: new Date(article.updatedAt)
          }))
        }))
      }))

      const usersWithDates = data.users.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined
      }))

      const auditLogWithDates = data.auditLog.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }))

      // Import the data
      const success = storage.importData({
        categories: categoriesWithDates,
        users: usersWithDates,
        auditLog: auditLogWithDates,
        pageVisits: data.pageVisits || 0
      })

      if (!success) {
        throw new Error('Failed to import data')
      }

      setImportProgress(100)

      // Update parent component state
      onCategoriesUpdate(categoriesWithDates)
      onUsersUpdate(usersWithDates)
      onAuditLogUpdate(auditLogWithDates)

      setMessage({ type: 'success', text: 'Data imported successfully!' })
    } catch (error) {
      console.error('Import failed:', error)
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to import data. Please try again.' 
      })
    } finally {
      setIsImporting(false)
      setImportProgress(0)
      // Reset file input
      event.target.value = ''
    }
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        storage.clearAll()
        onCategoriesUpdate([])
        onUsersUpdate([])
        onAuditLogUpdate([])
        setMessage({ type: 'success', text: 'All data cleared successfully!' })
      } catch (error) {
        console.error('Clear failed:', error)
        setMessage({ type: 'error', text: 'Failed to clear data. Please try again.' })
      }
    }
  }

  const getDataStats = () => {
    const totalArticles = categories.reduce((total, category) => {
      const categoryArticles = category.articles.length
      const subcategoryArticles = category.subcategories.reduce(
        (subTotal, sub) => subTotal + sub.articles.length,
        0
      )
      return total + categoryArticles + subcategoryArticles
    }, 0)

    const dataSize = JSON.stringify({ categories, users, auditLog }).length
    
    return {
      categories: categories.length,
      articles: totalArticles,
      users: users.length,
      auditEntries: auditLog.length,
      dataSize: formatFileSize(dataSize)
    }
  }

  const stats = getDataStats()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Data Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.categories}</div>
              <div className="text-sm text-gray-500">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.articles}</div>
              <div className="text-sm text-gray-500">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.users}</div>
              <div className="text-sm text-gray-500">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.auditEntries}</div>
              <div className="text-sm text-gray-500">Audit Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.dataSize}</div>
              <div className="text-sm text-gray-500">Data Size</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Download a complete backup of all knowledge base data including articles, categories, users, and audit logs.
            </p>
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? (
                <>
                  <Download className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Backup
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Import Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Import Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Restore data from a previously exported backup file. This will replace all current data.
            </p>
            <div className="space-y-2">
              <Label htmlFor="import-file">Select Backup File</Label>
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
              />
            </div>
            {isImporting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Importing...</span>
                  <span>{importProgress}%</span>
                </div>
                <Progress value={importProgress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Clear All Data */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Permanently delete all knowledge base data. This action cannot be undone.
          </p>
          <Button 
            variant="destructive" 
            onClick={handleClearAll}
            className="w-full"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>

      {/* Status Messages */}
      {message && (
        <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          {message.type === 'error' ? (
            <AlertCircle className="h-4 w-4 text-red-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
