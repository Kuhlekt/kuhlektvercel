"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Folder, FileText } from "lucide-react"
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
  const getArticleCount = (categoryId: string) => {
    return articles.filter((article) => article.categoryId === categoryId && article.status === "published").length
  }

  const getCategoryArticles = (categoryId: string) => {
    return articles.filter((article) => article.categoryId === categoryId && article.status === "published")
  }

  return (
    <aside className="w-80 bg-white border-r overflow-y-auto">
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => {
            const articleCount = getArticleCount(category.id)
            const categoryArticles = getCategoryArticles(category.id)
            const isSelected = selectedCategoryId === category.id

            return (
              <div key={category.id} className="space-y-1">
                <div
                  className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 ${
                    isSelected ? "bg-blue-50 border border-blue-200" : ""
                  }`}
                  onClick={() => onCategorySelect(category.id)}
                >
                  <div className="flex items-center space-x-2">
                    <Folder className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {articleCount}
                  </Badge>
                </div>

                {isSelected && categoryArticles.length > 0 && (
                  <div className="ml-6 space-y-1">
                    {categoryArticles.map((article) => (
                      <div
                        key={article.id}
                        className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                          selectedArticleId === article.id ? "bg-blue-50 border border-blue-200" : ""
                        }`}
                        onClick={() => onArticleSelect(article.id)}
                      >
                        <FileText className="h-3 w-3 text-gray-500" />
                        <span className="text-sm text-gray-700 truncate">{article.title}</span>
                      </div>
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
