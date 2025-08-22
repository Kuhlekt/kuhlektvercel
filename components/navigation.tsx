"use client"

import { Button } from "@/components/ui/button"
import { LogIn, LogOut, Plus, Settings, User } from "lucide-react"
import type { User as UserType } from "../types/knowledge-base"

interface NavigationProps {
  currentUser: UserType | null
  onLogin: () => void
  onLogout: () => void
  onViewChange: (view: "browse" | "add" | "admin") => void
  currentView: "browse" | "add" | "admin"
}

export function Navigation({ currentUser, onLogin, onLogout, onViewChange, currentView }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b h-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/images/kuhlekt-logo.png"
              alt="Kuhlekt Logo"
              className="h-24 w-auto object-contain cursor-pointer"
              onClick={() => onViewChange("browse")}
            />
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Button variant={currentView === "browse" ? "default" : "ghost"} onClick={() => onViewChange("browse")}>
              Browse
            </Button>

            {currentUser && (
              <Button variant={currentView === "add" ? "default" : "ghost"} onClick={() => onViewChange("add")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Article
              </Button>
            )}

            {currentUser && (
              <Button variant={currentView === "admin" ? "default" : "ghost"} onClick={() => onViewChange("admin")}>
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{currentUser.username}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{currentUser.role}</span>
                </div>
                <Button variant="outline" onClick={onLogout}>
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
