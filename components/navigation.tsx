"use client"

import type React from "react"

import { useState } from "react"
import { Search, Home, Settings, LogOut, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { User } from "../types/knowledge-base"

interface NavigationProps {
  onSearch: (query: string) => void
  onHome: () => void
  onAdmin?: () => void
  onLogin?: () => void
  onLogout: () => void
  currentView: "home" | "search" | "admin" | "article" | "login"
  currentUser?: User
}

export function Navigation({
  onSearch,
  onHome,
  onAdmin,
  onLogin,
  onLogout,
  currentView,
  currentUser,
}: NavigationProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt Logo" className="h-8 w-auto" />
            <h1 className="text-xl font-semibold text-gray-900">Knowledge Base</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={currentView === "home" ? "default" : "ghost"}
              size="sm"
              onClick={onHome}
              className="flex items-center space-x-1"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Button>

            {currentUser && (currentUser.role === "admin" || currentUser.role === "editor") && onAdmin && (
              <Button
                variant={currentView === "admin" ? "default" : "ghost"}
                size="sm"
                onClick={onAdmin}
                className="flex items-center space-x-1"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search knowledge base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button type="submit" size="sm">
              Search
            </Button>
          </form>

          {currentUser ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{currentUser.username}</span>
                <Badge variant="outline" className="capitalize">
                  {currentUser.role}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout} className="flex items-center space-x-1">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            onLogin && (
              <Button variant="default" size="sm" onClick={onLogin} className="flex items-center space-x-1">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
            )
          )}
        </div>
      </div>
    </nav>
  )
}
