"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, User, LogOut, Settings, Menu, X } from "lucide-react"
import { LoginModal } from "./login-modal"
import type { User as UserType } from "../types/knowledge-base"
import Image from "next/image"

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "editor":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "viewer":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Image
                  src="/images/kuhlekt-logo.png"
                  alt="Kuhlekt Logo"
                  width={48}
                  height={48}
                  className="h-12 w-auto"
                />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900">Knowledge Base</h1>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <>
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{currentUser.username}</span>
                    <Badge variant="secondary" className={getRoleBadgeColor(currentUser.role)}>
                      {currentUser.role}
                    </Badge>
                  </div>
                  {(currentUser.role === "admin" || currentUser.role === "editor") && (
                    <Button variant="outline" size="sm" onClick={onShowAdmin}>
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
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

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={onToggleMobileMenu}>
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>

              {/* Mobile User Menu */}
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 px-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{currentUser.username}</span>
                    <Badge variant="secondary" className={getRoleBadgeColor(currentUser.role)}>
                      {currentUser.role}
                    </Badge>
                  </div>
                  {(currentUser.role === "admin" || currentUser.role === "editor") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onShowAdmin}
                      className="w-full justify-start bg-transparent"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onLogout}
                    className="w-full justify-start bg-transparent"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowLoginModal(true)} className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          )}
        </div>
      </nav>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={(user) => {
          onLogin(user)
          setShowLoginModal(false)
        }}
      />
    </>
  )
}
