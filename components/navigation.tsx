"use client"

import { Search, Plus, Settings, LogIn, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt" className="h-8 w-auto" />
            <h1 className="text-xl font-bold text-gray-900">Knowledge Base</h1>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {currentUser ? (
            <>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{currentUser.username}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{currentUser.role}</span>
              </div>

              {(currentUser.role === "admin" || currentUser.role === "editor") && (
                <Button onClick={onAddArticle} size="sm" className="flex items-center space-x-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Article</span>
                </Button>
              )}

              {currentUser.role === "admin" && (
                <Button
                  onClick={onAdminPanel}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 bg-transparent"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Button>
              )}

              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <Button onClick={onLogin} size="sm" className="flex items-center space-x-1">
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
