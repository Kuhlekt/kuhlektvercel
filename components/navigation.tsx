"use client"

import { Button } from "@/components/ui/button"
import { LogIn, LogOut, Plus, Settings, Home } from "lucide-react"
import type { User } from "../types/knowledge-base"

interface NavigationProps {
  currentUser: User | null
  onLogin: () => void
  onLogout: () => void
  onViewChange: (view: "browse" | "add" | "edit" | "admin") => void
  currentView: "browse" | "add" | "edit" | "admin"
}

export function Navigation({ currentUser, onLogin, onLogout, onViewChange, currentView }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b h-48">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo - 10x larger */}
          <div className="flex items-center space-x-3">
            <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt Logo" className="h-40 w-40 object-contain" />
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            <Button
              variant={currentView === "browse" ? "default" : "ghost"}
              onClick={() => onViewChange("browse")}
              className="flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
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

            {/* User Actions */}
            <div className="flex items-center space-x-2 border-l pl-4">
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Welcome, {currentUser.username}</span>
                  <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2 bg-transparent">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
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
