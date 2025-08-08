"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, Database, AlertTriangle, CheckCircle, Clock, HardDrive } from 'lucide-react'
import { storage, dataManager } from "../utils/storage"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onImportData: (data: { categories: Category[], users: User[], auditLog: AuditLogEntry[] }) => void
}

export function DataManagement({ categories, users, auditLog, onImportData }: DataManagementProps) {
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const lastBackupTime = storage.getLastBackupTime()
  const hasStoredData = storage.hasStoredData()

  const handleExport = () => {
    try {
      dataManager.exportData()
      setImportStatus({ type: 'success', message: 'Data exported successfully!' })
    } catch (error) {
      setImportStatus({ type: 'error', message: 'Failed to export data: ' + error })
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportStatus(null)

    try {
      const data = await dataManager.importData(file)
      onImportData(data)
      setImportStatus({ type: 'success', message: 'Data imported successfully!' })
    } catch (error) {
      setImportStatus({ type: 'error', message: String(error) })
    }

    setIsImporting(false)
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const clearStoredData = () => {
    if (window.confirm('Are you sure you want to clear all stored data? This action cannot be undone.')) {
      storage.clearAll()
      setImportStatus({ type: 'success', message: 'All stored data cleared.' })
      // Reload page to reset to initial data
      window.location.reload()
    }
  }

  const getStorageSize = () => {
    try {
      let total = 0
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith('kb_')) {
          total += localStorage[key].length
        }
      }
      return (total / 1024).toFixed(2) + ' KB'
    } catch (error) {
      return 'Unknown'
    }
  }

  return (
    <div className="space-y-6">
      {/* Storage Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HardDrive className="h-5 w-5" />
            <span>Storage Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Storage Size</p>
                <p className="text-lg font-bold">{getStorageSize()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Last Backup</p>
                <p className="text-sm text-gray-600">
                  {lastBackupTime ? lastBackupTime.toLocaleString() : 'Never'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {hasStoredData ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              )}
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge variant={hasStoredData ? "default" : "secondary"}>
                  {hasStoredData ? "Data Stored" : "Using Defaults"}
                </Badge>
              </div>
            </div>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <Database className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <p>
                <strong>Persistent Storage:</strong> Your articles and data are automatically saved to browser storage 
                and will persist across deployments and browser sessions.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Data Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
              <p className="text-sm text-gray-600">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {categories.reduce((total, cat) => 
                  total + cat.articles.length + cat.subcategories.reduce((subTotal, sub) => 
                    subTotal + sub.articles.length, 0
                  ), 0
                )}
              </p>
              <p className="text-sm text-gray-600">Articles</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{users.length}</p>
              <p className="text-sm text-gray-600">Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{auditLog.length}</p>
              <p className="text-sm text-gray-600">Audit Entries</p>
            </div>
          </div>

          {/* Export/Import Actions */}
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleExport} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Backup</span>
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
            <Button 
              onClick={handleImportClick} 
              variant="outline" 
              disabled={isImporting}
              className="flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>{isImporting ? 'Importing...' : 'Import Backup'}</span>
            </Button>

            <Button 
              onClick={clearStoredData} 
              variant="destructive" 
              className="flex items-center space-x-2"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Clear All Data</span>
            </Button>
          </div>

          {/* Status Messages */}
          {importStatus && (
            <Alert variant={importStatus.type === 'error' ? 'destructive' : 'default'}>
              {importStatus.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription>{importStatus.message}</AlertDescription>
            </Alert>
          )}

          {/* Instructions */}
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Export Backup:</strong> Download all your data as a JSON file for safekeeping.</p>
            <p><strong>Import Backup:</strong> Restore data from a previously exported backup file.</p>
            <p><strong>Automatic Saving:</strong> Changes are automatically saved to browser storage.</p>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Protection Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Deployment Protection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="space-y-2">
                <p><strong>✅ Your articles are protected!</strong></p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>All data is automatically saved to browser localStorage</li>
                  <li>Articles persist across deployments and browser sessions</li>
                  <li>Export backups regularly for extra safety</li>
                  <li>Import/export functionality for data migration</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
