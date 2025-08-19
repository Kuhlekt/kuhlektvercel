"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, X, Settings, LogIn, LogOut, User } from "lucide-react"
import { LoginModal } from "./login-modal"
import type { User as UserType } from "../types/knowledge-base"

interface NavigationProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onSearch: (query: string) => void
  onShowAdmin: () => void
  currentUser: UserType | null
  onLogin: (user: UserType) => void
  onLogout: () => void
}

export function Navigation({
  searchQuery,
  onSearchChange,
  onSearch,
  onShowAdmin,
  currentUser,
  onLogin,
  onLogout,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim())
    }
  }

  const handleLoginSuccess = (user: UserType) => {
    onLogin(user)
    setShowLoginModal(false)
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm h-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt" className="h-20 w-20 object-contain" />
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search knowledge base..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </form>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{currentUser.username}</span>
                  </div>
                  {currentUser.role === "admin" && (
                    <Button variant="outline" size="sm" onClick={onShowAdmin}>
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={onLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setShowLoginModal(true)}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search knowledge base..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="w-full pl-10 pr-4"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </form>

                {/* Mobile Actions */}
                <div className="flex flex-col space-y-2">
                  {currentUser ? (
                    <>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 px-2">
                        <User className="h-4 w-4" />
                        <span>{currentUser.username}</span>
                      </div>
                      {currentUser.role === "admin" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onShowAdmin}
                          className="justify-start bg-transparent"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={onLogout} className="justify-start">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLoginModal(true)}
                      className="justify-start"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLoginSuccess} />
    </>
  )
}
