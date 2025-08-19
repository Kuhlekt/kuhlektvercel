"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronRight, Folder, FileText } from "lucide-react"
import { useState } from "react"
import type { Category } from "../types/knowledge-base"

interface CategoryTreeProps {
  categories: Category[]
  onCategorySelect: (categoryId: string) => void
  selectedCategory: string | null
}

export function CategoryTree({ categories, onCategorySelect, selectedCategory }: CategoryTreeProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant={selectedCategory === null ? "default" : "ghost"}
          onClick={() => onCategorySelect("")}
          className="w-full justify-start h-auto p-2"
        >
          <Folder className="h-4 w-4 mr-2" />
          All Articles
        </Button>

        {categories.map((category) => (
          <div key={category.id} className="space-y-1">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCategory(category.id)}
                className="h-6 w-6 p-0 mr-1"
              >
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant={selectedCategory === category.id ? "default" : "ghost"}
                onClick={() => onCategorySelect(category.id)}
                className="flex-1 justify-start h-auto p-2"
              >
                <Folder className="h-4 w-4 mr-2" />
                <span>{category.name}</span>
                <span className="ml-auto text-xs text-gray-500">
                  (
                  {category.articles.length + category.subcategories.reduce((sum, sub) => sum + sub.articles.length, 0)}
                  )
                </span>
              </Button>
            </div>

            {expandedCategories.has(category.id) && (
              <div className="ml-6 space-y-1">
                {category.subcategories.map((subcategory) => (
                  <Button
                    key={subcategory.id}
                    variant={selectedCategory === subcategory.id ? "default" : "ghost"}
                    onClick={() => onCategorySelect(subcategory.id)}
                    className="w-full justify-start h-auto p-2"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    <span>{subcategory.name}</span>
                    <span className="ml-auto text-xs text-gray-500">({subcategory.articles.length})</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
