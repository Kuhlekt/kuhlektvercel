"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, User, Edit, Eye, Tag } from "lucide-react"
import type { Article, User as UserType } from "../types/knowledge-base"

interface ArticleListProps {
  articles: Article[]
  currentUser: UserType | null
  onViewArticle: (article: Article) => void
  onEditArticle?: (article: Article) => void
  showCategory?: boolean
  categoryName?: string
  subcategoryName?: string
}

export function ArticleList({
  articles = [],
  currentUser,
  onViewArticle,
  onEditArticle,
  showCategory = false,
  categoryName,
  subcategoryName,
}: ArticleListProps) {
  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")

  if (!articles || articles.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">
            {showCategory
              ? `No articles in ${subcategoryName ? `${categoryName} > ${subcategoryName}` : categoryName} yet.`
              : "No articles match your search criteria."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Card key={article.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{article.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {article.createdBy}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                  {article.editCount && article.editCount > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {article.editCount} {article.editCount === 1 ? "edit" : "edits"}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
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
            {/* Article Preview */}
            <div className="text-sm text-gray-700 mb-3 line-clamp-2">
              {article.content.replace(/[#*`]/g, "").substring(0, 200)}
              {article.content.length > 200 && "..."}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Category Info */}
            {showCategory && categoryName && (
              <div className="mt-2 text-xs text-gray-500">
                Category: {categoryName}
                {subcategoryName && ` > ${subcategoryName}`}
              </div>
            )}

            {/* Last Updated */}
            {article.updatedAt && new Date(article.updatedAt).getTime() !== new Date(article.createdAt).getTime() && (
              <div className="mt-2 text-xs text-gray-500">
                Last updated: {new Date(article.updatedAt).toLocaleDateString()}
                {article.lastEditedBy && ` by ${article.lastEditedBy}`}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
