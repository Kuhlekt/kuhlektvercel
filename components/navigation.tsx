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
import { Home, Plus, Settings, User, LogIn, LogOut, Menu, Shield, Edit, Eye } from "lucide-react"
import type { User as UserType } from "../types/knowledge-base"

interface NavigationProps {
  currentUser: UserType | null
  onLogin: () => void
  onLogout: () => void
  onViewChange: (view: "browse" | "add" | "admin") => void
  currentView: "browse" | "add" | "admin"
}

export function Navigation({ currentUser, onLogin, onLogout, onViewChange, currentView }: NavigationProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-3 w-3" />
      case "editor":
        return <Edit className="h-3 w-3" />
      case "viewer":
        return <Eye className="h-3 w-3" />
      default:
        return <User className="h-3 w-3" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "editor":
        return "bg-blue-100 text-blue-800"
      case "viewer":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const canCreateArticles = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")
  const canAccessAdmin = currentUser && currentUser.role === "admin"

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <img src="/images/kuhlekt-logo.png" alt="Kuhlekt Logo" className="h-8 w-auto object-contain" />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-900">Knowledge Base</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant={currentView === "browse" ? "default" : "ghost"}
              onClick={() => onViewChange("browse")}
              className="flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>Browse</span>
            </Button>

            {canCreateArticles && (
              <Button
                variant={currentView === "add" ? "default" : "ghost"}
                onClick={() => onViewChange("add")}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Article</span>
              </Button>
            )}

            {canAccessAdmin && (
              <Button
                variant={currentView === "admin" ? "default" : "ghost"}
                onClick={() => onViewChange("admin")}
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Button>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">{currentUser.username}</span>
                    <Badge
                      variant="secondary"
                      className={`${getRoleColor(currentUser.role)} flex items-center space-x-1`}
                    >
                      {getRoleIcon(currentUser.role)}
                      <span className="capitalize">{currentUser.role}</span>
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{currentUser.username}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>
                  <DropdownMenuSeparator />

                  {/* Mobile Navigation Items */}
                  <div className="md:hidden">
                    <DropdownMenuItem onClick={() => onViewChange("browse")}>
                      <Home className="h-4 w-4 mr-2" />
                      Browse Articles
                    </DropdownMenuItem>

                    {canCreateArticles && (
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
                  </div>

                  <DropdownMenuItem onClick={onLogout}>
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

            {/* Mobile Menu */}
            {!currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewChange("browse")}>
                    <Home className="h-4 w-4 mr-2" />
                    Browse Articles
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
