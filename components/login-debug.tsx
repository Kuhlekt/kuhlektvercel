"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bug, RefreshCw, LogIn } from "lucide-react"
import { storage } from "../utils/storage"
import { initialUsers } from "../data/initial-users"
import type { User as KnowledgeBaseUser } from "../types/knowledge-base"

interface LoginDebugProps {
  users: KnowledgeBaseUser[]
  onLogin: (user: KnowledgeBaseUser) => void
}

export function LoginDebug({ users, onLogin }: LoginDebugProps) {
  const [isVisible, setIsVisible] = useState(false)

  const handleResetUsers = () => {
    try {
      storage.saveUsers(initialUsers)
      window.location.reload()
    } catch (error) {
      console.error("Failed to reset users:", error)
    }
  }

  const handleDirectLogin = (user: KnowledgeBaseUser) => {
    const updatedUser = { ...user, lastLogin: new Date() }
    onLogin(updatedUser)
  }

  const storageUsers = storage.getUsers()

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
        >
          <Bug className="h-4 w-4 mr-2" />
          Debug Login
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 overflow-y-auto">
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-yellow-800 flex items-center space-x-2">
              <Bug className="h-4 w-4" />
              <span>Login Debug Panel</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
              ×
            </Button>
          </div>
          <CardDescription className="text-yellow-700">Debug login functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Users from Props */}
          <div>
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Users from Props ({users.length})</h4>
            <div className="space-y-1">
              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                      <span>{user.username}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDirectLogin(user)}
                      className="h-6 px-2 text-xs"
                    >
                      <LogIn className="h-3 w-3 mr-1" />
                      Login
                    </Button>
                  </div>
                ))
              ) : (
                <Alert className="py-2">
                  <AlertDescription className="text-xs">No users in props</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Users from Storage */}
          <div>
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Users from Storage ({storageUsers.length})</h4>
            <div className="space-y-1">
              {storageUsers.length > 0 ? (
                storageUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                      <span>{user.username}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDirectLogin(user)}
                      className="h-6 px-2 text-xs"
                    >
                      <LogIn className="h-3 w-3 mr-1" />
                      Login
                    </Button>
                  </div>
                ))
              ) : (
                <Alert className="py-2">
                  <AlertDescription className="text-xs">No users in storage</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Initial Users */}
          <div>
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Initial Users ({initialUsers.length})</h4>
            <div className="space-y-1">
              {initialUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {user.role}
                    </Badge>
                    <span>
                      {user.username} / {user.password}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDirectLogin(user)}
                    className="h-6 px-2 text-xs"
                  >
                    <LogIn className="h-3 w-3 mr-1" />
                    Login
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <Button variant="destructive" size="sm" onClick={handleResetUsers} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Users to Initial State
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
