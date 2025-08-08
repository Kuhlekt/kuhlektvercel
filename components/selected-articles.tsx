"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Tag, Folder } from 'lucide-react'
import type { Article, Category } from "../types/knowledge-base"

interface SelectedArticlesProps {
  categories: Category[]
  selectedCategories: Set<string>
  selectedSubcategories: Set<string>
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
    .slice(0, 2)
    .join('. ')
  
  return cleanText.length > 150 ? cleanText.substring(0, 150) + '...' : cleanText
}

export function SelectedArticles({ 
  categories, 
  selectedCategories, 
  selectedSubcategories, 
  onArticleSelect 
}: SelectedArticlesProps) {
  // Get filtered articles based on selected categories and subcategories
  const getFilteredArticles = () => {
    const articles: Article[] = []

    categories.forEach((category) => {
      // If category is selected, include its articles
      if (selectedCategories.has(category.id)) {
        articles.push(...category.articles)
      }

      // Check subcategories
      category.subcategories.forEach((subcategory) => {
        if (selectedSubcategories.has(subcategory.id)) {
          articles.push(...subcategory.articles)
        }
      })
    })

    // Remove duplicates and sort by updated date
    const uniqueArticles = articles.filter((article, index, self) => 
      index === self.findIndex(a => a.id === article.id)
    )

    return uniqueArticles.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }

  // Get all articles if no filters are selected
  const getAllArticles = () => {
    const articles: Article[] = []

    categories.forEach((category) => {
      articles.push(...category.articles)
      category.subcategories.forEach((subcategory) => {
        articles.push(...subcategory.articles)
      })
    })

    return articles.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }

  const hasFilters = selectedCategories.size > 0 || selectedSubcategories.size > 0
  const articlesToShow = hasFilters ? getFilteredArticles() : getAllArticles()

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || "Unknown"
  }

  const getSubcategoryName = (categoryId: string, subcategoryId?: string) => {
    if (!subcategoryId) return null
    const category = categories.find(c => c.id === categoryId)
    return category?.subcategories.find(s => s.id === subcategoryId)?.name
  }

  if (articlesToShow.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {hasFilters ? "No articles found in selected categories" : "No articles available"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {hasFilters ? "Filtered Articles" : "All Articles"} ({articlesToShow.length})
        </h2>
      </div>

      <div className="space-y-4">
        {articlesToShow.map((article) => {
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
