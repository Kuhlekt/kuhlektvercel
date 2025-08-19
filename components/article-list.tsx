"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, User, Calendar } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface ArticleListProps {
  articles: Article[]
  categories: Category[]
  onArticleSelect: (article: Article) => void
  title: string
}

export function ArticleList({ articles, categories, onArticleSelect, title }: ArticleListProps) {
  const getCategoryName = (categoryId: string | null, subcategoryId?: string | null) => {
    if (!categoryId) return "Uncategorized"

    const category = categories.find((c) => c.id === categoryId)
    if (!category) return "Unknown Category"

    if (subcategoryId) {
      const subcategory = category.subcategories.find((s) => s.id === subcategoryId)
      return subcategory ? `${category.name} > ${subcategory.name}` : category.name
    }

    return category.name
  }

  const stripHtml = (html: string) => {
    const temp = document.createElement("div")
    temp.innerHTML = html
    return temp.textContent || temp.innerText || ""
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Badge variant="secondary">{articles.length} articles</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {articles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No articles found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4" onClick={() => onArticleSelect(article)}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {stripHtml(article.content).substring(0, 150)}...
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{article.createdBy || "Unknown"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <Badge variant="outline" className="text-xs">
                      {getCategoryName(article.categoryId, article.subcategoryId)}
                    </Badge>
                  </div>

                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
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
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
