"use client"

import { Search, Plus, Settings, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { User as UserType } from "../types/knowledge-base"

interface NavigationProps {
  currentUser: UserType | null
  searchQuery: string
  onSearchChange: (query: string) => void
  onLogin: () => void
  onLogout: () => void
  onViewChange: (view: "browse" | "add" | "admin") => void
  currentView: "browse" | "add" | "admin"
}

export function Navigation({
  currentUser,
  searchQuery,
  onSearchChange,
  onLogin,
  onLogout,
  onViewChange,
  currentView,
}: NavigationProps) {
  const canAddArticles = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")
  const canAccessAdmin = currentUser && currentUser.role === "admin"

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">KB</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Kuhlekt Knowledge Base</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={currentView === "browse" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("browse")}
            >
              Browse
            </Button>

            {canAddArticles && (
              <Button
                variant={currentView === "add" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange("add")}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Article
              </Button>
            )}

            {canAccessAdmin && (
              <Button
                variant={currentView === "admin" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange("admin")}
              >
                <Settings className="w-4 h-4 mr-1" />
                Admin
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {currentUser ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{currentUser.username}</div>
                  <div className="text-gray-500 capitalize">{currentUser.role}</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" onClick={onLogin}>
              <LogIn className="w-4 h-4 mr-1" />
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
