"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Plus, Settings, LogOut, LogIn } from "lucide-react"
import type { User } from "../types/knowledge-base"

interface NavigationProps {
  currentUser: User | null
  onLogin: () => void
  onLogout: () => void
  onViewChange: (view: "browse" | "add" | "edit" | "admin") => void
  currentView: "browse" | "add" | "edit" | "admin"
}

export function Navigation({ currentUser, onLogin, onLogout, onViewChange, currentView }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b h-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt Logo" className="h-20 w-20" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant={currentView === "browse" ? "default" : "ghost"}
              onClick={() => onViewChange("browse")}
              className="flex items-center space-x-2"
            >
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Button
                variant={currentView === "browse" ? "default" : "ghost"}
                onClick={() => {
                  onViewChange("browse")
                  setIsMenuOpen(false)
                }}
                className="justify-start"
              >
                Browse
              </Button>

              {currentUser && (
                <>
                  <Button
                    variant={currentView === "add" ? "default" : "ghost"}
                    onClick={() => {
                      onViewChange("add")
                      setIsMenuOpen(false)
                    }}
                    className="justify-start"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Article
                  </Button>

                  <Button
                    variant={currentView === "admin" ? "default" : "ghost"}
                    onClick={() => {
                      onViewChange("admin")
                      setIsMenuOpen(false)
                    }}
                    className="justify-start"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </>
              )}

              <div className="pt-2 border-t">
                {currentUser ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 px-3">Welcome, {currentUser.username}</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        onLogout()
                        setIsMenuOpen(false)
                      }}
                      className="justify-start w-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      onLogin()
                      setIsMenuOpen(false)
                    }}
                    className="justify-start w-full"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
