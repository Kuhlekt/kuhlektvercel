"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, Tag, FileText, ImageIcon } from "lucide-react"
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

  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = htmlContent

  // Get clean text content
  let text = tempDiv.textContent || tempDiv.innerText || ""

  // Clean up whitespace
  text = text.replace(/\s+/g, " ").trim()

  return text
}

// Helper function to create preview text with search highlighting context
const createPreview = (content: string, query: string, maxLength = 200): string => {
  const cleanText = extractCleanText(content)

  if (!cleanText) return "No content available"

  if (!query.trim()) {
    return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + "..." : cleanText
  }

  const searchTerm = query.toLowerCase()
  const lowerContent = cleanText.toLowerCase()
  const index = lowerContent.indexOf(searchTerm)

  if (index === -1) {
    // Query not found in content, return beginning
    return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + "..." : cleanText
  }

  // Show context around the found term
  const start = Math.max(0, index - 50)
  const end = Math.min(cleanText.length, start + maxLength)

  let preview = cleanText.substring(start, end)

  if (start > 0) preview = "..." + preview
  if (end < cleanText.length) preview = preview + "..."

  return preview
}

// Helper function to check if content has images
const hasImages = (htmlContent: string): boolean => {
  if (!htmlContent) return false
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = htmlContent
  return tempDiv.querySelectorAll("img").length > 0
}

// Helper function to highlight search terms in text
const highlightSearchTerm = (text: string, query: string): JSX.Element => {
  if (!query.trim()) {
    return <span>{text}</span>
  }

  const searchTerm = query.toLowerCase()
  const lowerText = text.toLowerCase()
  const index = lowerText.indexOf(searchTerm)

  if (index === -1) {
    return <span>{text}</span>
  }

  const before = text.substring(0, index)
  const match = text.substring(index, index + query.length)
  const after = text.substring(index + query.length)

  return (
    <span>
      {before}
      <mark className="bg-yellow-200 px-1 rounded">{match}</mark>
      {highlightSearchTerm(after, query)}
    </span>
  )
}

export function SearchResults({ results, categories, query, onArticleSelect }: SearchResultsProps) {
  // Get category and subcategory info for an article
  const getArticleLocation = (article: Article) => {
    const category = categories.find((c) => c.id === article.categoryId)
    const subcategory = category?.subcategories.find((s) => s.id === article.subcategoryId)

    return {
      categoryName: category?.name || "Unknown Category",
      subcategoryName: subcategory?.name,
    }
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
        <p className="text-gray-600">
          No articles found matching "{query}". Try different keywords or check your spelling.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Search Results for "{query}"</h2>
        <p className="text-gray-600">
          Found {results.length} article{results.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {results.map((article) => {
            const location = getArticleLocation(article)
            const preview = createPreview(article.content, query)
            const articleHasImages = hasImages(article.content)

            return (
              <Card
                key={article.id}
                className="cursor-pointer hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500"
                onClick={() => onArticleSelect(article)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
                        {highlightSearchTerm(article.title, query)}
                      </h3>

                      {/* Article metadata */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{article.updatedAt.toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{article.createdBy}</span>
                        </div>

                        {articleHasImages && (
                          <div className="flex items-center space-x-1 text-blue-600">
                            <ImageIcon className="h-4 w-4" />
                            <span>Has images</span>
                          </div>
                        )}
                      </div>

                      {/* Category breadcrumb */}
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                        <span>{location.categoryName}</span>
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
                  <div className="text-gray-700 mb-4 leading-relaxed">{highlightSearchTerm(preview, query)}</div>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <div className="flex flex-wrap gap-2">
                        {article.tags.slice(0, 5).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {highlightSearchTerm(tag, query)}
                          </Badge>
                        ))}
                        {article.tags.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.tags.length - 5} more
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
