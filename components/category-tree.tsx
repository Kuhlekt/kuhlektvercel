"use client"

import { Button } from "@/components/ui/button"
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
  const getArticlesForCategory = (categoryId: string) => {
    return articles.filter((article) => article.categoryId === categoryId && article.status === "published")
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
        <div className="space-y-2">
          {categories.map((category) => {
            const categoryArticles = getArticlesForCategory(category.id)
            const isSelected = selectedCategoryId === category.id

            return (
              <div key={category.id} className="space-y-1">
                <Button
                  variant={isSelected ? "secondary" : "ghost"}
                  className="w-full justify-start text-left h-auto p-2"
                  onClick={() => onCategorySelect(category.id)}
                >
                  <div className="flex items-center space-x-2 w-full">
                    <Folder className="h-4 w-4 text-blue-600" />
                    <span className="flex-1 truncate">{category.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {categoryArticles.length}
                    </Badge>
                  </div>
                </Button>

                {isSelected && categoryArticles.length > 0 && (
                  <div className="ml-6 space-y-1">
                    {categoryArticles.map((article) => (
                      <Button
                        key={article.id}
                        variant={selectedArticleId === article.id ? "secondary" : "ghost"}
                        className="w-full justify-start text-left h-auto p-2 text-sm"
                        onClick={() => onArticleSelect(article.id)}
                      >
                        <div className="flex items-center space-x-2 w-full">
                          <FileText className="h-3 w-3 text-gray-500" />
                          <span className="flex-1 truncate">{article.title}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
