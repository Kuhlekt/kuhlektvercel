"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from "lucide-react"
import type { Category, Article } from "../types/knowledge-base"

interface CategoryTreeProps {
  categories: Category[]
  onSelectArticle: (article: Article) => void
  selectedArticle: Article | null
}

export function CategoryTree({ categories, onSelectArticle, selectedArticle }: CategoryTreeProps) {
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

  if (!Array.isArray(categories) || categories.length === 0) {
    return <div className="text-gray-500 text-sm">No categories available</div>
  }

  return (
    <div className="space-y-1">
      {categories.map((category) => {
        const isExpanded = expandedCategories.has(category.id)
        const hasArticles = Array.isArray(category.articles) && category.articles.length > 0
        const hasSubcategories = Array.isArray(category.subcategories) && category.subcategories.length > 0

        return (
          <div key={category.id}>
            <div
              className="flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer rounded"
              onClick={() => toggleCategory(category.id)}
            >
              {hasArticles || hasSubcategories ? (
                isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )
              ) : (
                <div className="w-4" />
              )}
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-blue-600" />
              ) : (
                <Folder className="h-4 w-4 text-blue-600" />
              )}
              <span className="text-sm font-medium">{category.name}</span>
            </div>

            {isExpanded && (
              <div className="ml-6 space-y-1">
                {hasArticles &&
                  category.articles.map((article) => (
                    <div
                      key={article.id}
                      className={`flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer rounded ${
                        selectedArticle?.id === article.id ? "bg-blue-50 border-l-2 border-blue-500" : ""
                      }`}
                      onClick={() => onSelectArticle(article)}
                    >
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{article.title}</span>
                    </div>
                  ))}

                {hasSubcategories &&
                  category.subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="ml-4">
                      <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer rounded">
                        <Folder className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{subcategory.name}</span>
                      </div>
                      {Array.isArray(subcategory.articles) &&
                        subcategory.articles.map((article) => (
                          <div
                            key={article.id}
                            className={`flex items-center space-x-2 p-2 ml-6 hover:bg-gray-50 cursor-pointer rounded ${
                              selectedArticle?.id === article.id ? "bg-blue-50 border-l-2 border-blue-500" : ""
                            }`}
                            onClick={() => onSelectArticle(article)}
                          >
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{article.title}</span>
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
