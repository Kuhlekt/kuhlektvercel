'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface PasswordPromptProps {
  onPasswordSubmit: (password: string) => void
  error?: string
}

export function PasswordPrompt({ onPasswordSubmit, error }: PasswordPromptProps) {
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onPasswordSubmit(password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Access Required</CardTitle>
          <CardDescription>
            Please enter the password to access the knowledge base
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <Button type="submit" className="w-full">
              Access Knowledge Base
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
