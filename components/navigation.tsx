"use client"
import { Button } from "@/components/ui/button"
import { User, LogOut, Plus, Settings, BookOpen } from "lucide-react"
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
    <nav className="bg-white shadow-sm border-b h-48">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-48">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt Logo" className="h-40 w-40" />
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            <Button
              variant={currentView === "browse" ? "default" : "ghost"}
              onClick={() => onViewChange("browse")}
              className="flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Browse</span>
            </Button>

            {currentUser && (
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

            {/* User Menu */}
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{currentUser.username}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="flex items-center space-x-1 bg-transparent"
                >
                  <LogOut className="h-3 w-3" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Button onClick={onLogin} className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
