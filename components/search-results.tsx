"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageIcon } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface SearchResultsProps {
  results: Article[]
  categories: Category[]
  query: string
  onArticleSelect: (article: Article) => void
}

export function SearchResults({ results, categories, query, onArticleSelect }: SearchResultsProps) {
  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || "Unknown"
  }

  const getSubcategoryName = (categoryId: string, subcategoryId?: string) => {
    if (!subcategoryId) return null
    const category = categories.find((cat) => cat.id === categoryId)
    return category?.subcategories.find((sub) => sub.id === subcategoryId)?.name
  }

  // Function to extract text content and check for images - simplified
  const getContentPreview = (content: string) => {
    const hasImages = content.includes("data:image") || /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)/i.test(content)

    // Remove image data URLs and URLs from preview text
    const textContent = content
      .replace(/data:image[^"'\s]+/g, "[IMAGE]")
      .replace(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)/gi, "[IMAGE]")
      .trim()

    const preview = textContent.substring(0, 200)

    return {
      preview: preview + (textContent.length > 200 ? "..." : ""),
      hasImages,
    }
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No articles found for "{query}"</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Search Results for "{query}" ({results.length} found)
      </h2>

      {results.map((article) => {
        const subcategoryName = getSubcategoryName(article.categoryId, article.subcategoryId)
        const { preview, hasImages } = getContentPreview(article.content)

        return (
          <Card
            key={article.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onArticleSelect(article)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  {hasImages && <ImageIcon className="h-4 w-4 text-gray-400" title="Contains images" />}
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary">{getCategoryName(article.categoryId)}</Badge>
                  {subcategoryName && <Badge variant="outline">{subcategoryName}</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 line-clamp-3">{preview}</p>
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
