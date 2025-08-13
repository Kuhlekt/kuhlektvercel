"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Tag, Camera } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface SelectedArticlesProps {
  categories: Category[]
  selectedCategories: Set<string>
  selectedSubcategories: Set<string>
  onArticleSelect: (article: Article) => void
}

// Function to extract clean text preview from content
function extractCleanText(html: string): string {
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = html

  const scripts = tempDiv.querySelectorAll("script, style")
  scripts.forEach((el) => el.remove())

  let processedHtml = html
  processedHtml = processedHtml.replace(/\[IMAGE:([^:]+):([^\]]+)\]/g, "[Image: $2]")
  processedHtml = processedHtml.replace(/data:image\/[^;]+;base64,[^\s"')]+/gi, "[Image]")
  processedHtml = processedHtml.replace(/https?:\/\/[^\s"')]+\.(jpg|jpeg|png|gif|webp|svg)/gi, "[Image]")

  tempDiv.innerHTML = processedHtml

  let text = tempDiv.textContent || tempDiv.innerText || ""
  text = text.replace(/\s+/g, " ").trim()

  const sentences = text.split(/[.!?]+/).filter((sentence) => {
    const cleaned = sentence.trim()
    return cleaned.length > 15 && cleaned.split(" ").length > 2 && cleaned !== "[Image]"
  })

  const preview = sentences.slice(0, 2).join(". ").trim()
  return preview.length > 150 ? preview.substring(0, 150) + "..." : preview
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

export function SelectedArticles({
  categories,
  selectedCategories,
  selectedSubcategories,
  onArticleSelect,
}: SelectedArticlesProps) {
  // Get filtered articles based on selected categories and subcategories
  const getFilteredArticles = (): Article[] => {
    const articles: Article[] = []

    categories.forEach((category) => {
      // If no categories selected, show all
      const showAllCategories = selectedCategories.size === 0 && selectedSubcategories.size === 0
      const categorySelected = selectedCategories.has(category.id)

      if (showAllCategories || categorySelected) {
        // Add category articles
        category.articles.forEach((article) => {
          articles.push(article)
        })

        // Add subcategory articles
        category.subcategories.forEach((subcategory) => {
          const subcategorySelected = selectedSubcategories.has(subcategory.id)

          if (showAllCategories || categorySelected || subcategorySelected) {
            subcategory.articles.forEach((article) => {
              articles.push(article)
            })
          }
        })
      } else {
        // Check if any subcategories are selected for this category
        category.subcategories.forEach((subcategory) => {
          if (selectedSubcategories.has(subcategory.id)) {
            subcategory.articles.forEach((article) => {
              articles.push(article)
            })
          }
        })
      }
    })

    // Sort by updated date (most recent first)
    return articles.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
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

  if (filteredArticles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-gray-500">
          <p className="text-lg mb-2">No articles found</p>
          <p className="text-sm">
            {selectedCategories.size > 0 || selectedSubcategories.size > 0
              ? "Try selecting different categories or clear your selection"
              : "No articles available in the knowledge base"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-semibold mb-2">
          {selectedCategories.size > 0 || selectedSubcategories.size > 0 ? "Filtered Articles" : "All Articles"} (
          {filteredArticles.length})
        </h2>
        <p className="text-gray-600">
          {selectedCategories.size > 0 || selectedSubcategories.size > 0
            ? `Showing articles from selected categories`
            : `Browse all available articles`}
        </p>
      </div>

      <div className="space-y-4">
        {filteredArticles.map((article) => {
          const { categoryName, subcategoryName } = getCategoryInfo(article.categoryId, article.subcategoryId)
          const cleanPreview = extractCleanText(article.content)
          const containsImages = hasImages(article.content)

          return (
            <Card
              key={`${article.id}-${article.updatedAt.getTime()}`}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onArticleSelect(article)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{article.title}</CardTitle>
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
                  <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-2">{cleanPreview}</CardDescription>
                )}
                {article.tags.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Tag className="h-3 w-3 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
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
