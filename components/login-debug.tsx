"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Database } from "lucide-react"
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
    const updatedUser = { ...user, lastLogin: new Date() }
    onLogin(updatedUser)
  }

  const handleResetUsers = () => {
    storage.saveUsers(initialUsers)
    onUsersUpdate(initialUsers)
  }

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Login Debug Panel</h3>
        <Button onClick={handleResetUsers} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Users to Initial State
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Users from Props */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Users from Props ({users.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                    <span className="text-sm">{user.username}</span>
                  </div>
                  <Button onClick={() => handleDirectLogin(user)} size="sm" variant="ghost">
                    Login
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No users in props</p>
            )}
          </CardContent>
        </Card>

        {/* Users from Storage */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Users from Storage ({storageUsers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {storageUsers.length > 0 ? (
              storageUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                    <span className="text-sm">{user.username}</span>
                  </div>
                  <Button onClick={() => handleDirectLogin(user)} size="sm" variant="ghost">
                    Login
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No users in storage</p>
            )}
          </CardContent>
        </Card>

        {/* Initial Users */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Initial Users ({initialUsers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {initialUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                  <span className="text-sm">{user.username}</span>
                </div>
                <Button onClick={() => handleDirectLogin(user)} size="sm" variant="ghost">
                  Login
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertDescription>
          This debug panel helps troubleshoot login issues. Use "Reset Users to Initial State" if login isn't working.
        </AlertDescription>
      </Alert>
    </div>
  )
}
