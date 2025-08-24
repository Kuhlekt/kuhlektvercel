"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LoginModal } from "./login-modal"
import { Search, User, LogOut, Settings, Menu, X } from "lucide-react"

interface NavigationProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  currentUser: any
  onLogin: (user: any) => void
  onLogout: () => void
  onShowAdmin: () => void
  pageVisits: number
}

export function Navigation({
  searchQuery,
  onSearchChange,
  currentUser,
  onLogin,
  onLogout,
  onShowAdmin,
  pageVisits,
}: NavigationProps) {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "editor":
        return "bg-blue-100 text-blue-800"
      case "viewer":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img src="/images/kuhlekt-logo.png" alt="Kuhlekt" className="h-8 w-8 rounded" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Kuhlekt KB</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Knowledge Base</p>
                </div>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search articles and categories..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {/* User Actions - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Page Visits */}
              <div className="text-sm text-gray-500">
                <span className="font-medium">{pageVisits.toLocaleString()}</span> visits
              </div>

              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{currentUser.username}</span>
                    <Badge className={`text-xs ${getRoleBadgeColor(currentUser.role)}`}>{currentUser.role}</Badge>
                  </div>
                  {currentUser.role === "admin" && (
                    <Button variant="outline" size="sm" onClick={onShowAdmin}>
                      <Settings className="h-4 w-4 mr-1" />
                      Admin
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={onLogout}>
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowLoginModal(true)}>
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search articles and categories..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              {/* Mobile User Actions */}
              <div className="space-y-3">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{pageVisits.toLocaleString()}</span> visits
                </div>

                {currentUser ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">{currentUser.username}</span>
                      <Badge className={`text-xs ${getRoleBadgeColor(currentUser.role)}`}>{currentUser.role}</Badge>
                    </div>
                    <div className="flex space-x-2">
                      {currentUser.role === "admin" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            onShowAdmin()
                            setIsMobileMenuOpen(false)
                          }}
                          className="flex-1"
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Admin
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onLogout()
                          setIsMobileMenuOpen(false)
                        }}
                        className="flex-1"
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      setShowLoginModal(true)
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={onLogin} />
    </>
  )
}
