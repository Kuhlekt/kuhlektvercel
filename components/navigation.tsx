"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Settings, LogIn, LogOut, Home } from "lucide-react"
import type { User } from "../types/knowledge-base"

interface NavigationProps {
  currentUser: User | null
  searchTerm: string
  onSearchChange: (term: string) => void
  onAddArticle: () => void
  onAdminPanel: () => void
  onLogin: () => void
  onLogout: () => void
  onHomeClick?: () => void
}

export function Navigation({
  currentUser,
  searchTerm,
  onSearchChange,
  onAddArticle,
  onAdminPanel,
  onLogin,
  onLogout,
  onHomeClick,
}: NavigationProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const canAddArticle = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")
  const canAccessAdmin = currentUser && currentUser.role === "admin"

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Home */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt" className="h-8 w-8 rounded" />
            <h1 className="text-xl font-bold text-gray-900">Kuhlekt KB</h1>
          </div>
          {onHomeClick && (
            <Button variant="ghost" size="sm" onClick={onHomeClick} className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Button>
          )}
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search knowledge base..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Right side - Actions and User */}
        <div className="flex items-center space-x-4">
          {canAddArticle && (
            <Button onClick={onAddArticle} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          )}

          {canAccessAdmin && (
            <Button variant="outline" onClick={onAdminPanel} size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Button>
          )}

          {currentUser ? (
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{currentUser.username}</span>
                <Badge variant="outline" className="text-xs">
                  {currentUser.role}
                </Badge>
              </Button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{currentUser.username}</div>
                      <div className="text-xs text-gray-500">{currentUser.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        onLogout()
                        setIsUserMenuOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button onClick={onLogin} variant="outline" size="sm">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
