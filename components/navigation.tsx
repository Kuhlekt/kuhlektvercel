"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Settings, LogIn, LogOut, Home } from "lucide-react"
import type { KnowledgeBaseUser } from "../types/knowledge-base"

interface NavigationProps {
  currentUser: KnowledgeBaseUser | null
  searchTerm: string
  onSearchChange: (term: string) => void
  onAddArticle: () => void
  onAdminPanel: () => void
  onLogin: () => void
  onLogout: () => void
  onHomeClick: () => void
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const canAddArticle = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")
  const canAccessAdmin = currentUser && currentUser.role === "admin"

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Home */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onHomeClick}
            className="flex items-center space-x-2 text-lg font-bold text-blue-600 hover:text-blue-700"
          >
            <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt" className="h-8 w-8 rounded" />
            <span>Kuhlekt KB</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={onHomeClick} className="hidden sm:flex">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search knowledge base..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Add Article Button */}
          {canAddArticle && (
            <Button onClick={onAddArticle} size="sm" className="hidden sm:flex">
              <Plus className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          )}

          {/* Admin Panel Button */}
          {canAccessAdmin && (
            <Button onClick={onAdminPanel} variant="outline" size="sm" className="hidden sm:flex bg-transparent">
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Button>
          )}

          {/* User Section */}
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {currentUser.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{currentUser.username}</span>
                  <Badge variant="outline" className="text-xs">
                    {currentUser.role}
                  </Badge>
                </div>
              </div>
              <Button onClick={onLogout} variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Button onClick={onLogin} variant="default" size="sm">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Home className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-gray-200">
          {/* Mobile Search */}
          <div className="mb-3">
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

          {/* Mobile Actions */}
          <div className="flex flex-col space-y-2">
            {canAddArticle && (
              <Button onClick={onAddArticle} size="sm" className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add Article
              </Button>
            )}

            {canAccessAdmin && (
              <Button onClick={onAdminPanel} variant="outline" size="sm" className="justify-start bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            )}

            {currentUser && (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {currentUser.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm font-medium">{currentUser.username}</div>
                  <Badge variant="outline" className="text-xs">
                    {currentUser.role}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
