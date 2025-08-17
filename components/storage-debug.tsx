"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { storage } from "../utils/storage"

export function StorageDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  const runDiagnostics = () => {
    try {
      const info = storage.getStorageInfo()
      const categories = storage.getCategories()

      const totalArticles = categories.reduce((total, category) => {
        const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
        const subcategoryArticles = Array.isArray(category.subcategories)
          ? category.subcategories.reduce(
              (subTotal, sub) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
              0,
            )
          : 0
        return total + categoryArticles + subcategoryArticles
      }, 0)

      const categoryBreakdown = categories.map((cat) => ({
        name: cat.name,
        directArticles: cat.articles.length,
        subcategories: cat.subcategories.map((sub) => ({
          name: sub.name,
          articles: sub.articles.length,
        })),
        totalArticles: cat.articles.length + cat.subcategories.reduce((total, sub) => total + sub.articles.length, 0),
      }))

      setDebugInfo({
        storageInfo: info,
        categoriesCount: categories.length,
        totalArticles,
        categoryBreakdown,
        rawStorageSize: localStorage.getItem("kb_categories")?.length || 0,
        hasAnyData: storage.hasAnyData(),
      })
      setIsVisible(true)
    } catch (error) {
      setDebugInfo({
        error: error.toString(),
        stack: error.stack,
      })
      setIsVisible(true)
    }
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={runDiagnostics} variant="outline" size="sm">
          Debug Storage
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl max-h-[80vh] overflow-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Storage Debug Information
            <Button onClick={() => setIsVisible(false)} variant="outline" size="sm">
              Close
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
        </CardContent>
      </Card>
    </div>
  )
}
