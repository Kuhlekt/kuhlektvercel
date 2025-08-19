"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Folder, FolderOpen, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Category, Article } from "../types/knowledge-base"

interface CategoryTreeProps {
  categories: Category[]
  articles: Article[]
  selectedCategoryId: string | null
  selectedArticleId: string | null
  onCategorySelect: (categoryId: string) => void
  onArticleSelect: (articleId: string) => void
}

export function CategoryTree({
  categories,
  articles,
  selectedCategoryId,
  selectedArticleId,
  onCategorySelect,
  onArticleSelect,
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

  const getCategoryArticles = (categoryId: string, subcategoryId?: string) => {
    return articles.filter(
      (article) =>
        article.categoryId === categoryId &&
        article.status === "published" &&
        (subcategoryId ? article.subcategoryId === subcategoryId : !article.subcategoryId),
    )
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Categories</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {categories.map((category) => {
            const isExpanded = expandedCategories.has(category.id)
            const isSelected = selectedCategoryId === category.id
            const categoryArticles = getCategoryArticles(category.id)

            return (
              <div key={category.id} className="mb-1">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCategory(category.id)}
                    className="p-1 h-6 w-6 mr-1"
                  >
                    {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onCategorySelect(category.id)}
                    className={`flex-1 justify-start p-2 h-8 ${isSelected ? "bg-blue-100 text-blue-700" : ""}`}
                  >
                    {isExpanded ? <FolderOpen className="h-4 w-4 mr-2" /> : <Folder className="h-4 w-4 mr-2" />}
                    <span className="truncate">{category.name}</span>
                    {categoryArticles.length > 0 && (
                      <span className="ml-auto text-xs bg-gray-200 px-1 rounded">{categoryArticles.length}</span>
                    )}
                  </Button>
                </div>

                {isExpanded && (
                  <div className="ml-4 mt-1">
                    {/* Direct category articles */}
                    {categoryArticles.map((article) => (
                      <Button
                        key={article.id}
                        variant="ghost"
                        onClick={() => onArticleSelect(article.id)}
                        className={`w-full justify-start p-2 h-8 text-sm ${
                          selectedArticleId === article.id ? "bg-blue-100 text-blue-700" : ""
                        }`}
                      >
                        <FileText className="h-3 w-3 mr-2" />
                        <span className="truncate">{article.title}</span>
                      </Button>
                    ))}

                    {/* Subcategories */}
                    {category.subcategories.map((subcategory) => {
                      const isSubExpanded = expandedSubcategories.has(subcategory.id)
                      const subcategoryArticles = getCategoryArticles(category.id, subcategory.id)

                      return (
                        <div key={subcategory.id} className="mb-1">
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSubcategory(subcategory.id)}
                              className="p-1 h-6 w-6 mr-1"
                            >
                              {isSubExpanded ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </Button>
                            <Button variant="ghost" className="flex-1 justify-start p-2 h-8 text-sm">
                              {isSubExpanded ? (
                                <FolderOpen className="h-3 w-3 mr-2" />
                              ) : (
                                <Folder className="h-3 w-3 mr-2" />
                              )}
                              <span className="truncate">{subcategory.name}</span>
                              {subcategoryArticles.length > 0 && (
                                <span className="ml-auto text-xs bg-gray-200 px-1 rounded">
                                  {subcategoryArticles.length}
                                </span>
                              )}
                            </Button>
                          </div>

                          {isSubExpanded && (
                            <div className="ml-4 mt-1">
                              {subcategoryArticles.map((article) => (
                                <Button
                                  key={article.id}
                                  variant="ghost"
                                  onClick={() => onArticleSelect(article.id)}
                                  className={`w-full justify-start p-2 h-8 text-sm ${
                                    selectedArticleId === article.id ? "bg-blue-100 text-blue-700" : ""
                                  }`}
                                >
                                  <FileText className="h-3 w-3 mr-2" />
                                  <span className="truncate">{article.title}</span>
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
      </ScrollArea>
    </div>
  )
}
