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
import { User, LogIn, LogOut, Plus, Settings, Home, ChevronDown } from "lucide-react"
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
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <img src="/images/kuhlekt-logo.png" alt="Kuhlekt" className="h-8 w-auto" />
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold text-gray-900">Knowledge Base</h1>
              <Badge variant="outline" className="text-xs">
                v1.0
              </Badge>
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
                className="flex items-center"
              >
                <Home className="h-4 w-4 mr-2" />
                Browse
              </Button>

              {canAddArticles && (
                <Button
                  variant={currentView === "add" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange("add")}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Article
                </Button>
              )}

              {canAccessAdmin && (
                <Button
                  variant={currentView === "admin" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange("admin")}
                  className="flex items-center"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              )}
            </div>

            {/* User Menu */}
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{currentUser.username}</span>
                    <Badge className={`text-xs ${getRoleBadgeColor(currentUser.role)}`}>{currentUser.role}</Badge>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{currentUser.username}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={onLogin} size="sm" className="flex items-center">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
