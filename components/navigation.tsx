"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogIn, LogOut, Plus, Settings, Shield, BookOpen } from "lucide-react"
import type { User as UserType } from "../types/knowledge-base"

interface NavigationProps {
  currentUser: UserType | null
  onLogin: () => void
  onLogout: () => void
  onViewChange: (view: "browse" | "add" | "admin") => void
  currentView: "browse" | "add" | "admin"
}

export function Navigation({ currentUser, onLogin, onLogout, onViewChange, currentView }: NavigationProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "editor":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "viewer":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const canAddArticles = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")
  const canAccessAdmin = currentUser && currentUser.role === "admin"

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt" className="h-8 w-auto" />
            <div className="flex items-center space-x-1">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">Knowledge Base</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* View Navigation */}
            <div className="flex items-center space-x-2">
              <Button
                variant={currentView === "browse" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange("browse")}
                className="flex items-center space-x-1"
              >
                <BookOpen className="h-4 w-4" />
                <span>Browse</span>
              </Button>

              {canAddArticles && (
                <Button
                  variant={currentView === "add" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange("add")}
                  className="flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Article</span>
                </Button>
              )}

              {canAccessAdmin && (
                <Button
                  variant={currentView === "admin" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange("admin")}
                  className="flex items-center space-x-1"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Button>
              )}
            </div>

            {/* User Menu */}
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{currentUser.username}</span>
                    <Badge variant="secondary" className={getRoleBadgeColor(currentUser.role)}>
                      {currentUser.role}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{currentUser.username}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onViewChange("browse")}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Articles
                  </DropdownMenuItem>
                  {canAddArticles && (
                    <DropdownMenuItem onClick={() => onViewChange("add")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Article
                    </DropdownMenuItem>
                  )}
                  {canAccessAdmin && (
                    <DropdownMenuItem onClick={() => onViewChange("admin")}>
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={onLogin} className="flex items-center space-x-2">
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
