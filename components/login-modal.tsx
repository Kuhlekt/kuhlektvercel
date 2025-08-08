'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import type { User } from '@/types/knowledge-base'

interface LoginModalProps {
  onLogin: (user: User) => void
  users: User[]
}

export function LoginModal({ onLogin, users = [] }: LoginModalProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const user = Array.isArray(users) ? users.find(u => 
        u && u.username === username && u.password === password
      ) : null

      if (user) {
        onLogin(user)
        setIsOpen(false)
        // Reset form
        setUsername('')
        setPassword('')
        setError('')
      } else {
        setError('Invalid username or password')
      }
    } catch (err) {
      setError('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setUsername('')
    setPassword('')
    setError('')
    setShowPassword(false)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-32 h-16 relative">
              <Image
                src="/images/kuhlekt-logo.jpg"
                alt="Kuhlekt Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold">Admin Sign In</DialogTitle>
          <DialogDescription>
            Sign in to access administrative features
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="modal-username">Username</Label>
            <Input
              id="modal-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="modal-password">Password</Label>
            <div className="relative">
              <Input
                id="modal-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
