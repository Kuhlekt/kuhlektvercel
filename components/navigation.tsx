"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Settings, LogIn, LogOut, User } from "lucide-react"
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
            <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt Logo" className="h-8 w-8 object-contain" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Kuhlekt KB</h1>
              <p className="text-xs text-gray-500">Knowledge Base</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant={currentView === "browse" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("browse")}
              className="flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Browse</span>
            </Button>

            {/* Always show admin features since we're bypassing login */}
            <Button
              variant={currentView === "add" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("add")}
              className="flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Article</span>
            </Button>

            <Button
              variant={currentView === "admin" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("admin")}
              className="flex items-center space-x-1"
            >
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </Button>

            {/* User Info */}
            {currentUser && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{currentUser.username}</span>
                <Badge variant={currentUser.role === "admin" ? "default" : "secondary"} className="text-xs">
                  {currentUser.role}
                </Badge>
              </div>
            )}

            {/* Login/Logout Button - Hidden since we're bypassing login */}
            {!currentUser && (
              <Button
                variant="outline"
                size="sm"
                onClick={onLogin}
                className="flex items-center space-x-1 bg-transparent"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
            )}

            {currentUser && (
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center space-x-1 bg-transparent"
                style={{ display: "none" }} // Hide logout button since we're bypassing login
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
