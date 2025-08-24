"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, FileText, Folder, Star } from "lucide-react"
import type { Article, Category } from "../types/knowledge-base"

interface SearchResult {
  type: "article" | "category"
  id: string
  title: string
  content?: string
  categoryPath?: string
  relevance: number
}

interface SearchResultsProps {
  results: SearchResult[]
  query: string
  onArticleSelect: (article: Article) => void
  onCategorySelect: (category: Category) => void
  onAddToSelected: (article: Article) => void
  selectedArticles: Article[]
}

export function SearchResults({
  results = [],
  query,
  onArticleSelect,
  onCategorySelect,
  onAddToSelected,
  selectedArticles = [],
}: SearchResultsProps) {
  const safeResults = Array.isArray(results) ? results : []
  const safeSelectedArticles = Array.isArray(selectedArticles) ? selectedArticles : []

  const highlightText = (text: string, query: string) => {
    if (!query) return text

    const regex = new RegExp(`(${query})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  const isArticleSelected = (articleId: string) => {
    return safeSelectedArticles.some((article) => article.id === articleId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Search className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Search Results</h2>
        <Badge variant="outline">{safeResults.length} results</Badge>
      </div>

      <div className="text-gray-600">
        Showing results for: <strong>"{query}"</strong>
      </div>

      {/* Results */}
      {safeResults.length > 0 ? (
        <div className="space-y-4">
          {safeResults.map((result) => (
            <Card key={`${result.type}-${result.id}`} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {result.type === "article" ? (
                        <FileText className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Folder className="h-4 w-4 text-orange-500" />
                      )}
                      <h3 className="text-lg font-semibold">{highlightText(result.title, query)}</h3>
                      <Badge variant="outline" className="text-xs">
                        {result.type}
                      </Badge>
                    </div>

                    {result.categoryPath && <div className="text-sm text-gray-500 mb-2">📁 {result.categoryPath}</div>}

                    {result.content && <p className="text-gray-600 mb-3">{highlightText(result.content, query)}</p>}

                    <div className="flex items-center space-x-4">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          if (result.type === "article") {
                            // Create a mock article object for selection
                            const article: Article = {
                              id: result.id,
                              title: result.title,
                              content: result.content || "",
                              categoryId: "",
                              author: "",
                              tags: [],
                              isPublished: true,
                              views: 0,
                              createdAt: new Date().toISOString(),
                              updatedAt: new Date().toISOString(),
                            }
                            onArticleSelect(article)
                          } else {
                            // Create a mock category object for selection
                            const category: Category = {
                              id: result.id,
                              name: result.title,
                              description: result.content || "",
                              isActive: true,
                              createdAt: new Date().toISOString(),
                              updatedAt: new Date().toISOString(),
                            }
                            onCategorySelect(category)
                          }
                        }}
                      >
                        {result.type === "article" ? "Read Article" : "Browse Category"}
                      </Button>

                      {result.type === "article" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const article: Article = {
                              id: result.id,
                              title: result.title,
                              content: result.content || "",
                              categoryId: "",
                              author: "",
                              tags: [],
                              isPublished: true,
                              views: 0,
                              createdAt: new Date().toISOString(),
                              updatedAt: new Date().toISOString(),
                            }
                            onAddToSelected(article)
                          }}
                          className={`${
                            isArticleSelected(result.id)
                              ? "text-amber-600 hover:text-amber-700 bg-amber-50"
                              : "text-gray-600 hover:text-amber-600"
                          }`}
                        >
                          <Star className={`h-4 w-4 mr-1 ${isArticleSelected(result.id) ? "fill-current" : ""}`} />
                          {isArticleSelected(result.id) ? "Starred" : "Star"}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="ml-4">
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(result.relevance * 100)}% match
                    </Badge>
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
              <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">No articles or categories match your search for "{query}"</p>
              <div className="text-sm text-gray-500">
                <p>Try:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Using different keywords</li>
                  <li>Checking your spelling</li>
                  <li>Using more general terms</li>
                  <li>Browsing categories instead</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
