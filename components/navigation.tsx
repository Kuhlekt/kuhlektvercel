"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserCircle, LogOut } from "lucide-react"
import Image from "next/image"

interface NavigationProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  onSearchSubmit: () => void
  isLoggedIn: boolean
  currentUser: string | null
  onLoginClick: () => void
  onLogoutClick: () => void
}

export function Navigation({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  isLoggedIn,
  currentUser,
  onLoginClick,
  onLogoutClick,
}: NavigationProps) {
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearchSubmit()
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 h-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/images/kuhlekt-logo.jpg"
              alt="Kuhlekt"
              width={80}
              height={80}
              className="h-20 w-20 object-contain"
            />
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search knowledge base..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <UserCircle className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{currentUser}</span>
                </div>
                <Button variant="outline" size="sm" onClick={onLogoutClick}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={onLoginClick}>
                <UserCircle className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
