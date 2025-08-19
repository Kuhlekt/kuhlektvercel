"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen } from "lucide-react"
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

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const getCategoryArticles = (categoryId: string) => {
    return articles.filter((article) => article.categoryId === categoryId && article.status === "published")
  }

  const getSubcategories = (parentId: string | null) => {
    return categories.filter((cat) => cat.parentId === parentId)
  }

  const renderCategory = (category: Category, level = 0) => {
    const subcategories = getSubcategories(category.id)
    const categoryArticles = getCategoryArticles(category.id)
    const isExpanded = expandedCategories.has(category.id)
    const isSelected = selectedCategoryId === category.id
    const hasChildren = subcategories.length > 0 || categoryArticles.length > 0

    return (
      <div key={category.id}>
        <div
          className={`flex items-center space-x-2 px-2 py-1 rounded cursor-pointer hover:bg-gray-100 ${
            isSelected ? "bg-blue-50 text-blue-700" : ""
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            onCategorySelect(category.id)
            if (hasChildren) {
              toggleCategory(category.id)
            }
          }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <div className="w-4" />
          )}
          {isExpanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
          <span className="text-sm font-medium">{category.name}</span>
          {categoryArticles.length > 0 && (
            <span className="text-xs text-gray-500 ml-auto">({categoryArticles.length})</span>
          )}
        </div>

        {isExpanded && (
          <div>
            {subcategories.map((subcat) => renderCategory(subcat, level + 1))}
            {categoryArticles.map((article) => (
              <div
                key={article.id}
                className={`flex items-center space-x-2 px-2 py-1 rounded cursor-pointer hover:bg-gray-100 ${
                  selectedArticleId === article.id ? "bg-blue-50 text-blue-700" : ""
                }`}
                style={{ paddingLeft: `${(level + 1) * 16 + 8}px` }}
                onClick={() => onArticleSelect(article.id)}
              >
                <div className="w-4" />
                <FileText className="h-4 w-4" />
                <span className="text-sm">{article.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const rootCategories = getSubcategories(null)
  const uncategorizedArticles = articles.filter((article) => !article.categoryId && article.status === "published")

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {rootCategories.length === 0 && uncategorizedArticles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Folder className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">No categories or articles yet</p>
              <p className="text-xs mt-1">Create your first category and article to get started</p>
            </div>
          ) : (
            <>
              {rootCategories.map((category) => renderCategory(category))}

              {uncategorizedArticles.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center space-x-2 px-2 py-1 text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">Uncategorized</span>
                  </div>
                  {uncategorizedArticles.map((article) => (
                    <div
                      key={article.id}
                      className={`flex items-center space-x-2 px-2 py-1 ml-4 rounded cursor-pointer hover:bg-gray-100 ${
                        selectedArticleId === article.id ? "bg-blue-50 text-blue-700" : ""
                      }`}
                      onClick={() => onArticleSelect(article.id)}
                    >
                      <div className="w-4" />
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{article.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
