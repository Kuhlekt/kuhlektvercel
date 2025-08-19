"use client"

import { Search, Plus, Settings, LogIn, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">KB</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Kuhlekt Knowledge Base</h1>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8">
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

        <div className="flex items-center space-x-2">
          {currentUser ? (
            <>
              {(currentUser.role === "editor" || currentUser.role === "admin") && (
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
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{currentUser.username}</div>
                  <div className="text-gray-500 capitalize">{currentUser.role}</div>
                </div>
              </div>

              <Button onClick={onLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={onLogin} size="sm">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
