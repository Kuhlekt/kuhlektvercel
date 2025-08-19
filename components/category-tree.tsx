"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    const paddingLeft = `${(level + 1) * 1.5}rem`

    return (
      <div
        key={article.id}
        className={`flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer rounded text-sm ${
          isSelected ? "bg-blue-50 border-l-2 border-blue-500" : ""
        }`}
        style={{ paddingLeft }}
        onClick={() => onSelectArticle(article)}
      >
        <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
        <span className="flex-1 truncate">{article.title}</span>
        {article.priority === "high" && (
          <Badge variant="destructive" className="text-xs">
            High
          </Badge>
        )}
        {article.status === "draft" && (
          <Badge variant="secondary" className="text-xs">
            Draft
          </Badge>
        )}
      </div>
    )
  }

  const renderSubcategory = (subcategory: Subcategory, categoryId: string) => {
    const isExpanded = expandedSubcategories.has(subcategory.id)
    const hasArticles = subcategory.articles && subcategory.articles.length > 0

    return (
      <div key={subcategory.id} className="ml-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start p-2 h-auto text-sm"
          onClick={() => toggleSubcategory(subcategory.id)}
        >
          {hasArticles ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 mr-2" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2" />
            )
          ) : (
            <div className="w-4 mr-2" />
          )}
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 mr-2 text-blue-500" />
          ) : (
            <Folder className="h-4 w-4 mr-2 text-gray-500" />
          )}
          <span className="flex-1 text-left truncate">{subcategory.name}</span>
          {hasArticles && (
            <Badge variant="outline" className="text-xs ml-2">
              {subcategory.articles.length}
            </Badge>
          )}
        </Button>

        {isExpanded && hasArticles && (
          <div className="ml-2 space-y-1">{subcategory.articles.map((article) => renderArticle(article, 1))}</div>
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
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start p-2 h-auto font-medium"
          onClick={() => toggleCategory(category.id)}
        >
          {hasContent ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 mr-2" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2" />
            )
          ) : (
            <div className="w-4 mr-2" />
          )}
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 mr-2 text-blue-500" />
          ) : (
            <Folder className="h-4 w-4 mr-2 text-gray-600" />
          )}
          <span className="flex-1 text-left truncate">{category.name}</span>
          {totalArticles > 0 && (
            <Badge variant="outline" className="text-xs ml-2">
              {totalArticles}
            </Badge>
          )}
        </Button>

        {isExpanded && (
          <div className="ml-2 space-y-1">
            {/* Render category articles first */}
            {category.articles && category.articles.map((article) => renderArticle(article, 0))}

            {/* Then render subcategories */}
            {category.subcategories &&
              category.subcategories.map((subcategory) => renderSubcategory(subcategory, category.id))}
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
