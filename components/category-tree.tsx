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

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No categories available</p>
        <p className="text-sm mt-2">Import some data or add articles to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => {
        const isExpanded = expandedCategories.has(category.id)
        const categoryArticles = Array.isArray(category.articles) ? category.articles : []
        const subcategories = Array.isArray(category.subcategories) ? category.subcategories : []
        const totalArticles =
          categoryArticles.length +
          subcategories.reduce((sum, sub) => sum + (Array.isArray(sub.articles) ? sub.articles.length : 0), 0)

        return (
          <div key={category.id} className="border rounded-lg">
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center space-x-2 w-full">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
                {isExpanded ? (
                  <FolderOpen className="h-4 w-4 text-blue-500" />
                ) : (
                  <Folder className="h-4 w-4 text-blue-500" />
                )}
                <div className="flex-1 text-left">
                  <div className="font-medium">{category.name}</div>
                  {category.description && <div className="text-xs text-gray-500 mt-1">{category.description}</div>}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {totalArticles}
                </Badge>
              </div>
            </Button>

            {isExpanded && (
              <div className="pl-6 pb-2 space-y-1">
                {/* Category Articles */}
                {categoryArticles.map((article) => (
                  <Button
                    key={article.id}
                    variant="ghost"
                    className={`w-full justify-start p-2 h-auto text-sm ${
                      selectedArticle?.id === article.id ? "bg-blue-50 text-blue-700" : ""
                    }`}
                    onClick={() => onSelectArticle(article)}
                  >
                    <div className="flex items-center space-x-2 w-full">
                      <FileText className="h-3 w-3 text-gray-400" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{article.title}</div>
                        {article.summary && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">{article.summary}</div>
                        )}
                      </div>
                      {Array.isArray(article.tags) && article.tags.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {article.tags[0]}
                        </Badge>
                      )}
                    </div>
                  </Button>
                ))}

                {/* Subcategories */}
                {subcategories.map((subcategory) => {
                  const isSubExpanded = expandedSubcategories.has(subcategory.id)
                  const subArticles = Array.isArray(subcategory.articles) ? subcategory.articles : []

                  return (
                    <div key={subcategory.id} className="ml-4">
                      <Button
                        variant="ghost"
                        className="w-full justify-start p-2 h-auto text-sm"
                        onClick={() => toggleSubcategory(subcategory.id)}
                      >
                        <div className="flex items-center space-x-2 w-full">
                          {isSubExpanded ? (
                            <ChevronDown className="h-3 w-3 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-3 w-3 text-gray-400" />
                          )}
                          {isSubExpanded ? (
                            <FolderOpen className="h-3 w-3 text-green-500" />
                          ) : (
                            <Folder className="h-3 w-3 text-green-500" />
                          )}
                          <div className="flex-1 text-left">
                            <div className="font-medium">{subcategory.name}</div>
                            {subcategory.description && (
                              <div className="text-xs text-gray-500 mt-1">{subcategory.description}</div>
                            )}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {subArticles.length}
                          </Badge>
                        </div>
                      </Button>

                      {isSubExpanded && (
                        <div className="ml-6 space-y-1">
                          {subArticles.map((article) => (
                            <Button
                              key={article.id}
                              variant="ghost"
                              className={`w-full justify-start p-2 h-auto text-sm ${
                                selectedArticle?.id === article.id ? "bg-blue-50 text-blue-700" : ""
                              }`}
                              onClick={() => onSelectArticle(article)}
                            >
                              <div className="flex items-center space-x-2 w-full">
                                <FileText className="h-3 w-3 text-gray-400" />
                                <div className="flex-1 text-left">
                                  <div className="font-medium">{article.title}</div>
                                  {article.summary && (
                                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">{article.summary}</div>
                                  )}
                                </div>
                                {Array.isArray(article.tags) && article.tags.length > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    {article.tags[0]}
                                  </Badge>
                                )}
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
