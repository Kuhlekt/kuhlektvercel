"use client"
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
    <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
        <div className="space-y-2">
          {categories.map((category) => {
            const articleCount = getArticleCount(category.id)
            const categoryArticles = getCategoryArticles(category.id)
            const isSelected = selectedCategoryId === category.id

            return (
              <div key={category.id} className="space-y-1">
                <div
                  onClick={() => onCategorySelect(category.id)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Folder className={`h-4 w-4 ${isSelected ? "text-blue-600" : "text-gray-500"}`} />
                    <span className={`font-medium ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                      {category.name}
                    </span>
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
                        onClick={() => onArticleSelect(article.id)}
                        className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                          selectedArticleId === article.id
                            ? "bg-blue-100 text-blue-900"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <FileText className="h-3 w-3" />
                        <span className="text-sm truncate">{article.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
