"use client"

import { ChevronRight, ChevronDown, Folder, FileText } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  const getCategoryArticles = (categoryId: string) => {
    return articles.filter((article) => article.categoryId === categoryId && article.status === "published")
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Categories</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {categories.map((category) => {
            const categoryArticles = getCategoryArticles(category.id)
            const isExpanded = selectedCategoryId === category.id

            return (
              <div key={category.id} className="mb-2">
                <button
                  onClick={() => onCategorySelect(category.id)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 text-left rounded-lg hover:bg-gray-100 transition-colors ${
                    isExpanded ? "bg-blue-50 text-blue-700" : "text-gray-700"
                  }`}
                >
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <Folder className="h-4 w-4" />
                  <span className="font-medium">{category.name}</span>
                  <span className="ml-auto text-xs text-gray-500">({categoryArticles.length})</span>
                </button>

                {isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {categoryArticles.map((article) => (
                      <button
                        key={article.id}
                        onClick={() => onArticleSelect(article.id)}
                        className={`w-full flex items-center space-x-2 px-3 py-2 text-left rounded-lg hover:bg-gray-100 transition-colors ${
                          selectedArticleId === article.id ? "bg-blue-50 text-blue-700" : "text-gray-600"
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                        <span className="text-sm truncate">{article.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
