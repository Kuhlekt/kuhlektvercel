"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Tag, Camera } from 'lucide-react'
import type { Article, Category } from "../types/knowledge-base"

interface SearchResultsProps {
  results: Article[]
  categories: Category[]
  query: string
  onArticleSelect: (article: Article) => void
}

// Function to extract clean text content from HTML
function extractCleanText(html: string): string {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, ' ')

  // Remove CSS styles and parameters
  text = text.replace(/style\s*=\s*["'][^"']*["']/gi, '')
  text = text.replace(/class\s*=\s*["'][^"']*["']/gi, '')

  // Remove data URLs and image URLs
  text = text.replace(/data:image\/[^;]+;base64,[^\s"')]+/gi, '')
  text = text.replace(/https?:\/\/[^\s"')]+\.(jpg|jpeg|png|gif|webp)/gi, '')

  // Remove extra whitespace and normalize
  text = text.replace(/\s+/g, ' ').trim()

  // Split into sentences and filter meaningful ones
  const sentences = text.split(/[.!?]+/).filter(sentence => {
    const cleaned = sentence.trim()
    return cleaned.length > 20 && 
           !cleaned.match(/^(width|height|margin|padding|color|font|background)/i) &&
           !cleaned.match(/^\d+px/) &&
           !cleaned.match(/^(rgb|rgba|hex|#)/i)
  })

  // Return first few meaningful sentences
  return sentences.slice(0, 2).join('. ').trim()
}

// Function to check if content contains images
function hasImages(content: string): boolean {
  return content.includes('<img') || 
         content.includes('data:image/') || 
         content.match(/https?:\/\/[^\s"')]+\.(jpg|jpeg|png|gif|webp)/i) !== null
}

export function SearchResults({ results, categories, query, onArticleSelect }: SearchResultsProps) {
  const getCategoryInfo = (categoryId: string, subcategoryId?: string) => {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return { categoryName: "Unknown", subcategoryName: undefined }
    
    if (subcategoryId) {
      const subcategory = category.subcategories.find(s => s.id === subcategoryId)
      return {
        categoryName: category.name,
        subcategoryName: subcategory?.name || "Unknown"
      }
    }
    
    return { categoryName: category.name, subcategoryName: undefined }
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
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
        <h2 className="text-xl font-semibold mb-2">
          Search Results ({results.length})
        </h2>
        <p className="text-gray-600">
          Found {results.length} article{results.length !== 1 ? 's' : ''} matching "{query}"
        </p>
      </div>

      <div className="space-y-4">
        {results.map((article) => {
          const { categoryName, subcategoryName } = getCategoryInfo(
            article.categoryId,
            article.subcategoryId
          )
          const cleanPreview = extractCleanText(article.content)
          const containsImages = hasImages(article.content)

          return (
            <Card 
              key={article.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onArticleSelect(article)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      {highlightText(article.title, query)}
                    </CardTitle>
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
