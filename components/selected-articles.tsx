"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, ImageIcon, Calendar, User, FolderOpen } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface SelectedArticlesProps {
  categories: Category[]
  selectedCategories: Set<string>
  selectedSubcategories: Set<string>
  onArticleSelect: (article: Article) => void
  navigationTitle: string
}

// Helper function to clean HTML and extract text
const extractCleanText = (htmlContent: string): string => {
  if (!htmlContent) return ""

  // Remove HTML tags and clean up text
  const cleanText = htmlContent
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/<style[^>]*>.*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()

  return cleanText
}

// Helper function to create preview text
const createPreview = (content: string, maxLength = 150): string => {
  const cleanText = extractCleanText(content)
  if (!cleanText) return "No content available"

  if (cleanText.length <= maxLength) return cleanText

  // Find the last complete word within the limit
  const truncated = cleanText.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(" ")

  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + "..."
  }

  return truncated + "..."
}

// Helper function to check if content has images
const hasImages = (content: string): boolean => {
  if (!content) return false

  const imgRegex = /<img[^>]*>/i
  const urlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg))/i
  const dataUrlRegex = /data:image\/[^;]+;base64,/i

  return imgRegex.test(content) || urlRegex.test(content) || dataUrlRegex.test(content)
}

export function SelectedArticles({
  categories,
  selectedCategories,
  selectedSubcategories,
  onArticleSelect,
  navigationTitle,
}: SelectedArticlesProps) {
  // Get all articles based on selected categories and subcategories
  const getFilteredArticles = (): Article[] => {
    const articles: Article[] = []

    categories.forEach((category) => {
      // If no categories are selected, show all articles
      const showAllCategories = selectedCategories.size === 0 && selectedSubcategories.size === 0
      const categorySelected = selectedCategories.has(category.id)

      if (showAllCategories || categorySelected) {
        // Add category articles
        articles.push(...category.articles)
      }

      // Check subcategories
      category.subcategories.forEach((subcategory) => {
        const subcategorySelected = selectedSubcategories.has(subcategory.id)

        if (showAllCategories || categorySelected || subcategorySelected) {
          // Add subcategory articles
          articles.push(...subcategory.articles)
        }
      })
    })

    // Remove duplicates and sort by updated date (most recent first)
    const uniqueArticles = articles.filter(
      (article, index, self) => index === self.findIndex((a) => a.id === article.id),
    )

    return uniqueArticles.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  // Get category name helper
  const getCategoryName = (categoryId: string, subcategoryId?: string) => {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return "Unknown Category"

    if (subcategoryId) {
      const subcategory = category.subcategories.find((s) => s.id === subcategoryId)
      return `${category.name} › ${subcategory?.name || "Unknown Subcategory"}`
    }

    return category.name
  }

  const filteredArticles = getFilteredArticles()

  if (filteredArticles.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600 text-center">
            {selectedCategories.size > 0 || selectedSubcategories.size > 0
              ? "No articles found in the selected categories."
              : "No articles available in the knowledge base."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{navigationTitle}</h2>
        <Badge variant="secondary" className="text-sm">
          {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="grid gap-4">
        {filteredArticles.map((article) => {
          const preview = createPreview(article.content)
          const categoryName = getCategoryName(article.categoryId, article.subcategoryId)
          const articleHasImages = hasImages(article.content)

          return (
            <Card
              key={article.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onArticleSelect(article)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg hover:text-blue-600 transition-colors">{article.title}</CardTitle>
                  <div className="flex items-center space-x-2 ml-4">
                    <FileText className="h-4 w-4 text-gray-400" />
                    {articleHasImages && <ImageIcon className="h-4 w-4 text-gray-400" />}
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="text-blue-600 font-medium">{categoryName}</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{article.createdAt.toLocaleDateString()}</span>
                  </div>
                  {article.updatedAt.getTime() !== article.createdAt.getTime() && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Updated {article.updatedAt.toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{article.createdBy}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-gray-700 text-sm leading-relaxed mb-3">{preview}</p>

                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 4).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {article.tags.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.tags.length - 4} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
