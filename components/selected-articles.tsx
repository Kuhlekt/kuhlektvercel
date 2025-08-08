"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, Tag, Folder, BookOpen } from 'lucide-react'
import type { Article, Category } from "../types/knowledge-base"

interface SelectedArticlesProps {
  categories: Category[]
  selectedCategories: Set<string>
  selectedSubcategories: Set<string>
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

export function SelectedArticles({
  categories,
  selectedCategories,
  selectedSubcategories,
  onArticleSelect,
}: SelectedArticlesProps) {
  // Get filtered articles based on selected categories and subcategories
  const getFilteredArticles = (): { articles: Article[], categoryPath: string }[] => {
    const results: { articles: Article[], categoryPath: string }[] = []

    categories.forEach((category) => {
      const isCategorySelected = selectedCategories.has(category.id)
      
      // If category is selected, include all its articles
      if (isCategorySelected) {
        if (category.articles.length > 0) {
          results.push({
            articles: category.articles,
            categoryPath: category.name
          })
        }
        
        // Also include all subcategory articles
        category.subcategories.forEach((subcategory) => {
          if (subcategory.articles.length > 0) {
            results.push({
              articles: subcategory.articles,
              categoryPath: `${category.name} > ${subcategory.name}`
            })
          }
        })
      } else {
        // Check for selected subcategories
        category.subcategories.forEach((subcategory) => {
          if (selectedSubcategories.has(subcategory.id) && subcategory.articles.length > 0) {
            results.push({
              articles: subcategory.articles,
              categoryPath: `${category.name} > ${subcategory.name}`
            })
          }
        })
      }
    })

    return results
  }

  const filteredResults = getFilteredArticles()
  const totalArticles = filteredResults.reduce((sum, result) => sum + result.articles.length, 0)

  // If no categories are selected, show all articles
  if (selectedCategories.size === 0 && selectedSubcategories.size === 0) {
    const allArticles: { articles: Article[], categoryPath: string }[] = []
    
    categories.forEach((category) => {
      if (category.articles.length > 0) {
        allArticles.push({
          articles: category.articles,
          categoryPath: category.name
        })
      }
      
      category.subcategories.forEach((subcategory) => {
        if (subcategory.articles.length > 0) {
          allArticles.push({
            articles: subcategory.articles,
            categoryPath: `${category.name} > ${subcategory.name}`
          })
        }
      })
    })

    const totalAllArticles = allArticles.reduce((sum, result) => sum + result.articles.length, 0)

    return (
      <div className="space-y-6">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Browse All Articles</h2>
          <p className="text-gray-600 mb-4">
            Explore our complete knowledge base with {totalAllArticles} articles across {categories.length} categories.
          </p>
          <Badge variant="secondary" className="text-sm">
            {totalAllArticles} articles available
          </Badge>
        </div>

        <div className="space-y-6">
          {allArticles.map((result, index) => (
            <div key={index}>
              <div className="flex items-center space-x-2 mb-4">
                <Folder className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">{result.categoryPath}</h3>
                <Badge variant="outline">{result.articles.length} articles</Badge>
              </div>
              
              <div className="grid gap-4">
                {result.articles.map((article) => {
                  const cleanPreview = extractCleanText(article.content)
                  
                  return (
                    <Card key={article.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg hover:text-blue-600 transition-colors cursor-pointer">
                          {article.title}
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{article.createdAt.toLocaleDateString()}</span>
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
          ))}
        </div>
      </div>
    )
  }

  // Show filtered results
  if (filteredResults.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">
            No articles found in the selected categories. Try selecting different categories.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Filtered Articles</h2>
        <Badge variant="secondary">
          {totalArticles} article{totalArticles !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-6">
        {filteredResults.map((result, index) => (
          <div key={index}>
            <div className="flex items-center space-x-2 mb-4">
              <Folder className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">{result.categoryPath}</h3>
              <Badge variant="outline">{result.articles.length} articles</Badge>
            </div>
            
            <div className="grid gap-4">
              {result.articles.map((article) => {
                const cleanPreview = extractCleanText(article.content)
                
                return (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg hover:text-blue-600 transition-colors cursor-pointer">
                        {article.title}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{article.createdAt.toLocaleDateString()}</span>
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
        ))}
      </div>
    </div>
  )
}
