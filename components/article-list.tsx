"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Edit, Eye, Calendar, User, Tag } from "lucide-react"
import type { Article, User as UserType } from "../types/knowledge-base"

interface ArticleListProps {
  articles: Article[]
  currentUser?: UserType | null
  onViewArticle: (article: Article) => void
  onEditArticle?: (article: Article) => void
  categoryName?: string
  subcategoryName?: string
  showCategory?: boolean
}

export function ArticleList({
  articles = [],
  currentUser,
  onViewArticle,
  onEditArticle,
  categoryName,
  subcategoryName,
  showCategory = false,
}: ArticleListProps) {
  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")

  if (!articles || articles.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">
            {categoryName || subcategoryName
              ? `No articles in ${subcategoryName || categoryName} yet.`
              : "No articles available yet."}
          </p>
          {canEdit && (
            <Button className="mt-4">
              <FileText className="h-4 w-4 mr-2" />
              Create First Article
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {categoryName && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {categoryName}
            {subcategoryName && <span className="text-gray-600"> / {subcategoryName}</span>}
          </h2>
          <p className="text-gray-600 mt-1">
            {articles.length} article{articles.length !== 1 ? "s" : ""} found
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{article.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {article.createdBy || "Unknown"}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(article.createdAt).toLocaleDateString()}
                    </div>
                    {article.updatedAt &&
                      new Date(article.updatedAt).getTime() !== new Date(article.createdAt).getTime() && (
                        <div className="flex items-center text-blue-600">
                          <Edit className="h-4 w-4 mr-1" />
                          Updated {new Date(article.updatedAt).toLocaleDateString()}
                        </div>
                      )}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => onViewArticle(article)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {canEdit && onEditArticle && (
                    <Button variant="outline" size="sm" onClick={() => onEditArticle(article)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Article preview */}
              <div className="text-gray-700 text-sm mb-3 line-clamp-3">
                {article.content.replace(/[#*`]/g, "").substring(0, 200)}
                {article.content.length > 200 && "..."}
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex items-center flex-wrap gap-2 mb-3">
                  <Tag className="h-4 w-4 text-gray-400" />
                  {article.tags.slice(0, 5).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {article.tags.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{article.tags.length - 5} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Category info (if showing category) */}
              {showCategory && <div className="text-xs text-gray-500">Category: {categoryName || "Unknown"}</div>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
