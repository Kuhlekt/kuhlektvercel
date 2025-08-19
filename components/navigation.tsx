"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Settings, LogIn, LogOut, User, Home } from "lucide-react"
import type { User as UserType } from "../types/knowledge-base"

interface NavigationProps {
  currentUser: UserType | null
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
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt" className="h-8 w-8 rounded" />
            <Button
              variant="ghost"
              onClick={onHomeClick}
              className="text-xl font-bold text-gray-900 hover:bg-transparent p-0"
            >
              Knowledge Base
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onHomeClick && (
            <Button variant="ghost" size="sm" onClick={onHomeClick}>
              <Home className="h-4 w-4 mr-1" />
              Home
            </Button>
          )}

          {currentUser ? (
            <>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{currentUser.username}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{currentUser.role}</span>
              </div>

              {(currentUser.role === "admin" || currentUser.role === "editor") && (
                <Button onClick={onAddArticle} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Article
                </Button>
              )}

              {currentUser.role === "admin" && (
                <Button onClick={onAdminPanel} variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Admin
                </Button>
              )}

              <Button onClick={onLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={onLogin} size="sm">
              <LogIn className="h-4 w-4 mr-1" />
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
