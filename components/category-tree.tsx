"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen } from "lucide-react"
import type { Category, Article } from "../types/knowledge-base"

interface CategoryTreeProps {
  categories?: Category[]
  onArticleSelect?: (article: Article) => void
  selectedArticleId?: string
}

export function CategoryTree({ categories = [], onArticleSelect, selectedArticleId }: CategoryTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : []

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const handleArticleClick = (article: Article) => {
    if (onArticleSelect) {
      onArticleSelect(article)
    }
  }

  if (safeCategories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No categories available</p>
        <p className="text-sm">Create categories to organize your articles</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {safeCategories.map((category) => {
        const isExpanded = expandedCategories.has(category.id)
        const categoryArticles = Array.isArray(category.articles) ? category.articles : []
        const subcategories = Array.isArray(category.subcategories) ? category.subcategories : []

        return (
          <div key={category.id} className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-2 hover:bg-gray-100"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center space-x-2 w-full">
                {(categoryArticles.length > 0 || subcategories.length > 0) && (
                  <>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </>
                )}
                {isExpanded ? (
                  <FolderOpen className="h-4 w-4 text-blue-600" />
                ) : (
                  <Folder className="h-4 w-4 text-blue-600" />
                )}
                <span className="font-medium text-left flex-1">{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {categoryArticles.length}
                </Badge>
              </div>
            </Button>

            {isExpanded && (
              <div className="ml-6 space-y-1">
                {/* Category Articles */}
                {categoryArticles.map((article) => (
                  <Button
                    key={article.id}
                    variant="ghost"
                    className={`w-full justify-start h-auto p-2 text-sm hover:bg-blue-50 ${
                      selectedArticleId === article.id ? "bg-blue-100 border-l-2 border-blue-500" : ""
                    }`}
                    onClick={() => handleArticleClick(article)}
                  >
                    <div className="flex items-center space-x-2 w-full">
                      <FileText className="h-3 w-3 text-gray-400" />
                      <span className="text-left flex-1 truncate">{article.title}</span>
                      <Badge variant={article.status === "published" ? "default" : "secondary"} className="text-xs">
                        {article.status}
                      </Badge>
                    </div>
                  </Button>
                ))}

                {/* Subcategories */}
                {subcategories.map((subcategory) => {
                  const subcategoryArticles = Array.isArray(subcategory.articles) ? subcategory.articles : []
                  const isSubExpanded = expandedCategories.has(subcategory.id)

                  return (
                    <div key={subcategory.id} className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-auto p-2 hover:bg-gray-50"
                        onClick={() => toggleCategory(subcategory.id)}
                      >
                        <div className="flex items-center space-x-2 w-full">
                          {subcategoryArticles.length > 0 && (
                            <>
                              {isSubExpanded ? (
                                <ChevronDown className="h-3 w-3 text-gray-400" />
                              ) : (
                                <ChevronRight className="h-3 w-3 text-gray-400" />
                              )}
                            </>
                          )}
                          {isSubExpanded ? (
                            <FolderOpen className="h-3 w-3 text-green-600" />
                          ) : (
                            <Folder className="h-3 w-3 text-green-600" />
                          )}
                          <span className="text-sm text-left flex-1">{subcategory.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {subcategoryArticles.length}
                          </Badge>
                        </div>
                      </Button>

                      {isSubExpanded && (
                        <div className="ml-6 space-y-1">
                          {subcategoryArticles.map((article) => (
                            <Button
                              key={article.id}
                              variant="ghost"
                              className={`w-full justify-start h-auto p-2 text-sm hover:bg-green-50 ${
                                selectedArticleId === article.id ? "bg-green-100 border-l-2 border-green-500" : ""
                              }`}
                              onClick={() => handleArticleClick(article)}
                            >
                              <div className="flex items-center space-x-2 w-full">
                                <FileText className="h-3 w-3 text-gray-400" />
                                <span className="text-left flex-1 truncate">{article.title}</span>
                                <Badge
                                  variant={article.status === "published" ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {article.status}
                                </Badge>
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
