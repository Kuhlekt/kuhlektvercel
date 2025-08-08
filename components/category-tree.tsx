"use client"
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import type { Category, Article } from "../types/knowledge-base"

interface CategoryTreeProps {
  categories: Category[]
  onCategoryToggle: (categoryId: string) => void
  onCategorySelect: (categoryId: string, selected: boolean) => void
  onSubcategorySelect: (categoryId: string, subcategoryId: string, selected: boolean) => void
  onArticleSelect: (article: Article) => void
  selectedCategories: Set<string>
  selectedSubcategories: Set<string>
}

export function CategoryTree({
  categories,
  onCategoryToggle,
  onCategorySelect,
  onSubcategorySelect,
  onArticleSelect,
  selectedCategories,
  selectedSubcategories,
}: CategoryTreeProps) {
  return (
    <div className="space-y-1">
      {categories.map((category) => (
        <div key={category.id} className="space-y-1">
          <div className="flex items-center space-x-2 py-1 px-2 hover:bg-gray-50 rounded">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onCategoryToggle(category.id)}>
              {category.subcategories.length > 0 ? (
                category.expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
              ) : (
                <div className="w-4 h-4" />
              )}
            </Button>

            <Checkbox
              checked={selectedCategories.has(category.id)}
              onCheckedChange={(checked) => onCategorySelect(category.id, checked as boolean)}
            />

            <div className="flex items-center space-x-2 flex-1">
              {category.expanded && category.subcategories.length > 0 ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 text-blue-500" />
              )}
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
            </div>
          </div>

          {category.expanded && category.subcategories.length > 0 && (
            <div className="ml-8 space-y-1">
              {category.subcategories.map((subcategory) => (
                <div key={subcategory.id} className="flex items-center space-x-2 py-1 px-2 hover:bg-gray-50 rounded">
                  <div className="w-6" />
                  <Checkbox
                    checked={selectedSubcategories.has(subcategory.id)}
                    onCheckedChange={(checked) => onSubcategorySelect(category.id, subcategory.id, checked as boolean)}
                  />
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{subcategory.name}</span>
                  {subcategory.articles.length > 0 && (
                    <span className="text-xs text-gray-400 ml-auto">({subcategory.articles.length})</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {category.expanded && category.articles.length > 0 && (
            <div className="ml-8 space-y-1">
              {category.articles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center space-x-2 py-1 px-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => onArticleSelect(article)}
                >
                  <div className="w-6" />
                  <div className="w-4" />
                  <FileText className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">{article.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
