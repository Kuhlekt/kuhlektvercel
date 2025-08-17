"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bug, RefreshCw, LogIn } from "lucide-react"
import { storage } from "../utils/storage"
import { initialUsers } from "../data/initial-users"
import type { KnowledgeBaseUser } from "../types/knowledge-base"

interface LoginDebugProps {
  users: KnowledgeBaseUser[]
  onLogin: (user: KnowledgeBaseUser) => void
  onUsersUpdate: (users: KnowledgeBaseUser[]) => void
}

export function LoginDebug({ users, onLogin, onUsersUpdate }: LoginDebugProps) {
  const storageUsers = storage.getUsers()

  const handleDirectLogin = (user: KnowledgeBaseUser) => {
    console.log("Direct login for user:", user.username)
    onLogin(user)
  }

  const handleResetUsers = () => {
    console.log("Resetting users to initial state")
    storage.saveUsers(initialUsers)
    onUsersUpdate(initialUsers)
  }

  return (
    <div className="space-y-4">
      <Alert>
        <Bug className="h-4 w-4" />
        <AlertDescription>
          <strong>Debug Panel:</strong> This panel helps troubleshoot login issues. Remove this component for
          production.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Users from Props */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center space-x-2">
              <Bug className="h-4 w-4" />
              <span>Users from Props</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600">Count: {users.length}</p>
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{user.username}</div>
                  <Badge variant="outline" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleDirectLogin(user)}>
                  <LogIn className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Users from Storage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center space-x-2">
              <Bug className="h-4 w-4" />
              <span>Users from Storage</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600">Count: {storageUsers.length}</p>
            {storageUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{user.username}</div>
                  <Badge variant="outline" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleDirectLogin(user)}>
                  <LogIn className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Initial Users */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center space-x-2">
              <Bug className="h-4 w-4" />
              <span>Initial Users</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600">Count: {initialUsers.length}</p>
            {initialUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{user.username}</div>
                  <Badge variant="outline" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleDirectLogin(user)}>
                  <LogIn className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleResetUsers} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Users to Initial State
        </Button>
      </div>
    </div>
  )
}
