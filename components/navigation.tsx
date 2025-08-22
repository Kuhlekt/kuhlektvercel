"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, Plus, Settings } from "lucide-react"
import type { User as UserType } from "../types/knowledge-base"

interface NavigationProps {
  currentUser: UserType | null
  onLogin: () => void
  onLogout: () => void
  onViewChange: (view: "browse" | "add" | "admin") => void
  currentView: "browse" | "add" | "admin"
}

export function Navigation({ currentUser, onLogin, onLogout, onViewChange, currentView }: NavigationProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => onViewChange("browse")}>
            <img src="/images/kuhlekt-logo.png" alt="Kuhlekt Logo" className="h-12 w-auto object-contain" />
            <span className="ml-3 text-xl font-semibold text-gray-900">Knowledge Base</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant={currentView === "browse" ? "default" : "ghost"} onClick={() => onViewChange("browse")}>
              Browse
            </Button>

            {currentUser && (
              <>
                <span className="text-sm text-gray-600">Welcome, {currentUser.username}</span>
                {(currentUser.role === "admin" || currentUser.role === "editor") && (
                  <>
                    <Button
                      variant={currentView === "add" ? "default" : "outline"}
                      size="sm"
                      onClick={() => onViewChange("add")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Article
                    </Button>
                    <Button
                      variant={currentView === "admin" ? "default" : "outline"}
                      size="sm"
                      onClick={() => onViewChange("admin")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            )}

            {!currentUser && (
              <Button onClick={onLogin}>
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-4 space-y-2">
              <Button
                variant={currentView === "browse" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  onViewChange("browse")
                  setShowMobileMenu(false)
                }}
              >
                Browse
              </Button>

              {currentUser ? (
                <>
                  <div className="text-sm text-gray-600 pb-2 border-b">Welcome, {currentUser.username}</div>
                  {(currentUser.role === "admin" || currentUser.role === "editor") && (
                    <>
                      <Button
                        variant={currentView === "add" ? "default" : "outline"}
                        className="w-full justify-start bg-transparent"
                        onClick={() => {
                          onViewChange("add")
                          setShowMobileMenu(false)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Article
                      </Button>
                      <Button
                        variant={currentView === "admin" ? "default" : "outline"}
                        className="w-full justify-start bg-transparent"
                        onClick={() => {
                          onViewChange("admin")
                          setShowMobileMenu(false)
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => {
                      onLogout()
                      setShowMobileMenu(false)
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => {
                    onLogin()
                    setShowMobileMenu(false)
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
