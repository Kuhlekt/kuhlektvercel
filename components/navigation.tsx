"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogIn, LogOut, Plus, Settings, Home, Shield, Edit, Eye } from "lucide-react"
import type { User } from "../types/knowledge-base"

interface NavigationProps {
  currentUser: User | null
  onLogin: () => void
  onLogout: () => void
  onViewChange: (view: "browse" | "add" | "admin") => void
  currentView: "browse" | "add" | "admin"
}

export function Navigation({ currentUser, onLogin, onLogout, onViewChange, currentView }: NavigationProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "editor":
        return <Edit className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default"
      case "editor":
        return "secondary"
      default:
        return "outline"
    }
  }

  const canAddArticles = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")
  const canAccessAdmin = currentUser && currentUser.role === "admin"

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <img src="/images/kuhlekt-logo.png" alt="Kuhlekt" className="h-8 w-auto" />
            <span className="text-xl font-semibold text-gray-900">Knowledge Base</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {currentUser && (
              <>
                <Button
                  variant={currentView === "browse" ? "default" : "ghost"}
                  onClick={() => onViewChange("browse")}
                  className="flex items-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Browse</span>
                </Button>

                {canAddArticles && (
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
              </>
            )}

            {/* User Info & Auth */}
            <div className="flex items-center space-x-3">
              {currentUser ? (
                <>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getRoleBadgeVariant(currentUser.role)} className="flex items-center space-x-1">
                      {getRoleIcon(currentUser.role)}
                      <span className="capitalize">{currentUser.role}</span>
                    </Badge>
                    <span className="text-sm text-gray-700">{currentUser.username}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onLogout}
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <Button onClick={onLogin} className="flex items-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
