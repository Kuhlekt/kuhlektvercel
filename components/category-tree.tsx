"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
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
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["1"]))

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
    const isExpanded = expandedCategories.has(category.id)
    const isSelected = selectedCategoryId === category.id
    const hasChildren = childCategories.length > 0 || categoryArticles.length > 0

    return (
      <div key={category.id}>
        <div
          className={`flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-gray-100 ${
            isSelected ? "bg-blue-50 border-r-2 border-blue-500" : ""
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
          onClick={() => {
            onCategorySelect(category.id)
            if (hasChildren) {
              toggleCategory(category.id)
            }
          }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleCategory(category.id)
              }}
              className="p-0.5 hover:bg-gray-200 rounded"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          )}
          {!hasChildren && <div className="w-5" />}

          {isExpanded ? <FolderOpen className="h-4 w-4 text-blue-600" /> : <Folder className="h-4 w-4 text-gray-600" />}

          <span className="flex-1 text-sm font-medium">{category.name}</span>

          {categoryArticles.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {categoryArticles.length}
            </Badge>
          )}
        </div>

        {isExpanded && (
          <div>
            {childCategories.map((child) => renderCategory(child, level + 1))}
            {categoryArticles.map((article) => (
              <div
                key={article.id}
                className={`flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  selectedArticleId === article.id ? "bg-green-50 border-r-2 border-green-500" : ""
                }`}
                style={{ paddingLeft: `${28 + level * 16}px` }}
                onClick={() => onArticleSelect(article.id)}
              >
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="flex-1 text-sm">{article.title}</span>
                {article.status === "draft" && (
                  <Badge variant="outline" className="text-xs">
                    Draft
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const rootCategories = getChildCategories()

  return (
    <div className="w-80 bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Categories</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="py-2">{rootCategories.map((category) => renderCategory(category))}</div>
      </ScrollArea>
    </div>
  )
}
