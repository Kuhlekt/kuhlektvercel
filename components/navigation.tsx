"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoginModal } from "./login-modal"
import { Search, Menu, X, User, LogOut, Plus, Settings } from "lucide-react"
import type { User as UserType } from "../types/knowledge-base"

interface NavigationProps {
  currentUser: UserType | null
  onLogin: (user: UserType) => void
  onLogout: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onSearch: () => void
  onShowAdmin: () => void
  showMobileMenu: boolean
  onToggleMobileMenu: () => void
}

export function Navigation({
  currentUser,
  onLogin,
  onLogout,
  searchQuery,
  onSearchChange,
  onSearch,
  onShowAdmin,
  showMobileMenu,
  onToggleMobileMenu,
}: NavigationProps) {
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    // This would normally make an API call
    // For now, we'll simulate with hardcoded users
    const users = [
      {
        id: "1",
        username: "admin",
        password: "admin123",
        email: "admin@kuhlekt.com",
        role: "admin" as const,
        createdAt: new Date(),
      },
      {
        id: "2",
        username: "editor",
        password: "editor123",
        email: "editor@kuhlekt.com",
        role: "editor" as const,
        createdAt: new Date(),
      },
      {
        id: "3",
        username: "viewer",
        password: "viewer123",
        email: "viewer@kuhlekt.com",
        role: "viewer" as const,
        createdAt: new Date(),
      },
    ]

    const user = users.find((u) => u.username === username && u.password === password)
    if (user) {
      onLogin(user)
      setShowLoginModal(false)
      return true
    }
    return false
  }

  return (
    <>
      <nav className="bg-white shadow-sm border-b h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/images/kuhlekt-logo.png" alt="Kuhlekt Logo" className="h-12 w-auto object-contain" />
              <span className="ml-3 text-xl font-semibold text-gray-900">Knowledge Base</span>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && onSearch()}
                  className="pl-10 w-full"
                />
              </div>
              <Button onClick={onSearch} className="ml-2">
                Search
              </Button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {currentUser.username}</span>
                  {(currentUser.role === "admin" || currentUser.role === "editor") && (
                    <>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Article
                      </Button>
                      <Button variant="outline" size="sm" onClick={onShowAdmin}>
                        <Settings className="h-4 w-4 mr-2" />
                        Admin
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm" onClick={onLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button onClick={() => setShowLoginModal(true)}>
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={onToggleMobileMenu}>
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && onSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={onSearch}>Search</Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-4 space-y-2">
              {currentUser ? (
                <>
                  <div className="text-sm text-gray-600 pb-2 border-b">Welcome, {currentUser.username}</div>
                  {(currentUser.role === "admin" || currentUser.role === "editor") && (
                    <>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Article
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent" onClick={onShowAdmin}>
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Button>
                    </>
                  )}
                  <Button variant="outline" className="w-full justify-start bg-transparent" onClick={onLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button className="w-full" onClick={() => setShowLoginModal(true)}>
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
    </>
  )
}
