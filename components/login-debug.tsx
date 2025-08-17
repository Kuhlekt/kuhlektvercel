"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { storage } from "../utils/storage"
import { initialUsers } from "../data/initial-users"
import type { User } from "../types/knowledge-base"

interface LoginDebugProps {
  users: User[]
  onLogin: (user: User) => void
}

export function LoginDebug({ users, onLogin }: LoginDebugProps) {
  const [debugInfo, setDebugInfo] = useState<string>("")

  const handleResetUsers = () => {
    try {
      storage.saveUsers(initialUsers)
      setDebugInfo("Users reset to initial state successfully!")
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      setDebugInfo(`Error resetting users: ${error}`)
    }
  }

  const handleDirectLogin = (user: User) => {
    const updatedUser = {
      ...user,
      lastLogin: new Date(),
    }

    // Update storage
    const allUsers = storage.getUsers()
    const updatedUsers = allUsers.map((u) => (u.id === user.id ? updatedUser : u))
    storage.saveUsers(updatedUsers)

    onLogin(updatedUser)
  }

  const storageUsers = storage.getUsers()

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-96 overflow-y-auto z-50 bg-yellow-50 border-yellow-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-yellow-800">🐛 Login Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div>
          <strong>Users from props ({users.length}):</strong>
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between ml-2">
              <span>
                {user.username} ({user.role})
              </span>
              <Button size="sm" variant="outline" onClick={() => handleDirectLogin(user)} className="h-6 text-xs">
                Login
              </Button>
            </div>
          ))}
        </div>

        <div>
          <strong>Users from storage ({storageUsers.length}):</strong>
          {storageUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between ml-2">
              <span>
                {user.username} ({user.role})
              </span>
              <Button size="sm" variant="outline" onClick={() => handleDirectLogin(user)} className="h-6 text-xs">
                Login
              </Button>
            </div>
          ))}
        </div>

        <div>
          <strong>Initial users ({initialUsers.length}):</strong>
          {initialUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between ml-2">
              <span>
                {user.username} ({user.role})
              </span>
              <Button size="sm" variant="outline" onClick={() => handleDirectLogin(user)} className="h-6 text-xs">
                Login
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="destructive" onClick={handleResetUsers} className="h-6 text-xs">
            Reset Users to Initial State
          </Button>
        </div>

        {debugInfo && (
          <div className="p-2 bg-white rounded border">
            <Badge variant="outline" className="text-xs">
              {debugInfo}
            </Badge>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>Storage health: {storage.checkHealth() ? "✅ OK" : "❌ Failed"}</p>
          <p>Has data: {storage.hasAnyData() ? "✅ Yes" : "❌ No"}</p>
        </div>
      </CardContent>
    </Card>
  )
}
