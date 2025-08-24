"use client"

import { Button } from "@/components/ui/button"
import type { User } from "@/types/knowledge-base"

interface NavigationProps {
  currentUser: User | null
  onLogin: () => void
  onLogout: () => void
  onViewChange: (view: "browse" | "add" | "admin") => void
  currentView: "browse" | "add" | "admin"
}

export function Navigation({ currentUser, onLogin, onLogout, onViewChange, currentView }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📚</span>
              <h1 className="text-xl font-bold text-gray-900">Kuhlekt Knowledge Base</h1>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Button variant={currentView === "browse" ? "default" : "ghost"} onClick={() => onViewChange("browse")}>
              📖 Browse
            </Button>

            {currentUser && (currentUser.role === "admin" || currentUser.role === "editor") && (
              <Button variant={currentView === "add" ? "default" : "ghost"} onClick={() => onViewChange("add")}>
                ➕ Add Article
              </Button>
            )}

            {currentUser?.role === "admin" && (
              <Button variant={currentView === "admin" ? "default" : "ghost"} onClick={() => onViewChange("admin")}>
                ⚙️ Admin
              </Button>
            )}

            {/* User Actions */}
            <div className="flex items-center space-x-2 border-l pl-4">
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    👤 {currentUser.username} ({currentUser.role})
                  </span>
                  <Button variant="outline" size="sm" onClick={onLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Button onClick={onLogin}>Login</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
