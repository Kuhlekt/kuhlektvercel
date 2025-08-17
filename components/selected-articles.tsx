"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Tag, FileText } from "lucide-react"
import type { Category, Article } from "../types/knowledge-base"

interface SelectedArticlesProps {
  categories: Category[]
  selectedCategories: Set<string>
  selectedSubcategories: Set<string>
  onArticleSelect: (article: Article) => void
  navigationTitle?: string
}

export function SelectedArticles({
  categories,
  selectedCategories,
  selectedSubcategories,
  onArticleSelect,
  navigationTitle = "All Articles",
}: SelectedArticlesProps) {
  // Get filtered articles based on selected categories and subcategories
  const getFilteredArticles = (): Article[] => {
    const articles: Article[] = []

    categories.forEach((category) => {
      // If no categories are selected, show all articles
      const showAllCategories = selectedCategories.size === 0 && selectedSubcategories.size === 0

      // Include articles from selected categories
      if (showAllCategories || selectedCategories.has(category.id)) {
        if (Array.isArray(category.articles)) {
          articles.push(...category.articles)
        }
      }

      // Include articles from selected subcategories
      if (Array.isArray(category.subcategories)) {
        category.subcategories.forEach((subcategory) => {
          if (showAllCategories || selectedSubcategories.has(subcategory.id)) {
            if (Array.isArray(subcategory.articles)) {
              articles.push(...subcategory.articles)
            }
          }
        })
      }
    })

    // Sort by creation date (newest first)
    return articles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  const filteredArticles = getFilteredArticles()

  // Get category name for an article
  const getCategoryName = (article: Article) => {
    const category = categories.find((c) => c.id === article.categoryId)
    if (!category) return "Unknown"

    if (article.subcategoryId) {
      const subcategory = category.subcategories.find((s) => s.id === article.subcategoryId)
      return `${category.name} → ${subcategory?.name || "Unknown"}`
    }

    return category.name
  }

  if (filteredArticles.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Articles Found</h3>
          <p className="text-gray-600">
            {selectedCategories.size > 0 || selectedSubcategories.size > 0
              ? "No articles match your selected filters."
              : "No articles available in the knowledge base."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{navigationTitle}</h2>
          <p className="text-gray-600 mt-1">
            {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid gap-6">
        {filteredArticles.map((article) => (
          <Card
            key={article.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onArticleSelect(article)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2 hover:text-blue-600 transition-colors">{article.title}</CardTitle>

                  {/* Article Preview */}
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {article.content.replace(/https?:\/\/[^\s]+/g, "").substring(0, 150)}
                    {article.content.length > 150 ? "..." : ""}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{article.createdAt.toLocaleDateString()}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{article.createdBy}</span>
                </div>

                <Badge variant="outline" className="text-xs">
                  {getCategoryName(article)}
                </Badge>

                {article.editCount && article.editCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    Edit #{article.editCount}
                  </Badge>
                )}
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex items-center space-x-2 mt-2">
                  <Tag className="h-3 w-3 text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {article.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>{/* Additional content can be added here if needed */}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
