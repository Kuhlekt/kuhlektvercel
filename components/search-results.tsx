"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, Tag, Folder } from 'lucide-react'
import type { Article, Category } from "../types/knowledge-base"

interface SearchResultsProps {
  results: Article[]
  categories: Category[]
  query: string
  onArticleSelect: (article: Article) => void
}

// Helper function to extract clean text from HTML content
const extractCleanText = (htmlContent: string): string => {
  if (!htmlContent) return ""
  
  try {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent
    
    // Remove script and style elements
    const scripts = tempDiv.querySelectorAll('script, style')
    scripts.forEach(el => el.remove())
    
    // Get clean text content
    const textContent = tempDiv.textContent || tempDiv.innerText || ""
    
    // Split into sentences and filter out very short ones
    const sentences = textContent
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 10 && !/^\d+$/.test(s)) // Remove very short sentences and numbers-only
    
    // Return first 2-3 sentences, max 200 characters
    const preview = sentences.slice(0, 3).join('. ')
    return preview.length > 200 ? preview.substring(0, 200) + '...' : preview + (preview ? '.' : '')
  } catch (error) {
    // Fallback: simple text extraction
    return htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 200) + '...'
  }
}

const getCategoryPath = (article: Article, categories: Category[]): string => {
  for (const category of categories) {
    // Check if article is in main category
    if (category.articles.some(a => a.id === article.id)) {
      return category.name
    }
    
    // Check if article is in subcategory
    for (const subcategory of category.subcategories) {
      if (subcategory.articles.some(a => a.id === article.id)) {
        return `${category.name} > ${subcategory.name}`
      }
    }
  }
  return "Unknown"
}

export function SearchResults({ results, categories, query, onArticleSelect }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">
            No articles found for "{query}". Try different keywords or browse categories.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Search Results for "{query}"
        </h2>
        <Badge variant="secondary">
          {results.length} result{results.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-4">
        {results.map((article) => {
          const categoryPath = getCategoryPath(article, categories)
          const cleanPreview = extractCleanText(article.content)
          
          return (
            <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 hover:text-blue-600 transition-colors">
                      {article.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Folder className="h-4 w-4" />
                        <span>{categoryPath}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{article.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {cleanPreview || "No preview available"}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {article.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onArticleSelect(article)}
                  >
                    Read Article
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
