"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
            <img
              src="/images/kuhlekt-logo.png"
              alt="Kuhlekt Logo"
              className="h-8 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
              }}
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Knowledge Base</h1>
              <p className="text-sm text-gray-500">Kuhlekt Information System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="flex items-center space-x-2">
                <Button
                  variant={currentView === "browse" ? "default" : "ghost"}
                  onClick={() => onViewChange("browse")}
                  className="text-sm"
                >
                  📚 Browse
                </Button>

                {(currentUser.role === "admin" || currentUser.role === "editor") && (
                  <Button
                    variant={currentView === "add" ? "default" : "ghost"}
                    onClick={() => onViewChange("add")}
                    className="text-sm"
                  >
                    ➕ Add Article
                  </Button>
                )}

                {currentUser.role === "admin" && (
                  <Button
                    variant={currentView === "admin" ? "default" : "ghost"}
                    onClick={() => onViewChange("admin")}
                    className="text-sm"
                  >
                    ⚙️ Admin
                  </Button>
                )}
              </div>
            )}

            {/* User Menu */}
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {currentUser.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium">{currentUser.username}</div>
                      <div className="text-xs text-gray-500 capitalize">{currentUser.role}</div>
                    </div>
                    <span className="text-gray-400">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{currentUser.username}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                    <p className="text-xs text-gray-500 capitalize">Role: {currentUser.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onViewChange("browse")}>📚 Browse Articles</DropdownMenuItem>
                  {(currentUser.role === "admin" || currentUser.role === "editor") && (
                    <DropdownMenuItem onClick={() => onViewChange("add")}>➕ Add Article</DropdownMenuItem>
                  )}
                  {currentUser.role === "admin" && (
                    <DropdownMenuItem onClick={() => onViewChange("admin")}>⚙️ Admin Dashboard</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-red-600">
                    🚪 Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={onLogin} className="flex items-center space-x-2">
                <span>🔐</span>
                <span>Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
