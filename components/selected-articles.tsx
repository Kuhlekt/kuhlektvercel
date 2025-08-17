"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Tag, FolderOpen, FileText } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface SelectedArticlesProps {
  categories: Category[]
  selectedCategories: Set<string>
  selectedSubcategories: Set<string>
  onArticleSelect: (article: Article) => void
  navigationTitle: string
}

// Function to extract clean preview text from article content
function getArticlePreview(content: string): string {
  // Create temporary div to parse HTML
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = content

  // Remove scripts and styles
  const scripts = tempDiv.querySelectorAll("script, style")
  scripts.forEach((el) => el.remove())

  // Get clean text
  let text = tempDiv.textContent || tempDiv.innerText || ""

  // Clean up whitespace
  text = text.replace(/\s+/g, " ").trim()

  // Return preview
  if (text.length > 150) {
    const breakPoint = text.lastIndexOf(" ", 150)
    return text.substring(0, breakPoint > 100 ? breakPoint : 150) + "..."
  }

  return text || "No preview available"
}

// Function to check if article has images
function hasImages(content: string): boolean {
  return (
    content.includes("<img") ||
    content.includes("data:image/") ||
    /https?:\/\/[^\s"']+\.(jpg|jpeg|png|gif|webp|svg)/i.test(content)
  )
}

export function SelectedArticles({
  categories,
  selectedCategories,
  selectedSubcategories,
  onArticleSelect,
  navigationTitle,
}: SelectedArticlesProps) {
  // Get filtered articles based on selected categories and subcategories
  const getFilteredArticles = (): Article[] => {
    const articles: Article[] = []

    categories.forEach((category) => {
      // If no filters are selected, show all articles
      const showAllCategories = selectedCategories.size === 0 && selectedSubcategories.size === 0
      const categorySelected = selectedCategories.has(category.id)

      // Add category articles
      if (showAllCategories || categorySelected) {
        if (Array.isArray(category.articles)) {
          articles.push(...category.articles)
        }
      }

      // Add subcategory articles
      if (Array.isArray(category.subcategories)) {
        category.subcategories.forEach((subcategory) => {
          const subcategorySelected = selectedSubcategories.has(subcategory.id)

          if (showAllCategories || categorySelected || subcategorySelected) {
            if (Array.isArray(subcategory.articles)) {
              articles.push(...subcategory.articles)
            }
          }
        })
      }
    })

    // Remove duplicates and sort by updated date
    const uniqueArticles = articles.filter(
      (article, index, self) => index === self.findIndex((a) => a.id === article.id),
    )

    return uniqueArticles.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

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

  const filteredArticles = getFilteredArticles()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{navigationTitle}</h2>
            <p className="text-gray-600">
              {filteredArticles.length === 0
                ? "No articles found"
                : `${filteredArticles.length} article${filteredArticles.length !== 1 ? "s" : ""} available`}
            </p>
          </div>
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
      </div>

      {/* Articles List */}
      {filteredArticles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Articles Found</h3>
            <p className="text-gray-600">
              {selectedCategories.size > 0 || selectedSubcategories.size > 0
                ? "No articles match your current filter selection."
                : "No articles are available in this knowledge base."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredArticles.map((article) => {
            const { categoryName, subcategoryName } = getCategoryInfo(article.categoryId, article.subcategoryId)
            const preview = getArticlePreview(article.content)
            const containsImages = hasImages(article.content)

            return (
              <Card
                key={`${article.id}-${article.updatedAt.getTime()}`}
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-200"
                onClick={() => onArticleSelect(article)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 text-gray-900 hover:text-blue-600 transition-colors">
                        {article.title}
                      </CardTitle>

                      <div className="flex items-center space-x-3 text-sm text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <FolderOpen className="h-4 w-4" />
                          <span>{categoryName}</span>
                          {subcategoryName && (
                            <>
                              <span>→</span>
                              <span>{subcategoryName}</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{article.updatedAt.toLocaleDateString()}</span>
                        </div>

                        {containsImages && (
                          <Badge variant="secondary" className="text-xs">
                            📷 Images
                          </Badge>
                        )}

                        {article.editCount && article.editCount > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Edit #{article.editCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {preview && (
                    <CardDescription className="text-gray-700 mb-3 leading-relaxed">{preview}</CardDescription>
                  )}

                  {article.tags && article.tags.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 4).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{article.tags.length - 4} more
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
      )}
    </div>
  )
}
