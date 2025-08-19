"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from "lucide-react"
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

  const getArticlesForCategory = (categoryId: string) => {
    return articles.filter((article) => article.categoryId === categoryId && article.status === "published")
  }

  const renderCategory = (category: Category) => {
    const isExpanded = expandedCategories.has(category.id)
    const isSelected = selectedCategoryId === category.id
    const categoryArticles = getArticlesForCategory(category.id)

    return (
      <div key={category.id} className="mb-1">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="p-1 h-6 w-6" onClick={() => toggleCategory(category.id)}>
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 justify-start text-left h-8 px-2 ${
              isSelected ? "bg-blue-100 text-blue-900" : "hover:bg-gray-100"
            }`}
            onClick={() => onCategorySelect(category.id)}
          >
            {isExpanded ? <FolderOpen className="h-4 w-4 mr-2" /> : <Folder className="h-4 w-4 mr-2" />}
            <span className="truncate">{category.name}</span>
            <span className="ml-auto text-xs text-gray-500">({categoryArticles.length})</span>
          </Button>
        </div>

        {isExpanded && (
          <div className="ml-6 mt-1 space-y-1">
            {categoryArticles.map((article) => (
              <Button
                key={article.id}
                variant="ghost"
                className={`w-full justify-start text-left h-8 px-2 text-sm ${
                  selectedArticleId === article.id ? "bg-blue-50 text-blue-900" : "hover:bg-gray-50"
                }`}
                onClick={() => onArticleSelect(article.id)}
              >
                <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="truncate">{article.title}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Categories</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">{categories.map(renderCategory)}</div>
      </ScrollArea>
    </div>
  )
}
