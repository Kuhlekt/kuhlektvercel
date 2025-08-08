'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Download, Upload, Database, AlertTriangle, CheckCircle, FileText } from 'lucide-react'
import type { Article, Category, User, AuditLogEntry } from '@/types/knowledge-base'

interface DataManagementProps {
  articles: Article[]
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onDataImport: (data: {
    articles?: Article[]
    categories?: Category[]
    users?: User[]
    auditLog?: AuditLogEntry[]
  }) => void
  onAuditLog: (action: string, details: string) => void
}

export function DataManagement({ 
  articles, 
  categories, 
  users, 
  auditLog, 
  onDataImport, 
  onAuditLog 
}: DataManagementProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleExportData = async () => {
    setIsExporting(true)
    setExportStatus('idle')

    try {
      const exportData = {
        articles,
        categories,
        users: users.map(user => ({ ...user, password: '[REDACTED]' })), // Don't export passwords
        auditLog,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `knowledge-base-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      
      setExportStatus('success')
      onAuditLog('export_data', 'Exported knowledge base data')
    } catch (error) {
      console.error('Export error:', error)
      setExportStatus('error')
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportStatus('idle')
    setImportProgress(0)

    try {
      const text = await file.text()
      setImportProgress(25)
      
      const importData = JSON.parse(text)
      setImportProgress(50)
      
      // Validate the imported data structure
      if (!importData.articles || !importData.categories) {
        throw new Error('Invalid backup file format')
      }
      
      setImportProgress(75)
      
      // Process dates
      const processedData = {
        articles: importData.articles.map((article: any) => ({
          ...article,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt)
        })),
        categories: importData.categories,
        users: importData.users?.map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined
        })),
        auditLog: importData.auditLog?.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }))
      }
      
      setImportProgress(90)
      
      onDataImport(processedData)
      setImportProgress(100)
      setImportStatus('success')
      onAuditLog('import_data', `Imported knowledge base data from ${file.name}`)
    } catch (error) {
      console.error('Import error:', error)
      setImportStatus('error')
    } finally {
      setIsImporting(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const getDataStats = () => {
    const totalSize = JSON.stringify({ articles, categories, users, auditLog }).length
    const sizeInKB = Math.round(totalSize / 1024)
    
    return {
      articles: articles.length,
      categories: categories.length,
      users: users.length,
      auditEntries: auditLog.length,
      totalSize: sizeInKB
    }
  }

  const stats = getDataStats()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Data Management</h2>
        <p className="text-gray-600">Export and import knowledge base data</p>
      </div>

      {/* Data Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Overview
          </CardTitle>
          <CardDescription>
            Current knowledge base statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{stats.articles}</div>
              <div className="text-sm text-blue-700">Articles</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Database className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{stats.categories}</div>
              <div className="text-sm text-green-700">Categories</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Database className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">{stats.users}</div>
              <div className="text-sm text-purple-700">Users</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Database className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900">{stats.auditEntries}</div>
              <div className="text-sm text-orange-700">Audit Entries</div>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            Total data size: ~{stats.totalSize} KB
          </div>
        </CardContent>
      </Card>

      {/* Export Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </CardTitle>
          <CardDescription>
            Download a complete backup of your knowledge base
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Full Backup</p>
              <p className="text-sm text-gray-600">
                Includes all articles, categories, users, and audit logs
              </p>
            </div>
            <Button 
              onClick={handleExportData} 
              disabled={isExporting}
              className="min-w-32"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </>
              )}
            </Button>
          </div>

          {exportStatus === 'success' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Data exported successfully! Check your downloads folder.
              </AlertDescription>
            </Alert>
          )}

          {exportStatus === 'error' && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Failed to export data. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Import Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Data
          </CardTitle>
          <CardDescription>
            Restore from a backup file (this will replace current data)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> Importing data will replace all current content. 
              Make sure to export your current data first as a backup.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Restore from Backup</p>
              <p className="text-sm text-gray-600">
                Select a JSON backup file to restore
              </p>
            </div>
            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                disabled={isImporting}
                className="hidden"
                id="import-file"
              />
              <Button 
                asChild
                disabled={isImporting}
                variant="outline"
                className="min-w-32"
              >
                <label htmlFor="import-file" className="cursor-pointer">
                  {isImporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </>
                  )}
                </label>
              </Button>
            </div>
          </div>

          {isImporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Import Progress</span>
                <span>{importProgress}%</span>
              </div>
              <Progress value={importProgress} className="w-full" />
            </div>
          )}

          {importStatus === 'success' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Data imported successfully! The page will refresh to show the new data.
              </AlertDescription>
            </Alert>
          )}

          {importStatus === 'error' && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Failed to import data. Please check the file format and try again.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
