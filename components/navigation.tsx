"use client"
import { Button } from "@/components/ui/button"
import { BookOpen, Plus, Settings, LogIn, LogOut, User } from "lucide-react"
import type { User as UserType } from "../types/knowledge-base"

interface NavigationProps {
  currentUser: UserType | null
  onLogin: () => void
  onLogout: () => void
  onViewChange: (view: "browse" | "add" | "edit" | "admin") => void
  currentView: "browse" | "add" | "edit" | "admin"
}

export function Navigation({ currentUser, onLogin, onLogout, onViewChange, currentView }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt Logo" className="h-8 w-auto" />
            <span className="text-xl font-semibold text-gray-900">Knowledge Base</span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {currentUser && (
              <>
                <Button
                  variant={currentView === "browse" ? "default" : "ghost"}
                  onClick={() => onViewChange("browse")}
                  className="flex items-center space-x-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Browse</span>
                </Button>

                {currentUser.role === "admin" && (
                  <>
                    <Button
                      variant={currentView === "add" ? "default" : "ghost"}
                      onClick={() => onViewChange("add")}
                      className="flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Article</span>
                    </Button>

                    <Button
                      variant={currentView === "admin" ? "default" : "ghost"}
                      onClick={() => onViewChange("admin")}
                      className="flex items-center space-x-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Admin</span>
                    </Button>
                  </>
                )}
              </>
            )}

            {/* User Actions */}
            <div className="flex items-center space-x-2">
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{currentUser.username}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{currentUser.role}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onLogout}
                    className="flex items-center space-x-1 bg-transparent"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <Button onClick={onLogin} className="flex items-center space-x-1">
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
