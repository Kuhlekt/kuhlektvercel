"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, FileText, Folder, Calendar, User, Clock, BookOpen, Plus, ArrowRight } from "lucide-react"
import type { Category, Article, User as UserType } from "../types/knowledge-base"

interface HomeDashboardProps {
  categories: Category[]
  articles: Article[]
  users: UserType[]
  currentUser: UserType | null
  searchTerm: string
  onSearchChange: (term: string) => void
  onCategorySelect: (categoryId: string) => void
  onArticleSelect: (articleId: string) => void
  onAddArticle: () => void
}

export function HomeDashboard({
  categories,
  articles,
  users,
  currentUser,
  searchTerm,
  onSearchChange,
  onCategorySelect,
  onArticleSelect,
  onAddArticle,
}: HomeDashboardProps) {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "recent" | "popular">("all")

  // Get published articles only
  const publishedArticles = useMemo(() => {
    const published = articles.filter((article) => article.status === "published")
    console.log("📊 Published articles:", {
      total: articles.length,
      published: published.length,
      sample: published.slice(0, 2).map((a) => ({ id: a.id, title: a.title, status: a.status })),
    })
    return published
  }, [articles])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalArticles = publishedArticles.length
    const totalCategories = categories.length
    const recentArticles = publishedArticles.filter(
      (article) => Date.now() - article.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000,
    ).length

    return {
      totalArticles,
      totalCategories,
      recentArticles,
      totalUsers: users.length,
    }
  }, [publishedArticles, categories, users])

  // Get recent articles (last 7 days)
  const recentArticles = useMemo(() => {
    return publishedArticles
      .filter((article) => Date.now() - article.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
  }, [publishedArticles])

  // Get latest articles
  const latestArticles = useMemo(() => {
    return publishedArticles.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 8)
  }, [publishedArticles])

  // Filter articles based on search and filter
  const filteredArticles = useMemo(() => {
    let filtered = publishedArticles

    // Apply search filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Apply category/type filter
    switch (selectedFilter) {
      case "recent":
        filtered = filtered.filter((article) => Date.now() - article.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000)
        break
      case "popular":
        // For now, just show most recent as "popular"
        filtered = filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      default:
        filtered = filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    }

    return filtered.slice(0, 12) // Limit to 12 articles
  }, [publishedArticles, searchTerm, selectedFilter])

  // Get category name
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.name || "Uncategorized"
  }

  // Get author name
  const getAuthorName = (authorId: string, createdBy: string) => {
    const author = users.find((u) => u.id === authorId)
    return author?.username || createdBy || "Unknown"
  }

  // Extract preview text from content
  const getPreviewText = (content: string, maxLength = 120) => {
    // Remove HTML tags and get plain text
    const plainText = content
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim()
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText
  }

  const canAddArticle = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")

  return (
    <div className="flex-1 overflow-hidden bg-gray-50">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
                <p className="text-gray-600 mt-1">
                  {currentUser ? `Welcome back, ${currentUser.username}!` : "Explore our knowledge base"}
                </p>
              </div>
              {canAddArticle && (
                <Button onClick={onAddArticle}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Article
                </Button>
              )}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalArticles}</div>
                  <div className="text-sm text-gray-600">Articles</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.totalCategories}</div>
                  <div className="text-sm text-gray-600">Categories</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.recentArticles}</div>
                  <div className="text-sm text-gray-600">Recent</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.totalUsers}</div>
                  <div className="text-sm text-gray-600">Users</div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={selectedFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={selectedFilter === "recent" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("recent")}
                >
                  Recent
                </Button>
                <Button
                  variant={selectedFilter === "popular" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("popular")}
                >
                  Popular
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="max-w-7xl mx-auto p-6">
            {/* Show different content based on search */}
            {searchTerm.trim() ? (
              /* Search Results */
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Search Results for "{searchTerm}" ({filteredArticles.length})
                </h2>
                {filteredArticles.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                      <p className="text-gray-600">Try different keywords or browse categories below.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredArticles.map((article) => (
                      <Card
                        key={article.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => onArticleSelect(article.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2 hover:text-blue-600">{article.title}</h3>
                              <p className="text-gray-600 text-sm mb-3">{getPreviewText(article.content)}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Folder className="h-3 w-3" />
                                  <span>{getCategoryName(article.categoryId)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <User className="h-3 w-3" />
                                  <span>{getAuthorName(article.authorId, article.createdBy)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{article.createdAt.toLocaleDateString()}</span>
                                </div>
                              </div>
                              {article.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {article.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {article.tags.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{article.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 ml-4" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Home Content */
              <div className="space-y-8">
                {/* Recent Articles */}
                {recentArticles.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold flex items-center space-x-2">
                        <Clock className="h-5 w-5" />
                        <span>Recent Articles</span>
                      </h2>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedFilter("recent")}>
                        View all
                      </Button>
                    </div>
                    <div className="grid gap-3">
                      {recentArticles.map((article) => (
                        <Card
                          key={article.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => onArticleSelect(article.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium hover:text-blue-600">{article.title}</h3>
                                <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                                  <span>{getCategoryName(article.categoryId)}</span>
                                  <span>•</span>
                                  <span>{getAuthorName(article.authorId, article.createdBy)}</span>
                                  <span>•</span>
                                  <span>{article.createdAt.toLocaleDateString()}</span>
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                New
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Articles */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>All Articles</span>
                    </h2>
                  </div>

                  {latestArticles.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
                        <p className="text-gray-600 mb-4">Get started by creating your first article.</p>
                        {canAddArticle && (
                          <Button onClick={onAddArticle}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create First Article
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {latestArticles.map((article) => (
                        <Card
                          key={article.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => onArticleSelect(article.id)}
                        >
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2 hover:text-blue-600">{article.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{getPreviewText(article.content)}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <span>{getCategoryName(article.categoryId)}</span>
                                <span>•</span>
                                <span>{getAuthorName(article.authorId, article.createdBy)}</span>
                              </div>
                              <div className="text-xs text-gray-500">{article.createdAt.toLocaleDateString()}</div>
                            </div>
                            {article.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {article.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {article.tags.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{article.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Categories Overview */}
                {categories.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold flex items-center space-x-2">
                        <Folder className="h-5 w-5" />
                        <span>Categories</span>
                      </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {categories.slice(0, 8).map((category) => {
                        const categoryArticleCount = publishedArticles.filter(
                          (article) => article.categoryId === category.id,
                        ).length

                        return (
                          <Card
                            key={category.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => onCategorySelect(category.id)}
                          >
                            <CardContent className="p-4 text-center">
                              <Folder className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                              <h3 className="font-medium mb-1">{category.name}</h3>
                              <p className="text-xs text-gray-500">
                                {categoryArticleCount} article{categoryArticleCount !== 1 ? "s" : ""}
                              </p>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
