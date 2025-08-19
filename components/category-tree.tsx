"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

  if (!Array.isArray(categories) || categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No categories available</p>
        <p className="text-sm">Import data or create categories to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {categories.map((category) => {
        const isExpanded = expandedCategories.has(category.id)
        const categoryArticles = Array.isArray(category.articles) ? category.articles : []
        const subcategories = Array.isArray(category.subcategories) ? category.subcategories : []
        const totalArticles =
          categoryArticles.length +
          subcategories.reduce((sum, sub) => sum + (Array.isArray(sub.articles) ? sub.articles.length : 0), 0)

        return (
          <div key={category.id} className="space-y-1">
            {/* Category Header */}
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-2 hover:bg-gray-100"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center space-x-2 w-full">
                {totalArticles > 0 ? (
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
                  <Folder className="h-4 w-4 text-gray-600" />
                )}
                <span className="font-medium text-left flex-1">{category.name}</span>
                {totalArticles > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {totalArticles}
                  </Badge>
                )}
              </div>
            </Button>

            {/* Category Content */}
            {isExpanded && (
              <div className="ml-6 space-y-1">
                {/* Direct category articles */}
                {categoryArticles.map((article) => (
                  <Button
                    key={article.id}
                    variant="ghost"
                    className={`w-full justify-start h-auto p-2 text-sm ${
                      selectedArticle?.id === article.id
                        ? "bg-blue-50 text-blue-700 border-l-2 border-blue-500"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => onSelectArticle(article)}
                  >
                    <div className="flex items-center space-x-2 w-full">
                      <FileText className="h-3 w-3 text-gray-500" />
                      <span className="text-left flex-1 truncate">{article.title}</span>
                    </div>
                  </Button>
                ))}

                {/* Subcategories */}
                {subcategories.map((subcategory) => {
                  const isSubExpanded = expandedSubcategories.has(subcategory.id)
                  const subArticles = Array.isArray(subcategory.articles) ? subcategory.articles : []

                  return (
                    <div key={subcategory.id} className="space-y-1">
                      {/* Subcategory Header */}
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-auto p-2 hover:bg-gray-100"
                        onClick={() => toggleSubcategory(subcategory.id)}
                      >
                        <div className="flex items-center space-x-2 w-full">
                          {subArticles.length > 0 ? (
                            isSubExpanded ? (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            )
                          ) : (
                            <div className="w-4" />
                          )}
                          {isSubExpanded ? (
                            <FolderOpen className="h-4 w-4 text-orange-600" />
                          ) : (
                            <Folder className="h-4 w-4 text-orange-500" />
                          )}
                          <span className="font-medium text-left flex-1">{subcategory.name}</span>
                          {subArticles.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {subArticles.length}
                            </Badge>
                          )}
                        </div>
                      </Button>

                      {/* Subcategory Articles */}
                      {isSubExpanded && (
                        <div className="ml-6 space-y-1">
                          {subArticles.map((article) => (
                            <Button
                              key={article.id}
                              variant="ghost"
                              className={`w-full justify-start h-auto p-2 text-sm ${
                                selectedArticle?.id === article.id
                                  ? "bg-blue-50 text-blue-700 border-l-2 border-blue-500"
                                  : "hover:bg-gray-50"
                              }`}
                              onClick={() => onSelectArticle(article)}
                            >
                              <div className="flex items-center space-x-2 w-full">
                                <FileText className="h-3 w-3 text-gray-500" />
                                <span className="text-left flex-1 truncate">{article.title}</span>
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
  )
}
