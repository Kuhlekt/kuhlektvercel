"use client"

import { Folder, FileText, ChevronRight, ChevronDown } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Category, Article } from "../types/knowledge-base"

interface CategoryTreeProps {
  categories: Category[]
  articles: Article[]
  selectedCategoryId: string | null
  selectedArticleId: string | null
  onCategorySelect: (categoryId: string) => void
  onArticleSelect: (articleId: string) => void
}

export function CategoryTree({
  categories,
  articles,
  selectedCategoryId,
  selectedArticleId,
  onCategorySelect,
  onArticleSelect,
}: CategoryTreeProps) {
  const getCategoryArticles = (categoryId: string) => {
    return articles.filter((article) => article.categoryId === categoryId && article.status === "published")
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Categories</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {categories.map((category) => {
            const categoryArticles = getCategoryArticles(category.id)
            const isSelected = selectedCategoryId === category.id
            const isExpanded = isSelected

            return (
              <div key={category.id} className="mb-2">
                <button
                  onClick={() => onCategorySelect(category.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-gray-100 transition-colors",
                    isSelected && "bg-blue-50 text-blue-700",
                  )}
                >
                  <div className="flex items-center space-x-2 flex-1">
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <Folder className="h-4 w-4" />
                    <span className="font-medium truncate">{category.name}</span>
                  </div>
                  {categoryArticles.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {categoryArticles.length}
                    </Badge>
                  )}
                </button>

                {isExpanded && categoryArticles.length > 0 && (
                  <div className="ml-6 mt-1 space-y-1">
                    {categoryArticles.map((article) => (
                      <button
                        key={article.id}
                        onClick={() => onArticleSelect(article.id)}
                        className={cn(
                          "w-full flex items-center space-x-2 p-2 rounded-md text-left hover:bg-gray-100 transition-colors text-sm",
                          selectedArticleId === article.id && "bg-blue-50 text-blue-700",
                        )}
                      >
                        <FileText className="h-3 w-3" />
                        <span className="truncate">{article.title}</span>
                      </button>
                    ))}
                  </div>
                )}

                {isExpanded && categoryArticles.length === 0 && (
                  <div className="ml-6 mt-1 p-2 text-sm text-gray-500 italic">No articles in this category</div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
