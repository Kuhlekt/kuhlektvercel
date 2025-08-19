"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LoginModal } from "./login-modal"
import { Search, Plus, Settings, LogOut, UserIcon } from "lucide-react"
import type { User, Article, Category } from "../types/knowledge-base"

interface NavigationProps {
  currentUser: User | null
  onLogin: (user: User) => void
  onLogout: () => void
  onSearch: (query: string) => void
  onAddArticle: () => void
  onAdminPanel: () => void
  searchResults: Article[]
  categories: Category[]
}

export function Navigation({
  currentUser,
  onLogin,
  onLogout,
  onSearch,
  onAddArticle,
  onAdminPanel,
  searchResults,
  categories,
}: NavigationProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handleLoginSuccess = (user: User) => {
    onLogin(user)
    setIsLoginModalOpen(false)
  }

  const canCreateArticles = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")
  const canAccessAdmin = currentUser && currentUser.role === "admin"

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt" className="h-8 w-8" />
              <h1 className="text-xl font-bold text-gray-900">Knowledge Base</h1>
            </div>

            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button type="submit" size="sm">
                Search
              </Button>
            </form>
          </div>

          <div className="flex items-center space-x-3">
            {canCreateArticles && (
              <Button onClick={onAddArticle} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Article
              </Button>
            )}

            {canAccessAdmin && (
              <Button onClick={onAdminPanel} variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Admin
              </Button>
            )}

            {currentUser ? (
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">{currentUser.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{currentUser.role}</div>
                </div>
                <Button onClick={onLogout} variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsLoginModalOpen(true)} size="sm">
                <UserIcon className="h-4 w-4 mr-1" />
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLoginSuccess} />
    </>
  )
}
