"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { User as UserType } from "../types/knowledge-base"

interface NavigationProps {
  currentUser: UserType | null
  onLogin: () => void
  onLogout: () => void
  onViewChange: (view: "browse" | "add" | "admin") => void
  currentView: "browse" | "add" | "admin"
}

export function Navigation({ currentUser, onLogin, onLogout, onViewChange, currentView }: NavigationProps) {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "editor":
        return "default"
      case "viewer":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return "👑"
      case "editor":
        return "✏️"
      case "viewer":
        return "👁️"
      default:
        return "👤"
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <img src="/images/kuhlekt-logo.png" alt="Logo" className="h-8 w-auto" />
            <h1 className="text-xl font-semibold text-gray-900">Knowledge Base</h1>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            {currentUser && (
              <>
                <Button
                  variant={currentView === "browse" ? "default" : "ghost"}
                  onClick={() => onViewChange("browse")}
                  size="sm"
                >
                  <span className="mr-2">🏠</span>
                  Browse
                </Button>

                {(currentUser.role === "admin" || currentUser.role === "editor") && (
                  <Button
                    variant={currentView === "add" ? "default" : "ghost"}
                    onClick={() => onViewChange("add")}
                    size="sm"
                  >
                    <span className="mr-2">➕</span>
                    Add Article
                  </Button>
                )}

                {currentUser.role === "admin" && (
                  <Button
                    variant={currentView === "admin" ? "default" : "ghost"}
                    onClick={() => onViewChange("admin")}
                    size="sm"
                  >
                    <span className="mr-2">⚙️</span>
                    Admin
                  </Button>
                )}
              </>
            )}

            {/* User Info and Login/Logout */}
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">{getRoleIcon(currentUser.role)}</span>
                    <span className="text-sm font-medium text-gray-700">{currentUser.username}</span>
                  </div>
                  <Badge variant={getRoleBadgeVariant(currentUser.role)} className="text-xs">
                    {currentUser.role}
                  </Badge>
                </div>
                <Button variant="outline" onClick={onLogout} size="sm">
                  <span className="mr-2">🚪</span>
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={onLogin} size="sm">
                <span className="mr-2">🔐</span>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
