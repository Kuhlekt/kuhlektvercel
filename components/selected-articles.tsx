"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, ImageIcon } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface SelectedArticlesProps {
  categories: Category[]
  selectedCategories: Set<string>
  selectedSubcategories: Set<string>
  onArticleSelect: (article: Article) => void
}

export function SelectedArticles({
  categories,
  selectedCategories,
  selectedSubcategories,
  onArticleSelect,
}: SelectedArticlesProps) {
  const getSelectedArticles = () => {
    const articles: Array<Article & { categoryName: string; subcategoryName?: string }> = []

    categories.forEach((category) => {
      // Get articles from selected categories
      if (selectedCategories.has(category.id)) {
        category.articles.forEach((article) => {
          articles.push({
            ...article,
            categoryName: category.name,
          })
        })
      }

      // Get articles from selected subcategories
      category.subcategories.forEach((subcategory) => {
        if (selectedSubcategories.has(subcategory.id)) {
          subcategory.articles.forEach((article) => {
            articles.push({
              ...article,
              categoryName: category.name,
              subcategoryName: subcategory.name,
            })
          })
        }
      })
    })

    // Sort by creation date (newest first)
    return articles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Function to extract text content and check for images - simplified
  const getContentPreview = (content: string) => {
    const hasImages = content.includes("data:image") || /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)/i.test(content)

    // Remove image data URLs and URLs from preview text
    const textContent = content
      .replace(/data:image[^"'\s]+/g, "[IMAGE]")
      .replace(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)/gi, "[IMAGE]")
      .trim()

    const preview = textContent.substring(0, 150)

    return {
      preview: preview + (textContent.length > 150 ? "..." : ""),
      hasImages,
    }
  }

  const selectedArticles = getSelectedArticles()

  if (selectedArticles.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Articles in Selected Categories ({selectedArticles.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {selectedArticles.map((article) => {
            const { preview, hasImages } = getContentPreview(article.content)

            return (
              <div
                key={article.id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onArticleSelect(article)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-blue-600 hover:text-blue-800">{article.title}</h3>
                      {hasImages && <ImageIcon className="h-4 w-4 text-gray-400" title="Contains images" />}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{preview}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{article.createdAt.toLocaleDateString()}</span>
                      {article.createdBy && <span>• by {article.createdBy}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1 ml-4">
                    <Badge variant="secondary" className="text-xs">
                      {article.categoryName}
                    </Badge>
                    {article.subcategoryName && (
                      <Badge variant="outline" className="text-xs">
                        {article.subcategoryName}
                      </Badge>
                    )}
                  </div>
                </div>
                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {article.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
