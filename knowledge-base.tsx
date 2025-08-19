"use client"

import { useState, useEffect } from "react"
import { Navigation } from "./components/navigation"
import { CategoryTree } from "./components/category-tree"
import { ArticleViewer } from "./components/article-viewer"
import { AddArticleForm } from "./components/add-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { LoginModal } from "./components/login-modal"
import { storage } from "./utils/storage"
import type { User, Category, Article } from "./types/knowledge-base"

export default function KnowledgeBase() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<"browse" | "add" | "admin">("browse")
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    console.log("🚀 Initializing Knowledge Base...")
    storage.init()

    const user = storage.getCurrentUser()
    if (user) {
      console.log("👤 Found existing user session:", user.username)
      setCurrentUser(user)
    }

    setCategories(storage.getCategories())
    setArticles(storage.getArticles())
    console.log("✅ Knowledge Base initialized")
  }, [])

  const handleLogin = (user: User) => {
    console.log("🔐 User logged in:", user.username)
    setCurrentUser(user)
  }

  const handleLogout = () => {
    console.log("🚪 User logged out")
    storage.setCurrentUser(null)
    setCurrentUser(null)
    setCurrentView("browse")
  }

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article)
    setCurrentView("browse")
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedArticle(null)
  }

  const handleAddArticle = (article: Article) => {
    const updatedArticles = [...articles, article]
    setArticles(updatedArticles)
    storage.saveArticles(updatedArticles)
    setCurrentView("browse")
    setSelectedArticle(article)
  }

  const handleUpdateArticles = (updatedArticles: Article[]) => {
    setArticles(updatedArticles)
    storage.saveArticles(updatedArticles)
  }

  const handleUpdateCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories)
    storage.saveCategories(updatedCategories)
  }

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === null || article.categoryId === selectedCategory

    return matchesSearch && matchesCategory
  })

  const renderContent = () => {
    switch (currentView) {
      case "add":
        return (
          <AddArticleForm
            categories={categories}
            onAddArticle={handleAddArticle}
            onCancel={() => setCurrentView("browse")}
            currentUser={currentUser}
          />
        )
      case "admin":
        return (
          <AdminDashboard
            articles={articles}
            categories={categories}
            onUpdateArticles={handleUpdateArticles}
            onUpdateCategories={handleUpdateCategories}
          />
        )
      default:
        return (
          <div className="flex flex-1 overflow-hidden">
            <div className="w-80 border-r bg-gray-50 overflow-y-auto">
              <CategoryTree
                categories={categories}
                articles={filteredArticles}
                onArticleSelect={handleArticleSelect}
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              <ArticleViewer article={selectedArticle} articles={filteredArticles} categories={categories} />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <Navigation
        currentUser={currentUser}
        onLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onViewChange={setCurrentView}
        currentView={currentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {renderContent()}

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />
    </div>
  )
}
