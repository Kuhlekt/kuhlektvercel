"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Eye, Calendar, User, Tag, Star, Share2 } from "lucide-react"
import type { Article } from "../types/knowledge-base"

interface ArticleViewerProps {
  article: Article
  onBack: () => void
  onEdit?: () => void
  onAddToSelected?: () => void
  isInSelected?: boolean
}

export function ArticleViewer({ article, onBack, onEdit, onAddToSelected, isInSelected = false }: ArticleViewerProps) {
  const [isStarred, setIsStarred] = useState(isInSelected)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleStar = () => {
    setIsStarred(!isStarred)
    if (onAddToSelected) {
      onAddToSelected()
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.content.substring(0, 200) + "...",
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
      } catch (error) {
        console.log("Error copying to clipboard:", error)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Articles</span>
        </Button>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStar}
            className={`${
              isStarred ? "text-amber-600 hover:text-amber-700 bg-amber-50" : "text-gray-600 hover:text-amber-600"
            }`}
          >
            <Star className={`h-4 w-4 ${isStarred ? "fill-current" : ""}`} />
          </Button>

          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>

          {onEdit && (
            <Button onClick={onEdit} className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          )}
        </div>
      </div>

      {/* Article Content */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-bold">{article.title}</CardTitle>
              {!article.isPublished && (
                <Badge variant="secondary" className="text-sm">
                  Draft
                </Badge>
              )}
            </div>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>By {article.author}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Updated {formatDate(article.updatedAt)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>{article.views || 0} views</span>
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <div className="prose prose-gray max-w-none">
            {article.content.split("\n").map((paragraph, index) => {
              if (paragraph.trim() === "") {
                return <br key={index} />
              }

              // Handle headers
              if (paragraph.startsWith("# ")) {
                return (
                  <h1 key={index} className="text-2xl font-bold mt-8 mb-4">
                    {paragraph.substring(2)}
                  </h1>
                )
              }
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-xl font-semibold mt-6 mb-3">
                    {paragraph.substring(3)}
                  </h2>
                )
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={index} className="text-lg font-medium mt-4 mb-2">
                    {paragraph.substring(4)}
                  </h3>
                )
              }

              // Handle lists
              if (paragraph.startsWith("- ") || paragraph.startsWith("* ")) {
                return (
                  <li key={index} className="ml-4 mb-1">
                    {paragraph.substring(2)}
                  </li>
                )
              }

              // Handle numbered lists
              if (/^\d+\.\s/.test(paragraph)) {
                return (
                  <li key={index} className="ml-4 mb-1 list-decimal">
                    {paragraph.replace(/^\d+\.\s/, "")}
                  </li>
                )
              }

              // Regular paragraphs
              return (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Article Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <p>Created on {formatDate(article.createdAt)}</p>
              {article.createdAt !== article.updatedAt && <p>Last updated on {formatDate(article.updatedAt)}</p>}
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleStar}>
                <Star className={`h-4 w-4 mr-1 ${isStarred ? "fill-current text-amber-500" : ""}`} />
                {isStarred ? "Starred" : "Star"}
              </Button>

              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
