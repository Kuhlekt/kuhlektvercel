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

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No categories available</p>
        <p className="text-sm">Login as admin to add content</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {categories.map((category) => {
        const isExpanded = expandedCategories.has(category.id)
        const hasArticles = Array.isArray(category.articles) && category.articles.length > 0
        const hasSubcategories = Array.isArray(category.subcategories) && category.subcategories.length > 0
        const totalArticles =
          (category.articles?.length || 0) +
          (category.subcategories?.reduce((sum, sub) => sum + (sub.articles?.length || 0), 0) || 0)

        return (
          <div key={category.id}>
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-2 font-normal"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center space-x-2 w-full">
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
                  <FolderOpen className="h-4 w-4 text-blue-500" />
                ) : (
                  <Folder className="h-4 w-4 text-blue-500" />
                )}
                <span className="flex-1 text-left">{category.name}</span>
                {totalArticles > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{totalArticles}</span>
                )}
              </div>
            </Button>

            {isExpanded && (
              <div className="ml-6 space-y-1">
                {/* Category articles */}
                {hasArticles &&
                  category.articles.map((article) => (
                    <Button
                      key={article.id}
                      variant="ghost"
                      className={`w-full justify-start h-auto p-2 font-normal ${
                        selectedArticle?.id === article.id ? "bg-blue-50 text-blue-700" : ""
                      }`}
                      onClick={() => onSelectArticle(article)}
                    >
                      <div className="flex items-center space-x-2 w-full">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="flex-1 text-left text-sm">{article.title}</span>
                      </div>
                    </Button>
                  ))}

                {/* Subcategories */}
                {hasSubcategories &&
                  category.subcategories.map((subcategory) => {
                    const subHasArticles = Array.isArray(subcategory.articles) && subcategory.articles.length > 0
                    const subIsExpanded = expandedCategories.has(subcategory.id)

                    return (
                      <div key={subcategory.id}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-auto p-2 font-normal"
                          onClick={() => toggleCategory(subcategory.id)}
                        >
                          <div className="flex items-center space-x-2 w-full">
                            {subHasArticles ? (
                              subIsExpanded ? (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              )
                            ) : (
                              <div className="w-4" />
                            )}
                            {subIsExpanded ? (
                              <FolderOpen className="h-4 w-4 text-green-500" />
                            ) : (
                              <Folder className="h-4 w-4 text-green-500" />
                            )}
                            <span className="flex-1 text-left text-sm">{subcategory.name}</span>
                            {subHasArticles && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {subcategory.articles.length}
                              </span>
                            )}
                          </div>
                        </Button>

                        {subIsExpanded && subHasArticles && (
                          <div className="ml-6 space-y-1">
                            {subcategory.articles.map((article) => (
                              <Button
                                key={article.id}
                                variant="ghost"
                                className={`w-full justify-start h-auto p-2 font-normal ${
                                  selectedArticle?.id === article.id ? "bg-blue-50 text-blue-700" : ""
                                }`}
                                onClick={() => onSelectArticle(article)}
                              >
                                <div className="flex items-center space-x-2 w-full">
                                  <FileText className="h-4 w-4 text-gray-400" />
                                  <span className="flex-1 text-left text-sm">{article.title}</span>
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
