"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, Tag, Eye } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface ArticleListProps {
  articles: Article[]
  categories: Category[]
  onArticleSelect: (article: Article) => void
  title: string
}

// Helper function to safely format dates
const formatDate = (date: any): string => {
  try {
    if (!date) return "Unknown"

    let dateObj: Date
    if (date instanceof Date) {
      dateObj = date
    } else if (typeof date === "string") {
      dateObj = new Date(date)
    } else {
      return "Invalid Date"
    }

    if (isNaN(dateObj.getTime())) {
      return "Invalid Date"
    }

    return dateObj.toLocaleDateString()
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Date Error"
  }
}

export function ArticleList({ articles, categories, onArticleSelect, title }: ArticleListProps) {
  const getCategoryName = (categoryId: string, subcategoryId?: string): string => {
    for (const category of categories) {
      if (category.id === categoryId) {
        if (subcategoryId && category.subcategories) {
          const subcategory = category.subcategories.find((sub) => sub.id === subcategoryId)
          if (subcategory) {
            return `${category.name} > ${subcategory.name}`
          }
        }
        return category.name
      }
      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          if (subcategory.id === categoryId) {
            return `${category.name} > ${subcategory.name}`
          }
        }
      }
    }
    return "Unknown Category"
  }

  const truncateContent = (content: string, maxLength = 150): string => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength).trim() + "..."
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">
            {articles.length} {articles.length === 1 ? "article" : "articles"} found
          </p>
        </div>
      </div>

      {articles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500 mb-4">
              {title.includes("Search")
                ? "Try adjusting your search terms or browse categories"
                : "There are no articles in this category yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 hover:text-blue-600 transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(article.updatedAt)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {getCategoryName(article.categoryId, article.subcategoryId)}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 mb-4 leading-relaxed">{truncateContent(article.content)}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {article.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{article.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button onClick={() => onArticleSelect(article)} className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Read Article
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
