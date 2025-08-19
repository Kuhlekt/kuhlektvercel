"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Folder, FolderOpen, FileText, Search, BookOpen, Plus } from "lucide-react"
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
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const getSubcategories = (parentId: string | null) => {
    return categories.filter((cat) => cat.parentId === parentId)
  }

  const getCategoryArticles = (categoryId: string) => {
    return articles.filter((article) => article.categoryId === categoryId && article.status === "published")
  }

  const filterBySearch = (items: (Category | Article)[], term: string) => {
    if (!term) return items
    return items.filter(
      (item) =>
        item.name?.toLowerCase().includes(term.toLowerCase()) ||
        item.title?.toLowerCase().includes(term.toLowerCase()) ||
        (item as Article).content?.toLowerCase().includes(term.toLowerCase()),
    )
  }

  const renderCategory = (category: Category, level = 0) => {
    const subcategories = getSubcategories(category.id)
    const categoryArticles = getCategoryArticles(category.id)
    const isExpanded = expandedCategories.has(category.id)
    const isSelected = selectedCategoryId === category.id
    const hasChildren = subcategories.length > 0 || categoryArticles.length > 0

    const paddingLeft = level * 16 + 8

    return (
      <div key={category.id}>
        <div
          className={`flex items-center gap-2 py-2 px-2 cursor-pointer hover:bg-gray-100 rounded-md transition-colors ${
            isSelected ? "bg-blue-50 border-r-2 border-blue-500" : ""
          }`}
          style={{ paddingLeft }}
          onClick={() => {
            onCategorySelect(category.id)
            if (hasChildren) {
              toggleCategory(category.id)
            }
          }}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="w-4 h-4 p-0 hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                toggleCategory(category.id)
              }}
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </Button>
          ) : (
            <div className="w-4" />
          )}

          {isExpanded ? (
            <FolderOpen className="w-4 h-4 text-blue-600 flex-shrink-0" />
          ) : (
            <Folder className="w-4 h-4 text-blue-600 flex-shrink-0" />
          )}

          <span className="text-sm font-medium truncate flex-1">{category.name}</span>

          {categoryArticles.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {categoryArticles.length}
            </Badge>
          )}
        </div>

        {isExpanded && (
          <div>
            {subcategories.map((subcat) => renderCategory(subcat, level + 1))}
            {categoryArticles.map((article) => (
              <div
                key={article.id}
                className={`flex items-center gap-2 py-2 px-2 cursor-pointer hover:bg-gray-50 rounded-md transition-colors ml-4 ${
                  selectedArticleId === article.id ? "bg-blue-50 border-r-2 border-blue-500" : ""
                }`}
                style={{ paddingLeft: paddingLeft + 16 }}
                onClick={() => onArticleSelect(article.id)}
              >
                <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm truncate flex-1">{article.title}</span>
                {article.status === "draft" && (
                  <Badge variant="outline" className="text-xs">
                    Draft
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const rootCategories = getSubcategories(null)
  const filteredCategories = filterBySearch(rootCategories, searchTerm) as Category[]

  // Get orphaned articles (articles without a category or with non-existent category)
  const orphanedArticles = articles.filter((article) => {
    return article.status === "published" && !categories.find((cat) => cat.id === article.categoryId)
  })

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold">Knowledge Base</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          {categories.length === 0 && articles.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">No Content Yet</p>
                <p className="text-xs text-gray-500">
                  Start by creating categories and articles to organize your knowledge base.
                </p>
              </div>
            </div>
          ) : (
            <>
              {filteredCategories.map((category) => renderCategory(category))}

              {orphanedArticles.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-xs font-medium text-gray-500 mb-2 px-2">Uncategorized</div>
                  {orphanedArticles.map((article) => (
                    <div
                      key={article.id}
                      className={`flex items-center gap-2 py-2 px-2 cursor-pointer hover:bg-gray-50 rounded-md transition-colors ${
                        selectedArticleId === article.id ? "bg-blue-50 border-r-2 border-blue-500" : ""
                      }`}
                      onClick={() => onArticleSelect(article.id)}
                    >
                      <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm truncate flex-1">{article.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
