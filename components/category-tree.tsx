'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react'
import { useState } from 'react'
import type { Category, Article } from '@/types/knowledge-base'

interface CategoryTreeProps {
  categories: Category[]
  articles: Article[]
  selectedCategoryId: string | null
  onCategorySelect: (categoryId: string) => void
}

export function CategoryTree({
  categories,
  articles,
  selectedCategoryId,
  onCategorySelect
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

  const getDirectArticleCount = (categoryId: string) => {
    return articles.filter(article => 
      article.categoryId === categoryId && !article.subcategoryId
    ).length
  }

  const getSubcategoryArticleCount = (subcategoryId: string) => {
    return articles.filter(article => article.subcategoryId === subcategoryId).length
  }

  return (
    <div className="space-y-1">
      {categories.map((category) => {
        const isExpanded = expandedCategories.has(category.id)
        const isSelected = selectedCategoryId === category.id
        const directArticleCount = getDirectArticleCount(category.id)

        return (
          <div key={category.id}>
            <div className="flex items-center space-x-1">
              {category.subcategories.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => toggleExpanded(category.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              
              <Button
                variant={isSelected ? "default" : "ghost"}
                className="flex-1 justify-start h-8"
                onClick={() => onCategorySelect(category.id)}
              >
                {isSelected ? (
                  <FolderOpen className="h-4 w-4 mr-2" />
                ) : (
                  <Folder className="h-4 w-4 mr-2" />
                )}
                <span className="truncate">{category.name}</span>
                {directArticleCount > 0 && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {directArticleCount}
                  </Badge>
                )}
              </Button>
            </div>

            {isExpanded && category.subcategories.length > 0 && (
              <div className="ml-6 mt-1 space-y-1">
                {category.subcategories.map((subcategory) => {
                  const subcategoryCount = getSubcategoryArticleCount(subcategory.id)
                  
                  return (
                    <Button
                      key={subcategory.id}
                      variant="ghost"
                      className="w-full justify-start h-8 text-sm"
                      onClick={() => onCategorySelect(category.id)}
                    >
                      <Folder className="h-3 w-3 mr-2 text-gray-400" />
                      <span className="truncate">{subcategory.name}</span>
                      {subcategoryCount > 0 && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          {subcategoryCount}
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
