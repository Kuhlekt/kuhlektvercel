'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { exportData, importData } from '../utils/storage'
import { Download, Upload, Database, AlertTriangle } from 'lucide-react'

export function DataManagement() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleExportData = () => {
    setIsExporting(true)
    try {
      const data = exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `knowledge-base-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      alert('Failed to export data. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        importData(data)
        alert('Data imported successfully! Please refresh the page to see changes.')
      } catch (error) {
        alert('Failed to import data. Please check the file format.')
      } finally {
        setIsImporting(false)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Database className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Data Management</h2>
      </div>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Export all knowledge base data including articles, categories, users, and audit logs.
          </p>
          <Button 
            onClick={handleExportData} 
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Warning</p>
                <p className="text-yellow-700">
                  Importing data will overwrite existing content. Make sure to export your current data first as a backup.
                </p>
              </div>
            </div>
            <p className="text-gray-600">
              Import data from a previously exported JSON file.
            </p>
            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                disabled={isImporting}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {isImporting && (
              <p className="text-blue-600">Importing data...</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Storage Info */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Storage Type:</strong> Browser Local Storage</p>
            <p><strong>Data Persistence:</strong> Data persists until browser cache is cleared</p>
            <p><strong>Backup Recommendation:</strong> Regular exports recommended for data safety</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
