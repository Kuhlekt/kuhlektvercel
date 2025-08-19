"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const toggleSubcategory = (subcategoryId: string) => {
    const newExpanded = new Set(expandedSubcategories)
    if (newExpanded.has(subcategoryId)) {
      newExpanded.delete(subcategoryId)
    } else {
      newExpanded.add(subcategoryId)
    }
    setExpandedSubcategories(newExpanded)
  }

  return (
    <div className="bg-white border-r border-gray-200 w-64 p-4 space-y-2">
      <h2 className="font-semibold text-gray-900 mb-4">Categories</h2>
      <div className="space-y-1">
        <button
          onClick={() => onCategorySelect(null)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center space-x-2 ${
            selectedCategoryId === null ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FolderOpen className="h-4 w-4" />
          <span>All Articles</span>
        </button>
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.id)
          const hasContent =
            (category.articles && category.articles.length > 0) ||
            (category.subcategories && category.subcategories.length > 0)

          return (
            <div key={category.id} className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-2 text-left"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center space-x-2 w-full">
                  {hasContent ? (
                    isExpanded ? (
                      <ChevronDown className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    )
                  ) : (
                    <div className="w-4 h-4 flex-shrink-0" />
                  )}
                  {isExpanded ? (
                    <FolderOpen className="h-4 w-4 flex-shrink-0 text-blue-600" />
                  ) : (
                    <Folder className="h-4 w-4 flex-shrink-0 text-gray-600" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{category.name}</div>
                    {category.description && (
                      <div className="text-xs text-gray-500 truncate">{category.description}</div>
                    )}
                  </div>
                </div>
              </Button>

              {isExpanded && (
                <div className="ml-6 space-y-1">
                  {/* Category Articles */}
                  {category.articles &&
                    category.articles.map((article) => (
                      <Button
                        key={article.id}
                        variant="ghost"
                        className={`w-full justify-start h-auto p-2 text-left ${
                          selectedArticle?.id === article.id ? "bg-blue-50 border border-blue-200" : ""
                        }`}
                        onClick={() => onSelectArticle(article)}
                      >
                        <div className="flex items-center space-x-2 w-full">
                          <FileText className="h-4 w-4 flex-shrink-0 text-gray-500" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{article.title}</div>
                            <div className="text-xs text-gray-500 truncate">{article.content.substring(0, 60)}...</div>
                          </div>
                        </div>
                      </Button>
                    ))}

                  {/* Subcategories */}
                  {category.subcategories &&
                    category.subcategories.map((subcategory) => {
                      const isSubExpanded = expandedSubcategories.has(subcategory.id)
                      const hasSubContent = subcategory.articles && subcategory.articles.length > 0

                      return (
                        <div key={subcategory.id} className="space-y-1">
                          <Button
                            variant="ghost"
                            className="w-full justify-start h-auto p-2 text-left"
                            onClick={() => toggleSubcategory(subcategory.id)}
                          >
                            <div className="flex items-center space-x-2 w-full">
                              {hasSubContent ? (
                                isSubExpanded ? (
                                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                                )
                              ) : (
                                <div className="w-4 h-4 flex-shrink-0" />
                              )}
                              {isSubExpanded ? (
                                <FolderOpen className="h-4 w-4 flex-shrink-0 text-blue-500" />
                              ) : (
                                <Folder className="h-4 w-4 flex-shrink-0 text-gray-500" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{subcategory.name}</div>
                                {subcategory.description && (
                                  <div className="text-xs text-gray-500 truncate">{subcategory.description}</div>
                                )}
                              </div>
                            </div>
                          </Button>

                          {isSubExpanded && subcategory.articles && (
                            <div className="ml-6 space-y-1">
                              {subcategory.articles.map((article) => (
                                <Button
                                  key={article.id}
                                  variant="ghost"
                                  className={`w-full justify-start h-auto p-2 text-left ${
                                    selectedArticle?.id === article.id ? "bg-blue-50 border border-blue-200" : ""
                                  }`}
                                  onClick={() => onSelectArticle(article)}
                                >
                                  <div className="flex items-center space-x-2 w-full">
                                    <FileText className="h-4 w-4 flex-shrink-0 text-gray-500" />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-sm truncate">{article.title}</div>
                                      <div className="text-xs text-gray-500 truncate">
                                        {article.content.substring(0, 60)}...
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
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
