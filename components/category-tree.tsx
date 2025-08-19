"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
      <div className="p-4 text-center text-gray-500">
        <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No categories available</p>
        <p className="text-xs text-gray-400 mt-1">Create categories in the Admin section</p>
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
              size="sm"
              onClick={() => toggleCategory(category.id)}
              className="w-full justify-start px-2 py-1 h-auto text-left"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
              )}
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 mr-2 flex-shrink-0 text-blue-600" />
              ) : (
                <Folder className="h-4 w-4 mr-2 flex-shrink-0 text-gray-600" />
              )}
              <span className="truncate flex-1">{category.name}</span>
              <Badge variant="secondary" className="ml-2 text-xs">
                {categoryArticles.length +
                  subcategories.reduce((acc, sub) => acc + (Array.isArray(sub.articles) ? sub.articles.length : 0), 0)}
              </Badge>
            </Button>

            {isExpanded && (
              <div className="ml-4 space-y-1">
                {/* Category Articles */}
                {categoryArticles.map((article) => (
                  <Button
                    key={article.id}
                    variant={selectedArticleId === article.id ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => handleArticleClick(article)}
                    className="w-full justify-start px-2 py-1 h-auto text-left"
                  >
                    <FileText className="h-3 w-3 mr-2 flex-shrink-0 text-green-600" />
                    <span className="truncate flex-1 text-sm">{article.title}</span>
                    <Badge variant={article.status === "published" ? "default" : "outline"} className="ml-2 text-xs">
                      {article.status}
                    </Badge>
                  </Button>
                ))}

                {/* Subcategories */}
                {subcategories.map((subcategory) => {
                  const subArticles = Array.isArray(subcategory.articles) ? subcategory.articles : []
                  const isSubExpanded = expandedCategories.has(subcategory.id)

                  return (
                    <div key={subcategory.id} className="space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCategory(subcategory.id)}
                        className="w-full justify-start px-2 py-1 h-auto text-left"
                      >
                        {isSubExpanded ? (
                          <ChevronDown className="h-3 w-3 mr-1 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-3 w-3 mr-1 flex-shrink-0" />
                        )}
                        {isSubExpanded ? (
                          <FolderOpen className="h-3 w-3 mr-2 flex-shrink-0 text-blue-500" />
                        ) : (
                          <Folder className="h-3 w-3 mr-2 flex-shrink-0 text-gray-500" />
                        )}
                        <span className="truncate flex-1 text-sm">{subcategory.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {subArticles.length}
                        </Badge>
                      </Button>

                      {isSubExpanded && (
                        <div className="ml-4 space-y-1">
                          {subArticles.map((article) => (
                            <Button
                              key={article.id}
                              variant={selectedArticleId === article.id ? "secondary" : "ghost"}
                              size="sm"
                              onClick={() => handleArticleClick(article)}
                              className="w-full justify-start px-2 py-1 h-auto text-left"
                            >
                              <FileText className="h-3 w-3 mr-2 flex-shrink-0 text-green-600" />
                              <span className="truncate flex-1 text-sm">{article.title}</span>
                              <Badge
                                variant={article.status === "published" ? "default" : "outline"}
                                className="ml-2 text-xs"
                              >
                                {article.status}
                              </Badge>
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
