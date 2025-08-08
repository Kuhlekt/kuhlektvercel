"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, LogOut, Plus, Settings, Home } from 'lucide-react'
import type { User as UserType } from "../types/knowledge-base"

interface NavigationProps {
  currentUser: UserType | null
  onLogin: () => void
  onLogout: () => void
  onViewChange: (view: "browse" | "add" | "edit" | "admin") => void
  currentView: "browse" | "add" | "edit" | "admin"
}

export function Navigation({ 
  currentUser, 
  onLogin, 
  onLogout, 
  onViewChange, 
  currentView 
}: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and title */}
          <div className="flex items-center space-x-4">
            <img
              src="/images/kuhlekt-logo.jpg"
              alt="Kuhlekt Logo"
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-semibold text-gray-900">Knowledge Base</h1>
          </div>

          {/* Center - Navigation buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant={currentView === "browse" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("browse")}
            >
              <Home className="h-4 w-4 mr-2" />
              Browse
            </Button>

            {currentUser && (
              <Button
                variant={currentView === "add" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange("add")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Article
              </Button>
            )}

            {currentUser?.role === "admin" && (
              <Button
                variant={currentView === "admin" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange("admin")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
          </div>

          {/* Right side - User info */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{currentUser.username}</span>
                  <Badge variant="secondary" className="text-xs">
                    {currentUser.role}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={onLogin}>
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
