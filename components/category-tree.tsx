"use client"

import { useState } from "react"
import { Folder, FolderOpen } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Category, Article } from "../types/knowledge-base"

interface CategoryTreeProps {
  categories: Category[]
  onSelectArticle: (article: Article) => void
  selectedArticle: Article | null
  selectedCategoryId: string | null
  onCategorySelect: (categoryId: string | null) => void
}

export function CategoryTree({
  categories,
  onSelectArticle,
  selectedArticle,
  selectedCategoryId,
  onCategorySelect,
}: CategoryTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <Card className="border-0 rounded-none">
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant={selectedCategoryId === null ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onCategorySelect(null)}
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            All Articles
          </Button>

          {categories.map((category) => {
            const isExpanded = expandedCategories.has(category.id)
            const hasContent = category.articles && category.articles.length > 0

            return (
              <div key={category.id} className="space-y-1">
                <Button
                  variant={selectedCategoryId === category.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    toggleCategory(category.id)
                    onCategorySelect(category.id)
                  }}
                >
                  <div className="flex items-center space-x-2 w-full">
                    {hasContent ? (
                      isExpanded ? (
                        <FolderOpen className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <Folder className="h-4 w-4 flex-shrink-0" />
                      )
                    ) : (
                      <Folder className="h-4 w-4 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{category.name}</div>
                    </div>
                  </div>
                </Button>

                {isExpanded && category.articles && (
                  <div className="ml-6 space-y-1">
                    {category.articles.map((article) => (
                      <Button
                        key={article.id}
                        variant="ghost"
                        className={`w-full justify-start h-auto p-2 text-left ${
                          selectedArticle?.id === article.id ? "bg-blue-50 border border-blue-200" : ""
                        }`}
                        onClick={() => onSelectArticle(article)}
                      >
                        <div className="flex items-center space-x-2 w-full">
                          <Folder className="h-4 w-4 flex-shrink-0 text-gray-500" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{article.title}</div>
                            <div className="text-xs text-gray-500 truncate">{article.content.substring(0, 60)}...</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>
    </aside>
  )
}
