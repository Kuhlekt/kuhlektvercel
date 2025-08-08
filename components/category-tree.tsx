"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No categories available</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => {
        const isExpanded = expandedCategories.has(category.id)
        const isSelected = selectedCategories.has(category.id)
        const totalArticles = category.articles.length + 
          category.subcategories.reduce((sum, sub) => sum + sub.articles.length, 0)

        return (
          <div key={category.id} className="space-y-1">
            {/* Main Category */}
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => toggleExpanded(category.id)}
                disabled={category.subcategories.length === 0}
              >
                {category.subcategories.length > 0 ? (
                  isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )
                ) : (
                  <div className="h-4 w-4" />
                )}
              </Button>

              <Checkbox
                id={`category-${category.id}`}
                checked={isSelected}
                onCheckedChange={() => onCategoryToggle(category.id)}
                className="h-4 w-4"
              />

              <div className="flex items-center space-x-2 flex-1 min-w-0">
                {isExpanded ? (
                  <FolderOpen className="h-4 w-4 text-blue-500 flex-shrink-0" />
                ) : (
                  <Folder className="h-4 w-4 text-blue-500 flex-shrink-0" />
                )}
                <label
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-medium cursor-pointer truncate flex-1"
                >
                  {category.name}
                </label>
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  {totalArticles}
                </Badge>
              </div>
            </div>

            {/* Subcategories */}
            {isExpanded && category.subcategories.length > 0 && (
              <div className="ml-8 space-y-1">
                {category.subcategories.map((subcategory) => {
                  const isSubSelected = selectedSubcategories.has(subcategory.id)

                  return (
                    <div
                      key={subcategory.id}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50"
                    >
                      <div className="h-6 w-6" /> {/* Spacer for alignment */}
                      
                      <Checkbox
                        id={`subcategory-${subcategory.id}`}
                        checked={isSubSelected}
                        onCheckedChange={() => onSubcategoryToggle(subcategory.id)}
                        className="h-4 w-4"
                      />

                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <Folder className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <label
                          htmlFor={`subcategory-${subcategory.id}`}
                          className="text-sm cursor-pointer truncate flex-1"
                        >
                          {subcategory.name}
                        </label>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {subcategory.articles.length}
                        </Badge>
                      </div>
                    </div>
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
