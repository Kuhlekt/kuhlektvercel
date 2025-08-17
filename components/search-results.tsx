"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Tag, Camera } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface SearchResultsProps {
  results: Article[]
  categories: Category[]
  query: string
  onArticleSelect: (article: Article) => void
}

// Function to extract clean text content for preview
function extractCleanText(html: string): string {
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = html

  // Remove script and style elements
  const scripts = tempDiv.querySelectorAll("script, style")
  scripts.forEach((el) => el.remove())

  // Get text content
  let text = tempDiv.textContent || tempDiv.innerText || ""

  // Clean up whitespace and normalize
  text = text
    .replace(/\s+/g, " ") // Multiple spaces to single space
    .replace(/\n+/g, " ") // Newlines to spaces
    .trim()

  // Create a meaningful preview
  if (text.length > 200) {
    // Find a good breaking point near 200 characters
    const breakPoint = text.lastIndexOf(" ", 200)
    text = text.substring(0, breakPoint > 150 ? breakPoint : 200) + "..."
  }

  return text || "No preview available"
}

// Function to check if content contains images
function hasImages(content: string): boolean {
  return (
    content.includes("<img") ||
    content.includes("data:image/") ||
    content.includes("[IMAGE:") ||
    content.match(/https?:\/\/[^\s"')]+\.(jpg|jpeg|png|gif|webp|svg)/i) !== null
  )
}

// Function to extract and display first image as thumbnail
function getFirstImageThumbnail(content: string): string | null {
  // Look for img tags first
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"[^>]*>/i)
  if (imgMatch) {
    return imgMatch[1]
  }

  // Look for data URLs
  const dataUrlMatch = content.match(/(data:image\/[^;]+;base64,[^\s"'<>]+)/i)
  if (dataUrlMatch) {
    return dataUrlMatch[1]
  }

  // Look for regular image URLs
  const urlMatch = content.match(/(https?:\/\/[^\s"')]+\.(jpg|jpeg|png|gif|webp|svg))/i)
  if (urlMatch) {
    return urlMatch[1]
  }

  return null
}

export function SearchResults({ results, categories, query, onArticleSelect }: SearchResultsProps) {
  const getCategoryInfo = (categoryId: string, subcategoryId?: string) => {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return { categoryName: "Unknown", subcategoryName: undefined }

    if (subcategoryId) {
      const subcategory = category.subcategories.find((s) => s.id === subcategoryId)
      return {
        categoryName: category.name,
        subcategoryName: subcategory?.name || "Unknown",
      }
    }

    return { categoryName: category.name, subcategoryName: undefined }
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-gray-500">
          <p className="text-lg mb-2">No results found for "{query}"</p>
          <p className="text-sm">Try different keywords or browse categories</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-semibold mb-2">Search Results ({results.length})</h2>
        <p className="text-gray-600">
          Found {results.length} article{results.length !== 1 ? "s" : ""} matching "{query}"
        </p>
      </div>

      <div className="space-y-4">
        {results.map((article) => {
          const { categoryName, subcategoryName } = getCategoryInfo(article.categoryId, article.subcategoryId)
          const cleanPreview = extractCleanText(article.content)
          const containsImages = hasImages(article.content)
          const thumbnailSrc = getFirstImageThumbnail(article.content)

          return (
            <Card
              key={`${article.id}-${article.updatedAt.getTime()}`}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onArticleSelect(article)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{highlightText(article.title, query)}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{categoryName}</span>
                      {subcategoryName && (
                        <>
                          <span>•</span>
                          <span>{subcategoryName}</span>
                        </>
                      )}
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{article.updatedAt.toLocaleDateString()}</span>
                      </div>
                      {containsImages && (
                        <>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Camera className="h-3 w-3" />
                            <span>Images</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail */}
                  {thumbnailSrc && (
                    <div className="ml-4 flex-shrink-0">
                      <img
                        src={thumbnailSrc || "/placeholder.svg"}
                        alt="Article thumbnail"
                        className="w-16 h-16 object-cover rounded-lg border"
                        onError={(e) => {
                          // Hide image if it fails to load
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {cleanPreview && (
                  <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {highlightText(cleanPreview, query)}
                  </CardDescription>
                )}
                {article.tags.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Tag className="h-3 w-3 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {highlightText(tag, query)}
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
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
