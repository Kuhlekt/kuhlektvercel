"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Edit, Trash2, Search, FileText, ImageIcon, Calendar, User } from "lucide-react"
import type { Category, Article } from "../types/knowledge-base"

interface ArticleManagementProps {
  categories: Category[]
  onEditArticle: (article: Article) => void
  onDeleteArticle: (articleId: string) => void
}

export function ArticleManagement({ categories, onEditArticle, onDeleteArticle }: ArticleManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Get all articles from all categories
  const getAllArticles = (): Array<Article & { categoryName: string; subcategoryName?: string }> => {
    const articles: Array<Article & { categoryName: string; subcategoryName?: string }> = []

    categories.forEach((category) => {
      // Add articles from main category
      category.articles.forEach((article) => {
        articles.push({
          ...article,
          categoryName: category.name,
        })
      })

      // Add articles from subcategories
      category.subcategories.forEach((subcategory) => {
        subcategory.articles.forEach((article) => {
          articles.push({
            ...article,
            categoryName: category.name,
            subcategoryName: subcategory.name,
          })
        })
      })
    })

    return articles.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  // Filter articles based on search and category
  const getFilteredArticles = () => {
    let articles = getAllArticles()

    // Filter by category
    if (selectedCategory !== "all") {
      const category = categories.find((cat) => cat.id === selectedCategory)
      if (category) {
        articles = articles.filter((article) => article.categoryId === selectedCategory)
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      articles = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          article.categoryName.toLowerCase().includes(query) ||
          (article.subcategoryName && article.subcategoryName.toLowerCase().includes(query)),
      )
    }

    return articles
  }

  const filteredArticles = getFilteredArticles()

  // Get content preview (remove HTML and limit length)
  const getContentPreview = (content: string) => {
    // Remove HTML tags and data URLs
    const textContent = content
      .replace(/<[^>]*>/g, "")
      .replace(/data:image[^"'\s]+/g, "[IMAGE]")
      .trim()

    return textContent.length > 150 ? textContent.substring(0, 150) + "..." : textContent
  }

  // Check if content has images
  const hasImages = (content: string) => {
    return content.includes("data:image") || /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)/i.test(content)
  }

  const handleDeleteClick = (article: Article) => {
    if (window.confirm(`Are you sure you want to delete "${article.title}"? This action cannot be undone.`)) {
      onDeleteArticle(article.id)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Article Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles by title, content, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Results Summary */}
        <div className="text-sm text-gray-600">
          Showing {filteredArticles.length} of {getAllArticles().length} articles
        </div>

        {/* Articles List */}
        {filteredArticles.length === 0 ? (
          <Alert>
            <AlertDescription>
              {searchQuery || selectedCategory !== "all"
                ? "No articles match your search criteria."
                : "No articles found. Create your first article using the Add Article tab."}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      {/* Title and Images Indicator */}
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{article.title}</h3>
                        {hasImages(article.content) && (
                          <ImageIcon className="h-4 w-4 text-gray-400" title="Contains images" />
                        )}
                      </div>

                      {/* Content Preview */}
                      <p className="text-gray-600 text-sm line-clamp-2">{getContentPreview(article.content)}</p>

                      {/* Metadata */}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Updated: {article.updatedAt.toLocaleDateString()}</span>
                        </div>
                        {article.createdBy && (
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>by {article.createdBy}</span>
                          </div>
                        )}
                      </div>

                      {/* Categories and Tags */}
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary">{article.categoryName}</Badge>
                        {article.subcategoryName && <Badge variant="outline">{article.subcategoryName}</Badge>}
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
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditArticle(article)}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(article)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
