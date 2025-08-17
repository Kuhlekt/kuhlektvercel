"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, FileText, ImageIcon, Calendar, User } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface SearchResultsProps {
  results: Article[]
  categories: Category[]
  query: string
  onArticleSelect: (article: Article) => void
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

// Helper function to create preview with highlighted search terms
const createPreview = (content: string, query: string, maxLength = 200): string => {
  const cleanText = extractCleanText(content)
  if (!cleanText) return "No content available"

  const queryLower = query.toLowerCase()
  const textLower = cleanText.toLowerCase()

  // Find the position of the search term
  const queryIndex = textLower.indexOf(queryLower)

  if (queryIndex === -1) {
    // If query not found, return beginning of content
    return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + "..." : cleanText
  }

  // Calculate start position to center the query term
  const start = Math.max(0, queryIndex - Math.floor(maxLength / 2))
  const end = Math.min(cleanText.length, start + maxLength)

  let preview = cleanText.substring(start, end)

  // Add ellipsis if needed
  if (start > 0) preview = "..." + preview
  if (end < cleanText.length) preview = preview + "..."

  return preview
}

// Helper function to check if content has images
const hasImages = (content: string): boolean => {
  if (!content) return false

  const imgRegex = /<img[^>]*>/i
  const urlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg))/i
  const dataUrlRegex = /data:image\/[^;]+;base64,/i

  return imgRegex.test(content) || urlRegex.test(content) || dataUrlRegex.test(content)
}

export function SearchResults({ results, categories, query, onArticleSelect }: SearchResultsProps) {
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

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Search className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600 text-center">
            No articles found matching "{query}". Try different keywords or check your spelling.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Search Results for "{query}"</h2>
        <Badge variant="secondary" className="text-sm">
          {results.length} result{results.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="space-y-4">
        {results.map((article) => {
          const preview = createPreview(article.content, query)
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
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
