"use client"

import { ChevronRight, ChevronDown, Folder, FileText } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Category, Article } from "../types/knowledge-base"

interface CategoryTreeProps {
  categories: Category[]
  articles: Article[]
  onArticleSelect: (article: Article) => void
  onCategorySelect: (categoryId: string) => void
  selectedCategory: string | null
  searchQuery: string
}

export function CategoryTree({
  categories,
  articles,
  onArticleSelect,
  onCategorySelect,
  selectedCategory,
  searchQuery,
}: CategoryTreeProps) {
  const getCategoryArticles = (categoryId: string) => {
    return articles.filter((article) => article.categoryId === categoryId && article.status === "published")
  }

  const filteredCategories = categories.filter((category) => {
    if (searchQuery === "") return true

    const categoryArticles = getCategoryArticles(category.id)
    return categoryArticles.length > 0
  })

  return (
    <div className="h-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Categories</h2>
        {searchQuery && <p className="text-xs text-gray-500 mt-1">Showing results for "{searchQuery}"</p>}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredCategories.map((category) => {
            const categoryArticles = getCategoryArticles(category.id)
            const isExpanded = selectedCategory === category.id

            if (categoryArticles.length === 0) return null

            return (
              <div key={category.id} className="mb-1">
                <button
                  onClick={() => onCategorySelect(category.id)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 text-left rounded-lg hover:bg-gray-100 transition-colors ${
                    isExpanded ? "bg-blue-50 text-blue-700" : "text-gray-700"
                  }`}
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <Folder className="w-4 h-4" />
                  <span className="font-medium">{category.name}</span>
                  <span className="ml-auto text-xs text-gray-500">{categoryArticles.length}</span>
                </button>

                {isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {categoryArticles.map((article) => (
                      <button
                        key={article.id}
                        onClick={() => onArticleSelect(article)}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-left rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm truncate">{article.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {filteredCategories.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No articles found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
