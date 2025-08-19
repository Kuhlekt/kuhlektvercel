"use client"

import { Search, Plus, Settings, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { User as UserType } from "../types/knowledge-base"

interface NavigationProps {
  currentUser: UserType | null
  onLogin: () => void
  onLogout: () => void
  onViewChange: (view: "browse" | "add" | "admin") => void
  currentView: "browse" | "add" | "admin"
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function Navigation({
  currentUser,
  onLogin,
  onLogout,
  onViewChange,
  currentView,
  searchQuery,
  onSearchChange,
}: NavigationProps) {
  const canAddArticles = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")
  const canAccessAdmin = currentUser && currentUser.role === "admin"

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">KB</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Kuhlekt Knowledge Base</h1>
          </div>

          {currentView === "browse" && (
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
          )}
        </div>

        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <div className="flex items-center space-x-2">
                {canAddArticles && (
                  <Button
                    onClick={() => onViewChange("add")}
                    size="sm"
                    variant={currentView === "add" ? "default" : "outline"}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Article
                  </Button>
                )}

                {canAccessAdmin && (
                  <Button
                    onClick={() => onViewChange("admin")}
                    size="sm"
                    variant={currentView === "admin" ? "default" : "outline"}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                )}

                {currentView !== "browse" && (
                  <Button onClick={() => onViewChange("browse")} size="sm" variant="outline">
                    Browse
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{currentUser.username}</p>
                  <p className="text-gray-500 capitalize">{currentUser.role}</p>
                </div>
                <Button onClick={onLogout} size="sm" variant="ghost">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <Button onClick={onLogin} size="sm">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
