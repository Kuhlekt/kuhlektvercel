"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"
import { storage } from "../utils/storage"
import { initialUsers } from "../data/initial-users"
import type { User as UserType } from "../types/knowledge-base"

interface LoginDebugProps {
  users: UserType[]
  onLogin: (user: UserType) => void
}

export function LoginDebug({ users, onLogin }: LoginDebugProps) {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleTestLogin = (user: UserType) => {
    try {
      const updatedUser = {
        ...user,
        lastLogin: new Date(),
      }

      // Update storage
      const allUsers = storage.getUsers()
      const updatedUsers = allUsers.map((u) => (u.id === user.id ? updatedUser : u))
      storage.saveUsers(updatedUsers)

      onLogin(updatedUser)
      setMessage({ type: "success", text: `Successfully logged in as ${user.name}` })
    } catch (error) {
      console.error("Login error:", error)
      setMessage({ type: "error", text: "Failed to log in" })
    }
  }

  const handleResetUsers = () => {
    try {
      storage.saveUsers(initialUsers)
      setMessage({ type: "success", text: "Users reset to initial state" })
      // Force a page reload to refresh the users state
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error("Reset error:", error)
      setMessage({ type: "error", text: "Failed to reset users" })
    }
  }

  const storageUsers = storage.getUsers()

  return (
    <div className="fixed bottom-4 right-4 w-96 z-50">
      <Card className="border-2 border-yellow-200 bg-yellow-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span>Login Debug Panel</span>
          </CardTitle>
          <CardDescription className="text-xs">Development tool - remove in production</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"} className="py-2">
              {message.type === "success" ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
              <AlertDescription className="text-xs">{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="text-xs font-medium">Users from Props ({users.length}):</div>
            {users.length > 0 ? (
              <div className="space-y-1">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3" />
                      <span>{user.username}</span>
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {user.role}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs bg-transparent"
                      onClick={() => handleTestLogin(user)}
                    >
                      Login
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-red-600">No users in props!</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium">Users from Storage ({storageUsers.length}):</div>
            {storageUsers.length > 0 ? (
              <div className="space-y-1">
                {storageUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3" />
                      <span>{user.username}</span>
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {user.role}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs bg-transparent"
                      onClick={() => handleTestLogin(user)}
                    >
                      Login
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-red-600">No users in storage!</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium">Initial Users ({initialUsers.length}):</div>
            <div className="space-y-1">
              {initialUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <User className="h-3 w-3" />
                    <span>{user.username}</span>
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      {user.role}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-xs bg-transparent"
                    onClick={() => handleTestLogin(user)}
                  >
                    Login
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button size="sm" variant="destructive" className="w-full h-7 text-xs" onClick={handleResetUsers}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Reset Users to Initial State
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
