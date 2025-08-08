"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react'
import type { Category } from "../types/knowledge-base"

interface CategoryTreeProps {
  categories: Category[]
  selectedCategories: Set<string>
  selectedSubcategories: Set<string>
  onCategoryToggle: (categoryId: string) => void
  onSubcategoryToggle: (subcategoryId: string) => void
}

export function CategoryTree({
  categories,
  selectedCategories,
  selectedSubcategories,
  onCategoryToggle,
  onSubcategoryToggle,
}: CategoryTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.filter(cat => cat.expanded).map(cat => cat.id))
  )

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => {
        const isExpanded = expandedCategories.has(category.id)
        const isSelected = selectedCategories.has(category.id)
        const hasSubcategories = category.subcategories.length > 0
        
        // Only count direct articles in the category, not subcategory articles
        const directArticleCount = category.articles.length

        return (
          <div key={category.id} className="space-y-1">
            <div className="flex items-center space-x-2">
              {hasSubcategories ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleExpanded(category.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              ) : (
                <div className="w-6" />
              )}
              
              <Button
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                className="flex-1 justify-start h-8"
                onClick={() => onCategoryToggle(category.id)}
              >
                {isExpanded ? (
                  <FolderOpen className="h-4 w-4 mr-2" />
                ) : (
                  <Folder className="h-4 w-4 mr-2" />
                )}
                <span className="truncate">{category.name}</span>
                {directArticleCount > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {directArticleCount}
                  </Badge>
                )}
              </Button>
            </div>

            {isExpanded && hasSubcategories && (
              <div className="ml-8 space-y-1">
                {category.subcategories.map((subcategory) => {
                  const isSubSelected = selectedSubcategories.has(subcategory.id)
                  const subcategoryArticleCount = subcategory.articles.length

                  return (
                    <Button
                      key={subcategory.id}
                      variant={isSubSelected ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start h-8"
                      onClick={() => onSubcategoryToggle(subcategory.id)}
                    >
                      <Folder className="h-4 w-4 mr-2" />
                      <span className="truncate">{subcategory.name}</span>
                      {subcategoryArticleCount > 0 && (
                        <Badge variant="outline" className="ml-auto">
                          {subcategoryArticleCount}
                        </Badge>
                      )}
                    </Button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
