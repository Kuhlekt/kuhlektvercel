"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, Plus, Eye, Calendar, User, Tag, Star } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface ArticleListProps {
  articles: Article[]
  categories: Category[]
  selectedCategory: string | null
  onArticleSelect: (article: Article) => void
}

export function ArticleList({ articles = [], categories = [], selectedCategory, onArticleSelect }: ArticleListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"title" | "date" | "views">("title")
  const [filterBy, setFilterBy] = useState<"all" | "published" | "draft">("all")

  // Safely handle undefined articles
  const safeArticles = Array.isArray(articles) ? articles : []
  const safeCategories = Array.isArray(categories) ? categories : []

  // Get category name
  const getCategoryName = (categoryId: string): string => {
    const category = safeCategories.find((cat) => cat.id === categoryId)
    return category?.name || "Unknown Category"
  }

  // Filter and sort articles
  const filteredArticles = safeArticles
    .filter((article) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      // Status filter
      const matchesStatus =
        filterBy === "all" ||
        (filterBy === "published" && article.isPublished) ||
        (filterBy === "draft" && !article.isPublished)

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case "views":
          return (b.views || 0) - (a.views || 0)
        case "title":
        default:
          return a.title.localeCompare(b.title)
      }
    })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <FileText className="h-6 w-6 mr-2" />
            {selectedCategory ? getCategoryName(selectedCategory) : "All Articles"}
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Article</span>
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={sortBy} onValueChange={(value: "title" | "date" | "views") => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="date">Latest First</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterBy} onValueChange={(value: "all" | "published" | "draft") => setFilterBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Articles</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      {filteredArticles.length > 0 ? (
        <div className="grid gap-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1" onClick={() => onArticleSelect(article)}>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold hover:text-blue-600 transition-colors">{article.title}</h3>
                      {!article.isPublished && <Badge variant="secondary">Draft</Badge>}
                    </div>

                    <p className="text-gray-600 mb-3">{truncateContent(article.content)}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(article.updatedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{article.views || 0} views</span>
                      </div>
                      {!selectedCategory && (
                        <div className="flex items-center space-x-1">
                          <FileText className="h-3 w-3" />
                          <span>{getCategoryName(article.categoryId)}</span>
                        </div>
                      )}
                    </div>

                    {article.tags && article.tags.length > 0 && (
                      <div className="flex items-center space-x-2 mt-3">
                        <Tag className="h-3 w-3 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
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
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterBy !== "all"
                  ? "Try adjusting your search or filters"
                  : selectedCategory
                    ? "This category doesn't have any articles yet"
                    : "No articles have been created yet"}
              </p>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create First Article</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
