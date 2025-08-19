"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Category, Article } from "../types/knowledge-base"

interface CategoryTreeProps {
  categories: Category[]
  onSelectArticle: (article: Article) => void
  selectedArticle: Article | null
}

export function CategoryTree({ categories, onSelectArticle, selectedArticle }: CategoryTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["1"]))
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
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {categories.map((category) => (
        <div key={category.id}>
          <Button
            variant="ghost"
            className="w-full justify-start h-auto p-2 font-normal"
            onClick={() => toggleCategory(category.id)}
          >
            <div className="flex items-center space-x-2 w-full">
              {expandedCategories.has(category.id) ? (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
              {expandedCategories.has(category.id) ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 text-blue-500" />
              )}
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">{category.name}</div>
                {category.description && <div className="text-xs text-gray-500">{category.description}</div>}
              </div>
            </div>
          </Button>

          {expandedCategories.has(category.id) && (
            <div className="ml-4 space-y-1">
              {/* Category Articles */}
              {Array.isArray(category.articles) &&
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
                      <div className="w-4" />
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div className="flex-1 text-left">
                        <div className="text-sm">{article.title}</div>
                      </div>
                    </div>
                  </Button>
                ))}

              {/* Subcategories */}
              {Array.isArray(category.subcategories) &&
                category.subcategories.map((subcategory) => (
                  <div key={subcategory.id}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-2 font-normal"
                      onClick={() => toggleSubcategory(subcategory.id)}
                    >
                      <div className="flex items-center space-x-2 w-full">
                        <div className="w-4" />
                        {expandedSubcategories.has(subcategory.id) ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                        {expandedSubcategories.has(subcategory.id) ? (
                          <FolderOpen className="h-4 w-4 text-green-500" />
                        ) : (
                          <Folder className="h-4 w-4 text-green-500" />
                        )}
                        <div className="flex-1 text-left">
                          <div className="text-sm">{subcategory.name}</div>
                          {subcategory.description && (
                            <div className="text-xs text-gray-500">{subcategory.description}</div>
                          )}
                        </div>
                      </div>
                    </Button>

                    {expandedSubcategories.has(subcategory.id) && (
                      <div className="ml-4 space-y-1">
                        {Array.isArray(subcategory.articles) &&
                          subcategory.articles.map((article) => (
                            <Button
                              key={article.id}
                              variant="ghost"
                              className={`w-full justify-start h-auto p-2 font-normal ${
                                selectedArticle?.id === article.id ? "bg-blue-50 text-blue-700" : ""
                              }`}
                              onClick={() => onSelectArticle(article)}
                            >
                              <div className="flex items-center space-x-2 w-full">
                                <div className="w-8" />
                                <FileText className="h-4 w-4 text-gray-400" />
                                <div className="flex-1 text-left">
                                  <div className="text-sm">{article.title}</div>
                                </div>
                              </div>
                            </Button>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
