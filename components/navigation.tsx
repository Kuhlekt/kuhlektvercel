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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">KB</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Kuhlekt Knowledge Base</h1>
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{currentUser.username}</span>
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {currentUser.role}
                  </Badge>
                </div>

                {(currentUser.role === "admin" || currentUser.role === "editor") && (
                  <Button size="sm" onClick={onAddArticle} className="flex items-center space-x-1">
                    <Plus className="h-4 w-4" />
                    <span>Add Article</span>
                  </Button>
                )}

                {currentUser.role === "admin" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onAdminPanel}
                    className="flex items-center space-x-1 bg-transparent"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={onLogout}
                  className="flex items-center space-x-1 bg-transparent"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={onLogin} className="flex items-center space-x-1">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
