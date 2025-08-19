"use client"

import { useState } from "react"
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
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["1"]))

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
    <div className="w-80 bg-gray-50 border-r border-gray-200 h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Categories</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {categories.map((category) => {
            const categoryArticles = getCategoryArticles(category.id)
            const isExpanded = expandedCategories.has(category.id)
            const isSelected = selectedCategoryId === category.id

            return (
              <div key={category.id} className="mb-1">
                <div
                  className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                    isSelected ? "bg-blue-50 text-blue-700" : "text-gray-700"
                  }`}
                  onClick={() => {
                    onCategorySelect(category.id)
                    toggleCategory(category.id)
                  }}
                >
                  {categoryArticles.length > 0 ? (
                    isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )
                  ) : (
                    <div className="w-4" />
                  )}
                  <Folder className="h-4 w-4" />
                  <span className="flex-1 text-sm font-medium">{category.name}</span>
                  <span className="text-xs text-gray-500">{categoryArticles.length}</span>
                </div>

                {isExpanded && categoryArticles.length > 0 && (
                  <div className="ml-6 mt-1 space-y-1">
                    {categoryArticles.map((article) => (
                      <div
                        key={article.id}
                        className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                          selectedArticleId === article.id ? "bg-blue-50 text-blue-700" : "text-gray-600"
                        }`}
                        onClick={() => onArticleSelect(article.id)}
                      >
                        <FileText className="h-4 w-4" />
                        <span className="text-sm truncate">{article.title}</span>
                      </div>
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
