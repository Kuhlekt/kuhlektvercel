"use client"

import { useState, useEffect } from "react"
import { Navigation } from "./components/navigation"
import { CategoryTree } from "./components/category-tree"
import { SelectedArticles } from "./components/selected-articles"
import { SearchResults } from "./components/search-results"
import { ArticleViewer } from "./components/article-viewer"
import { AddArticleForm } from "./components/add-article-form"
import { EditArticleForm } from "./components/edit-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { storage } from "./utils/storage"
import { initialCategories } from "./data/initial-data"
import type { Category, Article, User } from "./types/knowledge-base"

type View = "home" | "search" | "article" | "add-article" | "edit-article" | "admin"

export default function KnowledgeBase() {
  const [categories, setCategories] = useState<Category[]>([])
  const [currentView, setCurrentView] = useState<View>("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [selectedSubcategories, setSelectedSubcategories] = useState<Set<string>>(new Set())
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedCategories = storage.getCategories()
        if (storedCategories && storedCategories.length > 0) {
          setCategories(storedCategories)
        } else {
          setCategories(initialCategories)
          storage.saveCategories(initialCategories)
        }
      } catch (error) {
        console.error("Error loading data:", error)
        setCategories(initialCategories)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Save categories whenever they change
  useEffect(() => {
    if (categories.length > 0) {
      storage.saveCategories(categories)
    }
  }, [categories])

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setCurrentView("home")
      return
    }

    const results: Article[] = []
    const searchTerm = query.toLowerCase()

    categories.forEach((category) => {
      // Search in category articles
      category.articles.forEach((article) => {
        if (
          article.title.toLowerCase().includes(searchTerm) ||
          stripHtml(article.content).toLowerCase().includes(searchTerm) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
        ) {
          results.push(article)
        }
      })

      // Search in subcategory articles
      category.subcategories.forEach((subcategory) => {
        subcategory.articles.forEach((article) => {
          if (
            article.title.toLowerCase().includes(searchTerm) ||
            stripHtml(article.content).toLowerCase().includes(searchTerm) ||
            article.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
          ) {
            results.push(article)
          }
        })
      })
    })

    // Remove duplicates and sort by relevance
    const uniqueResults = results.filter((article, index, self) => index === self.findIndex((a) => a.id === article.id))

    setSearchResults(uniqueResults)
    setCurrentView("search")
  }

  const stripHtml = (html: string): string => {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = html
    return tempDiv.textContent || tempDiv.innerText || ""
  }

  const handleCategorySelect = (categoryId: string) => {
    const newSelected = new Set(selectedCategories)
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId)
    } else {
      newSelected.add(categoryId)
    }
    setSelectedCategories(newSelected)
  }

  const handleSubcategorySelect = (subcategoryId: string) => {
    const newSelected = new Set(selectedSubcategories)
    if (newSelected.has(subcategoryId)) {
      newSelected.delete(subcategoryId)
    } else {
      newSelected.add(subcategoryId)
    }
    setSelectedSubcategories(newSelected)
  }

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article)
    setCurrentView("article")
  }

  const handleAddArticle = (articleData: Omit<Article, "id" | "createdAt" | "updatedAt">) => {
    const newArticle: Article = {
      ...articleData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: currentUser?.username || "Unknown",
      editCount: 0,
    }

    const updatedCategories = categories.map((category) => {
      if (category.id === articleData.categoryId) {
        if (articleData.subcategoryId) {
          return {
            ...category,
            subcategories: category.subcategories.map((subcategory) =>
              subcategory.id === articleData.subcategoryId
                ? { ...subcategory, articles: [...subcategory.articles, newArticle] }
                : subcategory,
            ),
          }
        } else {
          return {
            ...category,
            articles: [...category.articles, newArticle],
          }
        }
      }
      return category
    })

    setCategories(updatedCategories)
    setCurrentView("home")
  }

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article)
    setCurrentView("edit-article")
  }

  const handleUpdateArticle = (updatedData: Omit<Article, "id" | "createdAt" | "updatedAt">) => {
    if (!editingArticle) return

    const updatedArticle: Article = {
      ...editingArticle,
      ...updatedData,
      updatedAt: new Date(),
      editCount: (editingArticle.editCount || 0) + 1,
      lastEditedBy: currentUser?.username || "Unknown",
    }

    const updatedCategories = categories.map((category) => {
      // Update in category articles
      const updatedCategoryArticles = category.articles.map((article) =>
        article.id === editingArticle.id ? updatedArticle : article,
      )

      // Update in subcategory articles
      const updatedSubcategories = category.subcategories.map((subcategory) => ({
        ...subcategory,
        articles: subcategory.articles.map((article) => (article.id === editingArticle.id ? updatedArticle : article)),
      }))

      return {
        ...category,
        articles: updatedCategoryArticles,
        subcategories: updatedSubcategories,
      }
    })

    setCategories(updatedCategories)
    setSelectedArticle(updatedArticle)
    setEditingArticle(null)
    setCurrentView("article")
  }

  const handleDeleteArticle = (articleId: string) => {
    const updatedCategories = categories.map((category) => ({
      ...category,
      articles: category.articles.filter((article) => article.id !== articleId),
      subcategories: category.subcategories.map((subcategory) => ({
        ...subcategory,
        articles: subcategory.articles.filter((article) => article.id !== articleId),
      })),
    }))

    setCategories(updatedCategories)
    setCurrentView("home")
  }

  const handleLogin = (user: User) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    if (currentView === "admin" || currentView === "add-article" || currentView === "edit-article") {
      setCurrentView("home")
    }
  }

  const handleShowAdmin = () => {
    if (currentUser?.role === "admin") {
      setCurrentView("admin")
    }
  }

  const handleBack = () => {
    if (currentView === "search") {
      setCurrentView("home")
      setSearchQuery("")
      setSearchResults([])
    } else {
      setCurrentView("home")
    }
    setSelectedArticle(null)
    setEditingArticle(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading knowledge base...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        onShowAdmin={handleShowAdmin}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "home" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <CategoryTree
                categories={categories}
                selectedCategories={selectedCategories}
                selectedSubcategories={selectedSubcategories}
                onCategorySelect={handleCategorySelect}
                onSubcategorySelect={handleSubcategorySelect}
              />
            </div>
            <div className="lg:col-span-3">
              <SelectedArticles
                categories={categories}
                selectedCategories={selectedCategories}
                selectedSubcategories={selectedSubcategories}
                onArticleSelect={handleArticleSelect}
              />
            </div>
          </div>
        )}

        {currentView === "search" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <CategoryTree
                categories={categories}
                selectedCategories={selectedCategories}
                selectedSubcategories={selectedSubcategories}
                onCategorySelect={handleCategorySelect}
                onSubcategorySelect={handleSubcategorySelect}
              />
            </div>
            <div className="lg:col-span-3">
              <SearchResults
                results={searchResults}
                categories={categories}
                query={searchQuery}
                onArticleSelect={handleArticleSelect}
              />
            </div>
          </div>
        )}

        {currentView === "article" && selectedArticle && (
          <ArticleViewer
            article={selectedArticle}
            categories={categories}
            onEdit={currentUser?.role === "admin" ? handleEditArticle : undefined}
            onDelete={currentUser?.role === "admin" ? handleDeleteArticle : undefined}
            onBack={handleBack}
            backButtonText={searchQuery ? "Back to Search Results" : "Back to Articles"}
          />
        )}

        {currentView === "add-article" && currentUser?.role === "admin" && (
          <AddArticleForm
            categories={categories}
            onSubmit={handleAddArticle}
            onCancel={handleBack}
            currentUser={currentUser}
          />
        )}

        {currentView === "edit-article" && editingArticle && currentUser?.role === "admin" && (
          <EditArticleForm
            article={editingArticle}
            categories={categories}
            onSubmit={handleUpdateArticle}
            onCancel={handleBack}
            currentUser={currentUser}
          />
        )}

        {currentView === "admin" && currentUser?.role === "admin" && (
          <AdminDashboard
            categories={categories}
            onCategoriesChange={setCategories}
            onAddArticle={() => setCurrentView("add-article")}
            onBack={handleBack}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  )
}
