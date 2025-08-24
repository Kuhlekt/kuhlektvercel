"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Folder, FolderOpen, File, Star } from "lucide-react"
import type { Category } from "../types/knowledge-base"

interface CategoryTreeProps {
  categories: Category[]
  selectedCategory: string | null
  onCategorySelect: (categoryId: string | null) => void
}

export function CategoryTree({ categories = [], selectedCategory, onCategorySelect }: CategoryTreeProps) {
  // Safely handle undefined categories
  const safeCategories = Array.isArray(categories) ? categories : []

  const getTotalArticles = (category: Category): number => {
    let total = category.articles?.length || 0
    if (category.subcategories) {
      category.subcategories.forEach((sub) => {
        total += sub.articles?.length || 0
      })
    }
    return total
  }

  const getAllArticlesCount = (): number => {
    if (!Array.isArray(safeCategories)) return 0

    return safeCategories.reduce((total, cat) => {
      return total + getTotalArticles(cat)
    }, 0)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Folder className="h-5 w-5 mr-2" />
          Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* All Articles */}
        <Button
          variant={selectedCategory === null ? "default" : "ghost"}
          onClick={() => onCategorySelect(null)}
          className="w-full justify-start"
          size="sm"
        >
          <File className="h-4 w-4 mr-2" />
          All Articles
          <Badge variant="secondary" className="ml-auto">
            {getAllArticlesCount()}
          </Badge>
        </Button>

        {/* Categories */}
        {safeCategories.length > 0 ? (
          safeCategories.map((category) => (
            <div key={category.id} className="space-y-1">
              <Button
                variant={selectedCategory === category.id ? "default" : "ghost"}
                onClick={() => onCategorySelect(category.id)}
                className="w-full justify-start"
                size="sm"
              >
                {selectedCategory === category.id ? (
                  <FolderOpen className="h-4 w-4 mr-2" />
                ) : (
                  <Folder className="h-4 w-4 mr-2" />
                )}
                {category.name}
                <Badge variant="secondary" className="ml-auto">
                  {getTotalArticles(category)}
                </Badge>
              </Button>

              {/* Subcategories */}
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="ml-4 space-y-1">
                  {category.subcategories.map((subcategory) => (
                    <Button
                      key={subcategory.id}
                      variant={selectedCategory === subcategory.id ? "default" : "ghost"}
                      onClick={() => onCategorySelect(subcategory.id)}
                      className="w-full justify-start text-sm"
                      size="sm"
                    >
                      <Folder className="h-3 w-3 mr-2" />
                      {subcategory.name}
                      <Badge variant="outline" className="ml-auto text-xs">
                        {subcategory.articles?.length || 0}
                      </Badge>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Folder className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">No categories found</p>
            <p className="text-xs">Create categories in the admin panel</p>
          </div>
        )}

        {/* Selected Articles Section */}
        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            size="sm"
          >
            <Star className="h-4 w-4 mr-2" />
            Selected Articles
            <Badge variant="outline" className="ml-auto">
              0
            </Badge>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
