"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Folder, FolderOpen, FileText } from "lucide-react"
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

  const getTotalArticles = (category: Category) => {
    const directArticles = category.articles?.length || 0
    const subcategoryArticles = category.subcategories?.reduce((sum, sub) => sum + (sub.articles?.length || 0), 0) || 0
    return directArticles + subcategoryArticles
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Folder className="h-5 w-5 mr-2" />
          Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {/* All Articles Option */}
          <Button
            variant={selectedCategory === null ? "secondary" : "ghost"}
            className="w-full justify-start px-4 py-2 h-auto"
            onClick={() => onCategorySelect(null)}
          >
            <FileText className="h-4 w-4 mr-2" />
            <span>All Articles</span>
            <Badge variant="outline" className="ml-auto">
              {categories.reduce((total, cat) => total + getTotalArticles(cat), 0)}
            </Badge>
          </Button>

          {/* Category Tree */}
          {categories.map((category) => {
            const isExpanded = expandedCategories.has(category.id)
            const isSelected = selectedCategory === category.id
            const totalArticles = getTotalArticles(category)
            const hasSubcategories = category.subcategories && category.subcategories.length > 0

            return (
              <div key={category.id}>
                {/* Main Category */}
                <div className="flex items-center">
                  {hasSubcategories && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 mr-1"
                      onClick={() => toggleCategory(category.id)}
                    >
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  )}

                  <Button
                    variant={isSelected ? "secondary" : "ghost"}
                    className={`flex-1 justify-start px-2 py-2 h-auto ${!hasSubcategories ? "ml-9" : ""}`}
                    onClick={() => onCategorySelect(category.id)}
                  >
                    {isExpanded ? <FolderOpen className="h-4 w-4 mr-2" /> : <Folder className="h-4 w-4 mr-2" />}
                    <span className="truncate">{category.name}</span>
                    <Badge variant="outline" className="ml-auto">
                      {totalArticles}
                    </Badge>
                  </Button>
                </div>

                {/* Subcategories */}
                {hasSubcategories && isExpanded && (
                  <div className="ml-6 space-y-1">
                    {category.subcategories!.map((subcategory) => {
                      const isSubSelected = selectedCategory === subcategory.id
                      const subArticleCount = subcategory.articles?.length || 0

                      return (
                        <Button
                          key={subcategory.id}
                          variant={isSubSelected ? "secondary" : "ghost"}
                          className="w-full justify-start px-2 py-2 h-auto text-sm"
                          onClick={() => onCategorySelect(subcategory.id)}
                        >
                          <Folder className="h-3 w-3 mr-2" />
                          <span className="truncate">{subcategory.name}</span>
                          <Badge variant="outline" className="ml-auto text-xs">
                            {subArticleCount}
                          </Badge>
                        </Button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}

          {categories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Folder className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No categories yet.</p>
              <p className="text-sm">Categories will appear here once created.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
