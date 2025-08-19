"use client"

import React from "react"
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { Category, Article } from "../types/knowledge-base"

interface CategoryTreeProps {
  categories: Category[]
  onSelectArticle: (article: Article) => void
  selectedArticle: Article | null
}

export function CategoryTree({ categories, onSelectArticle, selectedArticle }: CategoryTreeProps) {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set())
  const [expandedSubcategories, setExpandedSubcategories] = React.useState<Set<string>>(new Set())

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

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No categories available</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <Collapsible
          key={category.id}
          open={expandedCategories.has(category.id)}
          onOpenChange={() => toggleCategory(category.id)}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-2 h-auto font-normal hover:bg-gray-100">
              {expandedCategories.has(category.id) ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              {expandedCategories.has(category.id) ? (
                <FolderOpen className="h-4 w-4 mr-2" />
              ) : (
                <Folder className="h-4 w-4 mr-2" />
              )}
              <div className="text-left">
                <div className="font-medium">{category.name}</div>
                <div className="text-xs text-gray-500">{category.description}</div>
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-6 space-y-1">
            {/* Category Articles */}
            {category.articles.map((article) => (
              <Button
                key={article.id}
                variant="ghost"
                className={`w-full justify-start p-2 h-auto font-normal ${
                  selectedArticle?.id === article.id ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                }`}
                onClick={() => onSelectArticle(article)}
              >
                <FileText className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="text-sm">{article.title}</div>
                </div>
              </Button>
            ))}

            {/* Subcategories */}
            {category.subcategories.map((subcategory) => (
              <Collapsible
                key={subcategory.id}
                open={expandedSubcategories.has(subcategory.id)}
                onOpenChange={() => toggleSubcategory(subcategory.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-2 h-auto font-normal hover:bg-gray-100 ml-2"
                  >
                    {expandedSubcategories.has(subcategory.id) ? (
                      <ChevronDown className="h-4 w-4 mr-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2" />
                    )}
                    {expandedSubcategories.has(subcategory.id) ? (
                      <FolderOpen className="h-4 w-4 mr-2" />
                    ) : (
                      <Folder className="h-4 w-4 mr-2" />
                    )}
                    <div className="text-left">
                      <div className="text-sm font-medium">{subcategory.name}</div>
                      <div className="text-xs text-gray-500">{subcategory.description}</div>
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-6 space-y-1">
                  {subcategory.articles.map((article) => (
                    <Button
                      key={article.id}
                      variant="ghost"
                      className={`w-full justify-start p-2 h-auto font-normal ${
                        selectedArticle?.id === article.id ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                      }`}
                      onClick={() => onSelectArticle(article)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <div className="text-sm">{article.title}</div>
                      </div>
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}
