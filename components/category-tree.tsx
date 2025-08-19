"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from "lucide-react"
import type { Category, Article, Subcategory } from "../types/knowledge-base"

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

  const renderArticle = (article: Article, level = 0) => {
    const isSelected = selectedArticle?.id === article.id
    const paddingLeft = `${(level + 1) * 20}px`

    return (
      <div
        key={article.id}
        className={`flex items-center space-x-2 py-2 px-2 cursor-pointer hover:bg-gray-50 rounded ${
          isSelected ? "bg-blue-50 border-l-4 border-blue-500" : ""
        }`}
        style={{ paddingLeft }}
        onClick={() => onSelectArticle(article)}
      >
        <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
        <span className="text-sm truncate">{article.title}</span>
      </div>
    )
  }

  const renderSubcategory = (subcategory: Subcategory, categoryId: string) => {
    const isExpanded = expandedSubcategories.has(subcategory.id)
    const hasArticles = subcategory.articles && subcategory.articles.length > 0

    return (
      <div key={subcategory.id} className="ml-4">
        <div
          className="flex items-center space-x-2 py-2 px-2 cursor-pointer hover:bg-gray-50 rounded"
          onClick={() => hasArticles && toggleSubcategory(subcategory.id)}
        >
          {hasArticles ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )
          ) : (
            <div className="w-4 h-4" />
          )}
          {isExpanded ? <FolderOpen className="h-4 w-4 text-blue-500" /> : <Folder className="h-4 w-4 text-blue-500" />}
          <span className="text-sm font-medium">{subcategory.name}</span>
          {hasArticles && <span className="text-xs text-gray-500 ml-auto">({subcategory.articles.length})</span>}
        </div>

        {isExpanded && hasArticles && (
          <div className="ml-4">{subcategory.articles.map((article) => renderArticle(article, 1))}</div>
        )}
      </div>
    )
  }

  const renderCategory = (category: Category) => {
    const isExpanded = expandedCategories.has(category.id)
    const hasContent =
      (category.articles && category.articles.length > 0) ||
      (category.subcategories && category.subcategories.length > 0)

    const totalArticles =
      (category.articles?.length || 0) +
      (category.subcategories?.reduce((sum, sub) => sum + (sub.articles?.length || 0), 0) || 0)

    return (
      <div key={category.id} className="mb-2">
        <div
          className="flex items-center space-x-2 py-2 px-2 cursor-pointer hover:bg-gray-50 rounded"
          onClick={() => hasContent && toggleCategory(category.id)}
        >
          {hasContent ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )
          ) : (
            <div className="w-4 h-4" />
          )}
          {isExpanded ? <FolderOpen className="h-4 w-4 text-blue-600" /> : <Folder className="h-4 w-4 text-blue-600" />}
          <span className="font-medium">{category.name}</span>
          {totalArticles > 0 && <span className="text-xs text-gray-500 ml-auto">({totalArticles})</span>}
        </div>

        {isExpanded && (
          <div className="ml-4">
            {/* Render direct articles */}
            {category.articles?.map((article) => renderArticle(article))}

            {/* Render subcategories */}
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

  return <div className="space-y-1">{categories.map(renderCategory)}</div>
}
