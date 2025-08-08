"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Tag, Folder } from 'lucide-react'
import type { Article, Category } from "../types/knowledge-base"

interface SearchResultsProps {
  results: Article[]
  categories: Category[]
  query: string
  onArticleSelect: (article: Article) => void
}

// Function to extract clean text from HTML content
function extractCleanText(htmlContent: string): string {
  if (!htmlContent) return ""
  
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlContent
  
  // Remove script and style elements
  const scripts = tempDiv.querySelectorAll('script, style')
  scripts.forEach(el => el.remove())
  
  // Get text content
  const textContent = tempDiv.textContent || tempDiv.innerText || ""
  
  // Clean up whitespace and get first few sentences
  const cleanText = textContent
    .replace(/\s+/g, ' ')
    .trim()
    .split('.')
    .filter(sentence => sentence.trim().length > 10)
    .slice(0, 3)
    .join('. ')
  
  return cleanText.length > 200 ? cleanText.substring(0, 200) + '...' : cleanText
}

export function SearchResults({ results, categories, query, onArticleSelect }: SearchResultsProps) {
  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || "Unknown"
  }

  const getSubcategoryName = (categoryId: string, subcategoryId?: string) => {
    if (!subcategoryId) return null
    const category = categories.find(c => c.id === categoryId)
    return category?.subcategories.find(s => s.id === subcategoryId)?.name
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No articles found for "{query}"</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Search Results for "{query}" ({results.length})
        </h2>
      </div>

      <div className="space-y-4">
        {results.map((article) => {
          const categoryName = getCategoryName(article.categoryId)
          const subcategoryName = getSubcategoryName(article.categoryId, article.subcategoryId)
          const cleanContent = extractCleanText(article.content)

          return (
            <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6" onClick={() => onArticleSelect(article)}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                      {article.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 ml-4">
                      <Clock className="h-4 w-4 mr-1" />
                      {article.updatedAt.toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Folder className="h-4 w-4 text-gray-400" />
                    <Badge variant="secondary">{categoryName}</Badge>
                    {subcategoryName && (
                      <Badge variant="outline">{subcategoryName}</Badge>
                    )}
                  </div>

                  {cleanContent && (
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {cleanContent}
                    </p>
                  )}

                  {article.tags.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <div className="flex flex-wrap gap-1">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
