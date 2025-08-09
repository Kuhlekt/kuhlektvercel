'use client'

import { Button } from './ui/button'
import { Input } from './ui/input'
import { User } from '../types/knowledge-base'
import { Search, Settings, LogIn } from 'lucide-react'

interface NavigationProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  currentUser: User | null
  onLoginClick: () => void
  onAdminClick: () => void
}

export function Navigation({ 
  searchTerm, 
  onSearchChange, 
  currentUser, 
  onLoginClick, 
  onAdminClick 
}: NavigationProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">KB</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Kuhlekt Knowledge Base</h1>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-white/70 border-white/30 focus:bg-white focus:border-blue-300"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <Button 
                onClick={onAdminClick}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Admin
              </Button>
            ) : (
              <Button 
                onClick={onLoginClick}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
