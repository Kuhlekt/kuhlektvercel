"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Folder, FolderOpen, FileText, ChevronRight, ChevronDown } from "lucide-react"
import { useState } from "react"
import type { Category } from "../types/knowledge-base"

interface CategoryTreeProps {
  categories: Category[]
  selectedCategory: string | null
  onCategorySelect: (categoryId: string | null) => void
}

export function CategoryTree({ categories, selectedCategory, onCategorySelect }: CategoryTreeProps) {
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

  const getArticleCount = (category: Category): number => {
    let count = category.articles?.length || 0
    if (category.subcategories) {
      category.subcategories.forEach((sub) => {
        count += sub.articles?.length || 0
      })
    }
    return count
  }

  const getTotalArticles = (): number => {
    return categories.reduce((total, category) => total + getArticleCount(category), 0)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Folder className="h-5 w-5 mr-2" />
          Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* All Articles */}
        <Button
          variant={selectedCategory === null ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onCategorySelect(null)}
        >
          <FileText className="h-4 w-4 mr-2" />
          All Articles
          <Badge variant="secondary" className="ml-auto">
            {getTotalArticles()}
          </Badge>
        </Button>

        {/* Categories */}
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.id)
          const hasSubcategories = category.subcategories && category.subcategories.length > 0
          const articleCount = getArticleCount(category)

          return (
            <div key={category.id} className="space-y-1">
              {/* Main Category */}
              <div className="flex items-center">
                <Button
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className="flex-1 justify-start"
                  onClick={() => onCategorySelect(category.id)}
                >
                  {hasSubcategories ? (
                    isExpanded ? (
                      <FolderOpen className="h-4 w-4 mr-2" />
                    ) : (
                      <Folder className="h-4 w-4 mr-2" />
                    )
                  ) : (
                    <Folder className="h-4 w-4 mr-2" />
                  )}
                  <span className="truncate">{category.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {articleCount}
                  </Badge>
                </Button>
                {hasSubcategories && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-8 w-8 p-0"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                )}
              </div>

              {/* Subcategories */}
              {hasSubcategories && isExpanded && (
                <div className="ml-4 space-y-1">
                  {category.subcategories!.map((subcategory) => (
                    <Button
                      key={subcategory.id}
                      variant={selectedCategory === subcategory.id ? "default" : "ghost"}
                      className="w-full justify-start text-sm"
                      onClick={() => onCategorySelect(subcategory.id)}
                    >
                      <Folder className="h-3 w-3 mr-2" />
                      <span className="truncate">{subcategory.name}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {subcategory.articles?.length || 0}
                      </Badge>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {categories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Folder className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">No categories available</p>
            <p className="text-xs text-gray-400 mt-1">Categories will appear here once created</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
