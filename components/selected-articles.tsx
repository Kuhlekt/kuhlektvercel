"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, Tag, FileText, ImageIcon, BookOpen } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface SelectedArticlesProps {
  categories: Category[]
  selectedCategories: Set<string>
  selectedSubcategories: Set<string>
  onArticleSelect: (article: Article) => void
  navigationTitle: string
}

// Helper function to clean HTML and extract readable text
const extractCleanText = (htmlContent: string): string => {
  if (!htmlContent) return ""

  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = htmlContent

  // Get clean text content
  let text = tempDiv.textContent || tempDiv.innerText || ""

  // Clean up whitespace and normalize
  text = text.replace(/\s+/g, " ").trim()

  return text
}

// Helper function to create article preview
const createPreview = (content: string, maxLength = 150): string => {
  const cleanText = extractCleanText(content)

  if (!cleanText) return "No content available"

  if (cleanText.length <= maxLength) return cleanText

  // Find a good breaking point near the max length
  const truncated = cleanText.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")

  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + "..."
  }

  return truncated + "..."
}

// Helper function to check if content has images
const hasImages = (htmlContent: string): boolean => {
  if (!htmlContent) return false
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = htmlContent
  return tempDiv.querySelectorAll("img").length > 0
}

export function SelectedArticles({
  categories,
  selectedCategories,
  selectedSubcategories,
  onArticleSelect,
  navigationTitle,
}: SelectedArticlesProps) {
  // Get filtered articles based on selected categories and subcategories
  const getFilteredArticles = (): Article[] => {
    const articles: Article[] = []

    categories.forEach((category) => {
      // If no categories are selected, show all articles
      const showAllCategories = selectedCategories.size === 0 && selectedSubcategories.size === 0
      const categorySelected = selectedCategories.has(category.id)

      // Add category articles
      if (showAllCategories || categorySelected) {
        if (Array.isArray(category.articles)) {
          articles.push(...category.articles)
        }
      }

      // Add subcategory articles
      if (Array.isArray(category.subcategories)) {
        category.subcategories.forEach((subcategory) => {
          const subcategorySelected = selectedSubcategories.has(subcategory.id)

          if (showAllCategories || categorySelected || subcategorySelected) {
            if (Array.isArray(subcategory.articles)) {
              articles.push(...subcategory.articles)
            }
          }
        })
      }
    })

    // Remove duplicates and sort by updated date (newest first)
    const uniqueArticles = articles.filter(
      (article, index, self) => index === self.findIndex((a) => a.id === article.id),
    )

    return uniqueArticles.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }

  // Get category and subcategory info for an article
  const getArticleLocation = (article: Article) => {
    const category = categories.find((c) => c.id === article.categoryId)
    const subcategory = category?.subcategories.find((s) => s.id === article.subcategoryId)

    return {
      categoryName: category?.name || "Unknown Category",
      subcategoryName: subcategory?.name,
    }
  }

  const filteredArticles = getFilteredArticles()

  if (filteredArticles.length === 0) {
    const hasFilters = selectedCategories.size > 0 || selectedSubcategories.size > 0

    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {hasFilters ? "No Articles Found" : "No Articles Available"}
        </h3>
        <p className="text-gray-600">
          {hasFilters
            ? "No articles match your current filter selection. Try selecting different categories."
            : "There are no articles in the knowledge base yet."}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{navigationTitle}</h2>
        <p className="text-gray-600">
          {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="p-6">
        <div className="grid gap-6">
          {filteredArticles.map((article) => {
            const location = getArticleLocation(article)
            const preview = createPreview(article.content)
            const articleHasImages = hasImages(article.content)

            return (
              <Card
                key={article.id}
                className="cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500 hover:border-l-blue-600"
                onClick={() => onArticleSelect(article)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>

                      {/* Article metadata */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {article.updatedAt.getTime() !== article.createdAt.getTime()
                              ? `Updated ${article.updatedAt.toLocaleDateString()}`
                              : `Created ${article.createdAt.toLocaleDateString()}`}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{article.createdBy}</span>
                        </div>

                        {articleHasImages && (
                          <div className="flex items-center space-x-1 text-blue-600">
                            <ImageIcon className="h-4 w-4" />
                            <span>Contains images</span>
                          </div>
                        )}

                        {article.editCount && article.editCount > 0 && (
                          <div className="flex items-center space-x-1 text-orange-600">
                            <FileText className="h-4 w-4" />
                            <span>
                              {article.editCount} edit{article.editCount !== 1 ? "s" : ""}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Category breadcrumb */}
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                        <span className="font-medium">{location.categoryName}</span>
                        {location.subcategoryName && (
                          <>
                            <span>›</span>
                            <span>{location.subcategoryName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Article preview */}
                  <div className="text-gray-700 mb-4 leading-relaxed font-serif">{preview}</div>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <div className="flex flex-wrap gap-2">
                        {article.tags.slice(0, 6).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 6 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.tags.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
