"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Tag, Camera, FileText } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface SelectedArticlesProps {
  categories: Category[]
  selectedCategories: Set<string>
  selectedSubcategories: Set<string>
  onArticleSelect: (article: Article) => void
}

// Enhanced function to extract clean text content from HTML and process images
function extractCleanText(html: string): string {
  // Create a temporary div to parse HTML properly
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = html

  // Remove script and style elements
  const scripts = tempDiv.querySelectorAll("script, style")
  scripts.forEach((el) => el.remove())

  // Process image placeholders
  let processedHtml = html
  processedHtml = processedHtml.replace(/\[IMAGE:([^:]+):([^\]]+)\]/g, "[Image: $2]")

  // Replace data URLs with [Image] placeholder for preview
  processedHtml = processedHtml.replace(/data:image\/[^;]+;base64,[^\s"')]+/gi, "[Image]")
  processedHtml = processedHtml.replace(/https?:\/\/[^\s"')]+\.(jpg|jpeg|png|gif|webp|svg)/gi, "[Image]")

  // Update temp div with processed HTML
  tempDiv.innerHTML = processedHtml

  // Get text content
  let text = tempDiv.textContent || tempDiv.innerText || ""

  // Clean up CSS-related text
  text = text.replace(/style\s*=\s*["'][^"']*["']/gi, "")
  text = text.replace(/class\s*=\s*["'][^"']*["']/gi, "")
  text = text.replace(/(width|height|margin|padding|color|font|background):\s*[^;]+;?/gi, "")
  text = text.replace(/\d+px/gi, "")
  text = text.replace(/(rgb|rgba|hex|#)[^;\s]*/gi, "")

  // Normalize whitespace
  text = text.replace(/\s+/g, " ").trim()

  // Split into sentences and filter meaningful ones
  const sentences = text.split(/[.!?]+/).filter((sentence) => {
    const cleaned = sentence.trim()
    return (
      cleaned.length > 15 &&
      !cleaned.match(/^(max-width|height|auto|margin|padding|border|display)/i) &&
      !cleaned.match(/^\d+$/) &&
      cleaned.split(" ").length > 2 &&
      cleaned !== "[Image]"
    )
  })

  // Return first meaningful sentences
  const preview = sentences.slice(0, 3).join(". ").trim()
  return preview.length > 200 ? preview.substring(0, 200) + "..." : preview
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
  // Get articles based on selected categories and subcategories
  const getFilteredArticles = (): Article[] => {
    console.log("SelectedArticles - Getting filtered articles")
    console.log("Selected categories:", Array.from(selectedCategories))
    console.log("Selected subcategories:", Array.from(selectedSubcategories))

    const articles: Article[] = []

    // If no specific selection, show recent articles from all categories
    if (selectedCategories.size === 0 && selectedSubcategories.size === 0) {
      console.log("No selections, showing all articles")
      categories.forEach((category) => {
        if (Array.isArray(category.articles)) {
          articles.push(...category.articles)
        }
        if (Array.isArray(category.subcategories)) {
          category.subcategories.forEach((subcategory) => {
            if (Array.isArray(subcategory.articles)) {
              articles.push(...subcategory.articles)
            }
          })
        }
      })
    } else {
      // Show articles from selected categories and subcategories
      categories.forEach((category) => {
        // If category is selected, include its direct articles
        if (selectedCategories.has(category.id)) {
          console.log(`Including articles from selected category: ${category.name}`)
          if (Array.isArray(category.articles)) {
            articles.push(...category.articles)
          }
        }

        // Check subcategories
        if (Array.isArray(category.subcategories)) {
          category.subcategories.forEach((subcategory) => {
            if (selectedSubcategories.has(subcategory.id)) {
              console.log(`Including articles from selected subcategory: ${subcategory.name}`)
              if (Array.isArray(subcategory.articles)) {
                articles.push(...subcategory.articles)
              }
            }
          })
        }
      })
    }

    // Sort by updated date (most recent first) and remove duplicates
    const uniqueArticles = articles.filter(
      (article, index, self) => index === self.findIndex((a) => a.id === article.id),
    )

    const sortedArticles = uniqueArticles.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

    console.log(`Filtered articles count: ${sortedArticles.length}`)
    return sortedArticles
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

  const getHeaderText = () => {
    if (selectedCategories.size === 0 && selectedSubcategories.size === 0) {
      return "Recent Articles"
    }

    const selectedCount = selectedCategories.size + selectedSubcategories.size
    return `Filtered Articles (${selectedCount} selection${selectedCount !== 1 ? "s" : ""})`
  }

  if (filteredArticles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <div className="text-gray-500">
          <p className="text-lg mb-2">No articles found</p>
          <p className="text-sm">
            {selectedCategories.size > 0 || selectedSubcategories.size > 0
              ? "Try selecting different categories or clear your selection"
              : "Start by adding some articles to your knowledge base"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-semibold mb-2">{getHeaderText()}</h2>
        <p className="text-gray-600">
          Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""}
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
