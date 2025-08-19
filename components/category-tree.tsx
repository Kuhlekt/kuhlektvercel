"use client"

import { Folder, FileText, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
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
    <div className="w-80 bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Categories</h2>
      </div>

      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-2">
          {categories.map((category) => {
            const categoryArticles = getCategoryArticles(category.id)
            const isSelected = selectedCategoryId === category.id

            return (
              <div key={category.id} className="mb-2">
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start p-2 h-auto", isSelected && "bg-blue-50 text-blue-700")}
                  onClick={() => onCategorySelect(category.id)}
                >
                  <div className="flex items-center space-x-2 w-full">
                    {isSelected ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <Folder className="h-4 w-4" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-gray-500">
                        {categoryArticles.length} article{categoryArticles.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </Button>

                {isSelected && categoryArticles.length > 0 && (
                  <div className="ml-6 mt-1 space-y-1">
                    {categoryArticles.map((article) => (
                      <Button
                        key={article.id}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start p-2 h-auto text-sm",
                          selectedArticleId === article.id && "bg-blue-100 text-blue-800",
                        )}
                        onClick={() => onArticleSelect(article.id)}
                      >
                        <div className="flex items-center space-x-2 w-full">
                          <FileText className="h-3 w-3" />
                          <span className="truncate">{article.title}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
