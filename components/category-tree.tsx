"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Folder, FileText } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
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

  const getArticlesForCategory = (categoryId: string) => {
    return articles.filter((article) => article.categoryId === categoryId)
  }

  const filteredCategories = categories.filter((category) => {
    if (!searchQuery) return true

    const categoryMatches =
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())

    const hasMatchingArticles = getArticlesForCategory(category.id).length > 0

    return categoryMatches || hasMatchingArticles
  })

  return (
    <div className="h-full bg-gray-50 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Categories</h2>
        <p className="text-sm text-gray-600 mt-1">
          {articles.length} articles in {categories.length} categories
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredCategories.map((category) => {
            const categoryArticles = getArticlesForCategory(category.id)
            const isExpanded = expandedCategories.has(category.id)
            const isSelected = selectedCategory === category.id

            return (
              <div key={category.id} className="mb-2">
                <div
                  className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                    isSelected ? "bg-blue-50 border border-blue-200" : ""
                  }`}
                  onClick={() => {
                    onCategorySelect(category.id)
                    toggleCategory(category.id)
                  }}
                >
                  <button className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  <Folder className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-medium text-gray-900 flex-1 truncate">{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {categoryArticles.length}
                  </Badge>
                </div>

                {isExpanded && categoryArticles.length > 0 && (
                  <div className="ml-6 mt-1 space-y-1">
                    {categoryArticles.map((article) => (
                      <div
                        key={article.id}
                        className="flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 group"
                        onClick={() => onArticleSelect(article)}
                      >
                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700 flex-1 truncate group-hover:text-gray-900">
                          {article.title}
                        </span>
                        <Badge variant={article.status === "published" ? "default" : "secondary"} className="text-xs">
                          {article.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No categories found</p>
              {searchQuery && <p className="text-xs mt-1">Try adjusting your search terms</p>}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
