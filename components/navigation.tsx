"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Settings, LogIn, LogOut, User } from "lucide-react"
import type { User as UserType } from "../types/knowledge-base"

interface NavigationProps {
  currentUser: UserType | null
  searchTerm: string
  onSearchChange: (term: string) => void
  onAddArticle: () => void
  onAdminPanel: () => void
  onLogin: () => void
  onLogout: () => void
}

export function Navigation({
  currentUser,
  searchTerm,
  onSearchChange,
  onAddArticle,
  onAdminPanel,
  onLogin,
  onLogout,
}: NavigationProps) {
  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">Kuhlekt Knowledge Base</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {currentUser ? (
            <div className="flex items-center space-x-3">
              {(currentUser.role === "admin" || currentUser.role === "editor") && (
                <Button onClick={onAddArticle} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Article
                </Button>
              )}

              {currentUser.role === "admin" && (
                <Button onClick={onAdminPanel} variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              )}

              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{currentUser.username}</span>
                  <span className="text-xs opacity-75">({currentUser.role})</span>
                </Badge>
                <Button onClick={onLogout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={onLogin} variant="outline" size="sm">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
