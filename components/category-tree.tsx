"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, Plus } from "lucide-react"
import type { Category, Article, User } from "../types/knowledge-base"

interface CategoryTreeProps {
  categories: Category[]
  articles: Article[]
  selectedArticleId?: string
  onArticleSelect: (article: Article) => void
  onAddCategory?: () => void
  onAddArticle?: () => void
  currentUser: User | null
}

export function CategoryTree({
  categories,
  articles,
  selectedArticleId,
  onArticleSelect,
  onAddCategory,
  onAddArticle,
  currentUser,
}: CategoryTreeProps) {
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

  const getCategoryArticles = (categoryId: string) => {
    return articles.filter((article) => article.categoryId === categoryId)
  }

  const getSubcategories = (parentId?: string) => {
    return categories.filter((cat) => cat.parentId === parentId)
  }

  const canAddContent = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")

  const renderCategory = (category: Category, level = 0) => {
    const subcategories = getSubcategories(category.id)
    const categoryArticles = getCategoryArticles(category.id)
    const isExpanded = expandedCategories.has(category.id)
    const hasChildren = subcategories.length > 0 || categoryArticles.length > 0

    return (
      <div key={category.id} className="select-none">
        <div
          className={`flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer rounded ${
            level > 0 ? `ml-${level * 4}` : ""
          }`}
          onClick={() => hasChildren && toggleCategory(category.id)}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )
          ) : (
            <div className="w-4" />
          )}
          {isExpanded ? <FolderOpen className="h-4 w-4 text-blue-500" /> : <Folder className="h-4 w-4 text-blue-500" />}
          <span className="font-medium text-gray-700">{category.name}</span>
          {categoryArticles.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {categoryArticles.length}
            </Badge>
          )}
        </div>

        {isExpanded && (
          <div>
            {/* Render subcategories */}
            {subcategories.map((subcat) => renderCategory(subcat, level + 1))}

            {/* Render articles */}
            {categoryArticles.map((article) => (
              <div
                key={article.id}
                className={`flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer rounded ${
                  selectedArticleId === article.id ? "bg-blue-50 border-l-2 border-blue-500" : ""
                }`}
                onClick={() => onArticleSelect(article)}
                style={{ paddingLeft: `${(level + 1) * 16 + 8}px` }}
              >
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 truncate flex-1">{article.title}</span>
                <Badge variant={article.status === "published" ? "default" : "secondary"} className="text-xs">
                  {article.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const rootCategories = getSubcategories()

  return (
    <div className="w-80 border-r bg-white flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-gray-900">Knowledge Base</h2>
        {canAddContent && (
          <div className="flex space-x-2 mt-2">
            {onAddCategory && (
              <Button onClick={onAddCategory} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Category
              </Button>
            )}
            {onAddArticle && (
              <Button onClick={onAddArticle} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Article
              </Button>
            )}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {rootCategories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No categories yet</p>
              {canAddContent && <p className="text-xs mt-1">Create your first category to get started</p>}
            </div>
          ) : (
            rootCategories.map((category) => renderCategory(category))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
