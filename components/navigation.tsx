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
  const isAdmin = currentUser?.role === "admin"
  const canEdit = currentUser && (currentUser.role === "admin" || currentUser.role === "editor")

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Home */}
          <div className="flex items-center space-x-4">
            <img
              src="/images/kuhlekt-logo.png"
              alt="Kuhlekt"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
              }}
            />
            <Button
              variant={currentView === "browse" ? "default" : "ghost"}
              onClick={() => onViewChange("browse")}
              className="font-medium"
            >
              🏠 Home
            </Button>
          </div>

          {/* Center - Navigation Links */}
          <div className="flex items-center space-x-2">
            {canEdit && (
              <Button variant={currentView === "add" ? "default" : "ghost"} onClick={() => onViewChange("add")}>
                ➕ Add Article
              </Button>
            )}

            {isAdmin && (
              <Button variant={currentView === "admin" ? "default" : "ghost"} onClick={() => onViewChange("admin")}>
                ⚙️ Admin
              </Button>
            )}
          </div>

          {/* Right - User Menu */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                    <span className="text-lg">
                      {currentUser.role === "admin" ? "👑" : currentUser.role === "editor" ? "✏️" : "👁️"}
                    </span>
                    <span>{currentUser.username}</span>
                    <span className="text-xs text-muted-foreground">({currentUser.role})</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem disabled>
                    <div className="flex flex-col">
                      <div className="font-medium">{currentUser.username}</div>
                      <div className="text-sm text-muted-foreground">{currentUser.email}</div>
                      <div className="text-xs text-muted-foreground capitalize">{currentUser.role} Access</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onViewChange("browse")}>🏠 Browse Articles</DropdownMenuItem>
                  {canEdit && <DropdownMenuItem onClick={() => onViewChange("add")}>➕ Add Article</DropdownMenuItem>}
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => onViewChange("admin")}>⚙️ Admin Dashboard</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-red-600">
                    🚪 Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={onLogin} className="flex items-center space-x-2">
                🔐 <span>Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
