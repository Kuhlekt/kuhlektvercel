"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Folder, FolderOpen, FileText } from "lucide-react"
import type { Category, Article } from "../types/knowledge-base"

interface CategoryTreeProps {
  categories: Category[]
  onSelectArticle: (article: Article) => void
  selectedArticle: Article | null
}

export function CategoryTree({ categories, onSelectArticle, selectedArticle }: CategoryTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  if (!Array.isArray(categories) || categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="font-medium mb-2">No Categories Available</p>
        <p className="text-sm">Import your knowledge base data to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => {
        const isExpanded = expandedCategories.has(category.id)
        const hasSubcategories = Array.isArray(category.subcategories) && category.subcategories.length > 0
        const hasArticles = Array.isArray(category.articles) && category.articles.length > 0
        const directArticleCount = Array.isArray(category.articles) ? category.articles.length : 0

        return (
          <div key={category.id} className="space-y-1">
            <div className="flex items-center space-x-2">
              {hasSubcategories || hasArticles ? (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleExpanded(category.id)}>
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              ) : (
                <div className="w-6" />
              )}

              <Button
                variant="ghost"
                size="sm"
                className="flex-1 justify-start h-8"
                onClick={() => toggleExpanded(category.id)}
              >
                {isExpanded ? <FolderOpen className="h-4 w-4 mr-2" /> : <Folder className="h-4 w-4 mr-2" />}
                <span className="truncate">{category.name}</span>
                {directArticleCount > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {directArticleCount}
                  </Badge>
                )}
              </Button>
            </div>

            {isExpanded && (
              <div className="ml-8 space-y-1">
                {/* Direct articles in category */}
                {hasArticles &&
                  category.articles.map((article) => (
                    <Button
                      key={article.id}
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start h-8 ${
                        selectedArticle?.id === article.id ? "bg-blue-50 text-blue-700" : ""
                      }`}
                      onClick={() => onSelectArticle(article)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="truncate">{article.title}</span>
                    </Button>
                  ))}

                {/* Subcategories */}
                {hasSubcategories &&
                  category.subcategories.map((subcategory) => {
                    const subcategoryArticleCount = Array.isArray(subcategory.articles)
                      ? subcategory.articles.length
                      : 0

                    return (
                      <div key={subcategory.id} className="space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start h-8"
                          onClick={() => {
                            // Auto-expand subcategory when clicked
                            if (subcategoryArticleCount > 0) {
                              const newExpanded = new Set(expandedCategories)
                              newExpanded.add(subcategory.id)
                              setExpandedCategories(newExpanded)
                            }
                          }}
                        >
                          <Folder className="h-4 w-4 mr-2" />
                          <span className="truncate">{subcategory.name}</span>
                          {subcategoryArticleCount > 0 && (
                            <Badge variant="outline" className="ml-auto">
                              {subcategoryArticleCount}
                            </Badge>
                          )}
                        </Button>

                        {/* Subcategory articles */}
                        {subcategoryArticleCount > 0 &&
                          expandedCategories.has(subcategory.id) &&
                          subcategory.articles.map((article) => (
                            <Button
                              key={article.id}
                              variant="ghost"
                              size="sm"
                              className={`w-full justify-start h-8 ml-4 ${
                                selectedArticle?.id === article.id ? "bg-blue-50 text-blue-700" : ""
                              }`}
                              onClick={() => onSelectArticle(article)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              <span className="truncate">{article.title}</span>
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
