"use client"

import { useState } from "react"
import { Search, Book, MessageCircle, FileText, Video, ChevronRight } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    {
      title: "Getting Started",
      description: "Learn the basics of Kuhlekt AR Automation",
      icon: Book,
      articles: 12,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "AR Automation",
      description: "Automate your accounts receivable processes",
      icon: FileText,
      articles: 18,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Digital Collections",
      description: "Streamline your debt collection workflows",
      icon: MessageCircle,
      articles: 15,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides and walkthroughs",
      icon: Video,
      articles: 8,
      color: "bg-orange-100 text-orange-600"
    }
  ]

  const popularArticles = [
    {
      title: "How to Set Up Your First AR Automation Workflow",
      category: "Getting Started",
      readTime: "5 min read",
      views: "2.1k views"
    },
    {
      title: "Understanding DSO Reduction Metrics",
      category: "AR Automation",
      readTime: "8 min read",
      views: "1.8k views"
    },
    {
      title: "Best Practices for Digital Collections",
      category: "Digital Collections",
      readTime: "6 min read",
      views: "1.5k views"
    },
    {
      title: "Integrating with Your ERP System",
      category: "Getting Started",
      readTime: "10 min read",
      views: "1.3k views"
    },
    {
      title: "Managing Customer Payment Portals",
      category: "Digital Collections",
      readTime: "7 min read",
      views: "1.1k views"
    }
  ]

  const filteredArticles = popularArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">How can we help you?</h1>
          <p className="text-xl text-cyan-100 mb-8">
            Find answers, tutorials, and best practices for Kuhlekt AR Automation
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for articles, tutorials, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900 border-0 rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge variant="secondary">{category.articles} articles</Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Popular Articles */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {searchQuery ? `Search Results (${filteredArticles.length})` : 'Popular Articles'}
            </h2>
            {!searchQuery && (
              <Button variant="outline">
                View All Articles <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          <div className="grid gap-6">
            {filteredArticles.map((article, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-cyan-600 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <Badge variant="outline">{article.category}</Badge>
                        <span>{article.readTime}</span>
                        <span>{article.views}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {searchQuery && filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or browse our categories above.
              </p>
              <Button onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          )}
        </section>

        {/* Contact Support */}
        <section className="mt-16 bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-cyan-500 hover:bg-cyan-600">
              Contact Support
            </Button>
            <Button variant="outline">
              Schedule a Demo
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
