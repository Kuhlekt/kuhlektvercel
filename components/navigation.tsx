"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, BarChart3, LogIn, LogOut, User } from 'lucide-react'
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
          {/* Left side - Logo/Title */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => onViewChange("browse")}
              className="text-lg font-semibold"
            >
              Knowledge Base
            </Button>
          </div>

          {/* Center - Navigation Items */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant={currentView === "browse" ? "default" : "ghost"}
              onClick={() => onViewChange("browse")}
            >
              Browse
            </Button>
            
            {currentUser && (
              <Button
                variant={currentView === "add" ? "default" : "ghost"}
                onClick={() => onViewChange("add")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Article
              </Button>
            )}
            
            {currentUser?.role === "admin" && (
              <Button
                variant={currentView === "admin" ? "default" : "ghost"}
                onClick={() => onViewChange("admin")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
          </div>

          {/* Right side - User Actions */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{currentUser.username}</span>
                  <Badge variant="outline" className="text-xs">
                    {currentUser.role}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={onLogin}>
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
