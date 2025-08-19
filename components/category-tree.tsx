"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from "lucide-react"
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

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const getChildCategories = (parentId?: string) => {
    return categories.filter((cat) => cat.parentId === parentId)
  }

  const getCategoryArticles = (categoryId: string) => {
    return articles.filter((article) => article.categoryId === categoryId && article.status === "published")
  }

  const renderCategory = (category: Category, level = 0) => {
    const childCategories = getChildCategories(category.id)
    const categoryArticles = getCategoryArticles(category.id)
    const hasChildren = childCategories.length > 0 || categoryArticles.length > 0
    const isExpanded = expandedCategories.has(category.id)
    const isSelected = selectedCategoryId === category.id

    return (
      <div key={category.id}>
        <div
          className={`flex items-center space-x-1 py-1 px-2 rounded cursor-pointer hover:bg-gray-100 ${
            isSelected ? "bg-blue-50 text-blue-700" : ""
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {hasChildren && (
            <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => toggleCategory(category.id)}>
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          )}
          {!hasChildren && <div className="w-4" />}

          <div className="flex items-center space-x-2 flex-1" onClick={() => onCategorySelect(category.id)}>
            {isExpanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
            <span className="text-sm font-medium">{category.name}</span>
          </div>
        </div>

        {isExpanded && (
          <>
            {childCategories.map((child) => renderCategory(child, level + 1))}
            {categoryArticles.map((article) => (
              <div
                key={article.id}
                className={`flex items-center space-x-2 py-1 px-2 rounded cursor-pointer hover:bg-gray-100 ${
                  selectedArticleId === article.id ? "bg-blue-50 text-blue-700" : ""
                }`}
                style={{ paddingLeft: `${(level + 1) * 16 + 24}px` }}
                onClick={() => onArticleSelect(article.id)}
              >
                <FileText className="h-4 w-4" />
                <span className="text-sm">{article.title}</span>
              </div>
            ))}
          </>
        )}
      </div>
    )
  }

  const rootCategories = getChildCategories()

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Categories</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {rootCategories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Folder className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No categories yet</p>
              <p className="text-xs">Create categories in the Admin Panel</p>
            </div>
          ) : (
            rootCategories.map((category) => renderCategory(category))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
