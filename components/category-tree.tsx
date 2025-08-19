"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Category, Article, Subcategory } from "../types/knowledge-base"

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

  const renderArticle = (article: Article, level = 0) => (
    <div
      key={article.id}
      className={`flex items-center space-x-2 py-1 px-2 hover:bg-gray-50 cursor-pointer rounded text-sm ${
        selectedArticle?.id === article.id ? "bg-blue-50 text-blue-700" : ""
      }`}
      style={{ paddingLeft: `${(level + 1) * 16 + 8}px` }}
      onClick={() => onSelectArticle(article)}
    >
      <FileText className="h-4 w-4 flex-shrink-0" />
      <span className="truncate">{article.title}</span>
    </div>
  )

  const renderSubcategory = (subcategory: Subcategory, categoryId: string) => {
    const isExpanded = expandedSubcategories.has(subcategory.id)
    const hasArticles = subcategory.articles && subcategory.articles.length > 0

    return (
      <div key={subcategory.id}>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start h-auto py-1 px-2 font-normal text-sm"
          style={{ paddingLeft: "32px" }}
          onClick={() => hasArticles && toggleSubcategory(subcategory.id)}
        >
          {hasArticles ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
            )
          ) : (
            <div className="w-4 h-4 mr-2 flex-shrink-0" />
          )}
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 mr-2 flex-shrink-0" />
          ) : (
            <Folder className="h-4 w-4 mr-2 flex-shrink-0" />
          )}
          <span className="truncate">{subcategory.name}</span>
          {hasArticles && <span className="ml-auto text-xs text-gray-500">({subcategory.articles.length})</span>}
        </Button>

        {isExpanded && hasArticles && (
          <div className="space-y-1">{subcategory.articles.map((article) => renderArticle(article, 2))}</div>
        )}
      </div>
    )
  }

  const renderCategory = (category: Category) => {
    const isExpanded = expandedCategories.has(category.id)
    const totalArticles =
      (category.articles?.length || 0) +
      (category.subcategories?.reduce((sum, sub) => sum + (sub.articles?.length || 0), 0) || 0)

    return (
      <div key={category.id} className="space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start h-auto py-2 px-2 font-medium"
          onClick={() => toggleCategory(category.id)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
          )}
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 mr-2 flex-shrink-0" />
          ) : (
            <Folder className="h-4 w-4 mr-2 flex-shrink-0" />
          )}
          <span className="truncate">{category.name}</span>
          <span className="ml-auto text-xs text-gray-500">({totalArticles})</span>
        </Button>

        {isExpanded && (
          <div className="space-y-1">
            {category.articles?.map((article) => renderArticle(article, 1))}
            {category.subcategories?.map((subcategory) => renderSubcategory(subcategory, category.id))}
          </div>
        )}
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No categories available</p>
      </div>
    )
  }

  return <div className="space-y-2">{categories.map(renderCategory)}</div>
}
