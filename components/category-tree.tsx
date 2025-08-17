"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Category, Article } from "../types/knowledge-base"

interface CategoryTreeProps {
  categories: Category[]
  onSelectArticle: (article: Article) => void
  selectedArticle: Article | null
}

export function CategoryTree({ categories, onSelectArticle, selectedArticle }: CategoryTreeProps) {
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

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No categories available</p>
        <p className="text-sm">Import data to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {categories.map((category) => {
        const isExpanded = expandedCategories.has(category.id)
        const hasArticles = category.articles && category.articles.length > 0
        const hasSubcategories = category.subcategories && category.subcategories.length > 0

        return (
          <div key={category.id} className="space-y-1">
            {/* Category Header */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-auto p-2"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center space-x-2 w-full">
                {hasArticles || hasSubcategories ? (
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
                <span className="text-sm font-medium truncate">{category.name}</span>
                {(hasArticles || hasSubcategories) && (
                  <span className="text-xs text-gray-500 ml-auto">
                    {(category.articles?.length || 0) +
                      (category.subcategories?.reduce((sum, sub) => sum + (sub.articles?.length || 0), 0) || 0)}
                  </span>
                )}
              </div>
            </Button>

            {/* Category Content */}
            {isExpanded && (
              <div className="ml-4 space-y-1">
                {/* Category Articles */}
                {hasArticles &&
                  category.articles.map((article) => (
                    <Button
                      key={article.id}
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start h-auto p-2 ${
                        selectedArticle?.id === article.id ? "bg-blue-50 text-blue-700" : ""
                      }`}
                      onClick={() => onSelectArticle(article)}
                    >
                      <div className="flex items-center space-x-2 w-full">
                        <FileText className="h-3 w-3 flex-shrink-0" />
                        <span className="text-sm truncate">{article.title}</span>
                      </div>
                    </Button>
                  ))}

                {/* Subcategories */}
                {hasSubcategories &&
                  category.subcategories.map((subcategory) => {
                    const isSubExpanded = expandedSubcategories.has(subcategory.id)
                    const hasSubArticles = subcategory.articles && subcategory.articles.length > 0

                    return (
                      <div key={subcategory.id} className="space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start h-auto p-2"
                          onClick={() => toggleSubcategory(subcategory.id)}
                        >
                          <div className="flex items-center space-x-2 w-full">
                            {hasSubArticles ? (
                              isSubExpanded ? (
                                <ChevronDown className="h-3 w-3 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="h-3 w-3 flex-shrink-0" />
                              )
                            ) : (
                              <div className="w-3 h-3 flex-shrink-0" />
                            )}
                            {isSubExpanded ? (
                              <FolderOpen className="h-3 w-3 flex-shrink-0 text-blue-500" />
                            ) : (
                              <Folder className="h-3 w-3 flex-shrink-0 text-gray-500" />
                            )}
                            <span className="text-xs font-medium truncate">{subcategory.name}</span>
                            {hasSubArticles && (
                              <span className="text-xs text-gray-400 ml-auto">{subcategory.articles.length}</span>
                            )}
                          </div>
                        </Button>

                        {/* Subcategory Articles */}
                        {isSubExpanded &&
                          hasSubArticles &&
                          subcategory.articles.map((article) => (
                            <Button
                              key={article.id}
                              variant="ghost"
                              size="sm"
                              className={`w-full justify-start h-auto p-2 ml-4 ${
                                selectedArticle?.id === article.id ? "bg-blue-50 text-blue-700" : ""
                              }`}
                              onClick={() => onSelectArticle(article)}
                            >
                              <div className="flex items-center space-x-2 w-full">
                                <FileText className="h-3 w-3 flex-shrink-0" />
                                <span className="text-xs truncate">{article.title}</span>
                              </div>
                            </Button>
                          ))}
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
