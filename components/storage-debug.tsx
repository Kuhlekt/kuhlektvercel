"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { storage } from "../utils/storage"
import { Bug, X } from "lucide-react"

export function StorageDebug() {
  const [isOpen, setIsOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const handleDebug = () => {
    try {
      const info = {
        storageInfo: storage.getStorageInfo(),
        healthCheck: storage.checkHealth(),
        hasAnyData: storage.hasAnyData(),
        categories: storage.getCategories(),
        users: storage.getUsers(),
        auditLog: storage.getAuditLog(),
        pageVisits: storage.getPageVisits(),
      }

      // Count articles
      const totalArticles = info.categories.reduce((total: number, category: any) => {
        const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
        const subcategoryArticles = Array.isArray(category.subcategories)
          ? category.subcategories.reduce(
              (subTotal: number, sub: any) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
              0,
            )
          : 0
        return total + categoryArticles + subcategoryArticles
      }, 0)

      info.totalArticles = totalArticles
      setDebugInfo(info)
      setIsOpen(true)
    } catch (error) {
      console.error("Debug error:", error)
      setDebugInfo({ error: error.message })
      setIsOpen(true)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={handleDebug} className="fixed bottom-4 right-4 z-50 bg-transparent" size="sm" variant="outline">
        <Bug className="h-4 w-4 mr-2" />
        Debug Storage
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Storage Debug Information</CardTitle>
          <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {debugInfo?.error ? (
            <div className="text-red-600">Error: {debugInfo.error}</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Storage Health</h3>
                  <Badge variant={debugInfo?.healthCheck?.healthy ? "default" : "destructive"}>
                    {debugInfo?.healthCheck?.healthy ? "Healthy" : "Issues Found"}
                  </Badge>
                  {debugInfo?.healthCheck?.issues?.length > 0 && (
                    <ul className="mt-2 text-sm text-red-600">
                      {debugInfo.healthCheck.issues.map((issue: string, index: number) => (
                        <li key={index}>• {issue}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Data Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div>Categories: {debugInfo?.categories?.length || 0}</div>
                    <div>Total Articles: {debugInfo?.totalArticles || 0}</div>
                    <div>Users: {debugInfo?.users?.length || 0}</div>
                    <div>Audit Entries: {debugInfo?.auditLog?.length || 0}</div>
                    <div>Page Visits: {debugInfo?.pageVisits || 0}</div>
                    <div>Has Data: {debugInfo?.hasAnyData ? "Yes" : "No"}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Storage Info</h3>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(debugInfo?.storageInfo, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Categories Structure</h3>
                <div className="bg-gray-100 p-2 rounded text-xs max-h-60 overflow-auto">
                  {debugInfo?.categories?.map((category: any, index: number) => (
                    <div key={index} className="mb-2">
                      <strong>{category.name}</strong> ({category.articles?.length || 0} articles)
                      {category.subcategories?.map((sub: any, subIndex: number) => (
                        <div key={subIndex} className="ml-4">
                          └ {sub.name} ({sub.articles?.length || 0} articles)
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Raw localStorage Keys</h3>
                <div className="bg-gray-100 p-2 rounded text-xs">
                  {Object.keys(localStorage)
                    .filter((key) => key.startsWith("kb_"))
                    .map((key) => (
                      <div key={key}>
                        {key}: {localStorage.getItem(key)?.length || 0} characters
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
