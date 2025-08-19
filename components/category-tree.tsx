"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react"
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

  const getTotalArticles = (category: Category): number => {
    let total = category.articles.length
    category.subcategories.forEach((sub) => {
      total += sub.articles.length
    })
    return total
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant={selectedCategory === null ? "default" : "ghost"}
          onClick={() => onCategorySelect(null)}
          className="w-full justify-start"
        >
          <Folder className="h-4 w-4 mr-2" />
          All Articles
        </Button>

        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.id)
          const isSelected = selectedCategory === category.id
          const totalArticles = getTotalArticles(category)

          return (
            <div key={category.id} className="space-y-1">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCategory(category.id)}
                  className="h-8 w-8 p-0 mr-1"
                  disabled={category.subcategories.length === 0}
                >
                  {category.subcategories.length > 0 ? (
                    isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )
                  ) : null}
                </Button>

                <Button
                  variant={isSelected ? "default" : "ghost"}
                  onClick={() => onCategorySelect(category.id)}
                  className="flex-1 justify-start"
                >
                  {isExpanded ? <FolderOpen className="h-4 w-4 mr-2" /> : <Folder className="h-4 w-4 mr-2" />}
                  <span className="truncate">{category.name}</span>
                  <span className="ml-auto text-xs text-gray-500">({totalArticles})</span>
                </Button>
              </div>

              {isExpanded && category.subcategories.length > 0 && (
                <div className="ml-6 space-y-1">
                  {category.subcategories.map((subcategory) => (
                    <Button
                      key={subcategory.id}
                      variant={selectedCategory === subcategory.id ? "default" : "ghost"}
                      onClick={() => onCategorySelect(subcategory.id)}
                      className="w-full justify-start text-sm"
                    >
                      <Folder className="h-3 w-3 mr-2" />
                      <span className="truncate">{subcategory.name}</span>
                      <span className="ml-auto text-xs text-gray-500">({subcategory.articles.length})</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
