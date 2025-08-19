"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Settings, LogIn, LogOut } from "lucide-react"
import type { KnowledgeBaseUser } from "../types/knowledge-base"

interface NavigationProps {
  currentUser: KnowledgeBaseUser | null
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
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">KB</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Kuhlekt Knowledge Base</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {currentUser ? (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>{currentUser.username}</span>
                  <span className="text-xs">({currentUser.role})</span>
                </Badge>

                {(currentUser.role === "admin" || currentUser.role === "editor") && (
                  <Button variant="outline" size="sm" onClick={onAddArticle}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Article
                  </Button>
                )}

                {currentUser.role === "admin" && (
                  <Button variant="outline" size="sm" onClick={onAdminPanel}>
                    <Settings className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                )}

                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={onLogin}>
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
