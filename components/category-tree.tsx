"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronDown, Folder, FileText } from "lucide-react"
import type { Category, Article } from "../types/knowledge-base"

interface CategoryTreeProps {
  categories: Category[]
  articles: Article[]
  selectedCategoryId: string | null
  selectedArticleId: string | null
  onCategorySelect: (categoryId: string) => void
  onArticleSelect: (articleId: string) => void
}

export function CategoryTree({
  categories,
  articles,
  selectedCategoryId,
  selectedArticleId,
  onCategorySelect,
  onArticleSelect,
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

  const getCategoryArticles = (categoryId: string) => {
    return articles.filter((article) => article.categoryId === categoryId && article.status === "published")
  }

  return (
    <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => {
            const categoryArticles = getCategoryArticles(category.id)
            const isExpanded = expandedCategories.has(category.id)
            const isSelected = selectedCategoryId === category.id

            return (
              <div key={category.id} className="space-y-1">
                <Button
                  variant={isSelected ? "secondary" : "ghost"}
                  className="w-full justify-start text-left h-auto p-2"
                  onClick={() => {
                    onCategorySelect(category.id)
                    if (categoryArticles.length > 0) {
                      toggleCategory(category.id)
                    }
                  }}
                >
                  <div className="flex items-center space-x-2 w-full">
                    {categoryArticles.length > 0 ? (
                      isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )
                    ) : (
                      <div className="w-4" />
                    )}
                    <Folder className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium">{category.name}</div>
                      {category.description && <div className="text-xs text-gray-500">{category.description}</div>}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {categoryArticles.length}
                    </Badge>
                  </div>
                </Button>

                {isExpanded && categoryArticles.length > 0 && (
                  <div className="ml-6 space-y-1">
                    {categoryArticles.map((article) => (
                      <Button
                        key={article.id}
                        variant={selectedArticleId === article.id ? "secondary" : "ghost"}
                        className="w-full justify-start text-left h-auto p-2"
                        onClick={() => onArticleSelect(article.id)}
                      >
                        <div className="flex items-center space-x-2 w-full">
                          <FileText className="h-4 w-4 text-green-600" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{article.title}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(article.createdAt).toLocaleDateString()}
                            </div>
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
